'use strict'

const { readFileSync } = require('node:fs')
const { join } = require('node:path')

/**
 * The automatic half of the copy review. The word lists come from the
 * `copy-rules` block in CONTENT-STYLE.md, so the style guide is the input:
 * change the guide and the check changes with it.
 */

/** @typedef {{bannedWords: string[], bannedPhrases: string[], watchPhrases: string[], watchLimit: number}} CopyRules */
/** @typedef {{rule: string, line: number, message: string}} Finding */

/** How to fix each kind of finding, so a failed check always says what to do next. */
const FIX = {
  'em-dash': 'Split it into two sentences, or use a comma, colon, or brackets.',
  'en-dash': 'Use a comma, brackets, or "to" for a range.',
  'banned-word': 'Say what you mean in an everyday word, such as "use" for "leverage" or "important" for "crucial", or cut it.',
  'banned-phrase': 'Delete the phrase and state the point directly.',
  'ai-pattern': 'Say the one true thing plainly. Drop the contrast set-up.',
  overused: 'Vary the wording, or cut the repeats that add nothing.',
  'repeated-opener': 'Start those paragraphs in different ways.',
  'formula-heading': 'Make each heading say something specific in its own words.',
  staccato: 'Join some of the short sentences, so the rhythm sounds like someone talking.',
  'uk-spelling': 'Use the American spelling, e.g. prioritized, organize, center, catalog, labeled.',
}

function loadRules(root = process.cwd()) {
  const md = readFileSync(join(root, 'CONTENT-STYLE.md'), 'utf8')
  const block = md.match(/```copy-rules\n([\s\S]*?)```/)?.[1]
  if (!block) throw new Error('CONTENT-STYLE.md has no copy-rules block')
  const field = (key) =>
    (block.match(new RegExp(`^${key}:(.*)$`, 'm'))?.[1] ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  return {
    bannedWords: field('banned-words'),
    bannedPhrases: field('banned-phrases'),
    watchPhrases: field('watch-phrases'),
    watchLimit: Number(field('watch-limit')[0] ?? 4),
  }
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** Straight and curly apostrophes match each other. */
const phrase = (s) => escape(s).replace(/'/g, "['’]")
const wordRe = (w, flags = 'i') => new RegExp(`(?<![\\w-])${phrase(w)}(?![\\w-])`, flags)

/** AI sentence patterns that need more than a phrase match. */
const PATTERNS = [
  { re: /\bisn['’]?t\b[^.]*\babout\b[^.]*\.\s*(it['’]s|it is)\s+about\b/i, message: '"X isn\'t about A. It\'s about B."' },
  { re: /\bnot (just|only|merely)\b[^.]{0,60}[,;]\s*(it['’]s|it is|but)\b/i, message: '"not just X, it\'s Y"' },
  { re: /\bwhether you['’]re an?\b[^.]*\bor an?\b/i, message: '"whether you\'re a X or a Y"' },
]

const UK_SPELLING =
  /(?<![\w-])(behaviours?|behavioural|favour(s|ed|ing|ite|ites|able)?|colour(s|ed)?|honours?|candour|labour|neighbours?|centres?|centred|metres?|theatres?|organis(e|ed|es|ing|ation|ations)|optimis(e|ed|es|ing|ation)|recognis(e|ed|es|ing|able)|summaris(e|ed|es|ing|er)|prioritis(e|ed|es|ing)|analys(e|ed|ing)|standardis(e|ed|es|ing)|authoris(e|ed|es|ing|ation)|personalis(e|ed|ation)|criticis(e|ed|es|ing)|anonymis(e|ed|es|ing|ation)|labelled|labelling|modelled|modelling|travelled|travelling|cancelled|cancelling|judgements?|acknowledgement|catalogues?|programmes?|licences?|defences?|offences?|whilst|amongst|grey|fulfil|sceptical|per cent)(?![\w-])/i

const sentences = (text) =>
  text
    .split(/(?<=[.!?])\s+(?=[A-Z"“(])/)
    .map((s) => s.trim())
    .filter(Boolean)
const words = (s) => s.split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w))

/**
 * @param {import('./extract').Segment[]} segments
 * @param {CopyRules} rules
 * @returns {Finding[]}
 */
function lint(segments, rules) {
  /** @type {Finding[]} */
  const findings = []
  const add = (s, rule, message) => findings.push({ rule, line: s.line, message })
  const prose = segments.filter((s) => !s.allowed)

  for (const s of prose) {
    if (/—|&mdash;|&#8212;/.test(s.text)) add(s, 'em-dash', 'Em dash. Use a comma, colon, full stop, brackets, or a new sentence.')
    if (/\s[–]\s|&ndash;/.test(s.text)) add(s, 'en-dash', 'Spaced en dash used as a dash.')
    for (const w of rules.bannedWords) if (wordRe(w).test(s.text)) add(s, 'banned-word', `Banned word: "${w}".`)
    for (const p of rules.bannedPhrases) if (wordRe(p).test(s.text)) add(s, 'banned-phrase', `Banned phrase: "${p}".`)
    for (const p of PATTERNS) if (p.re.test(s.text)) add(s, 'ai-pattern', `AI sentence pattern: ${p.message}`)
  }

  // American spelling. A proper name or quotation that keeps its own
  // spelling takes a copy-allow comment.
  for (const s of prose) {
    if (/["{}<>]|https?:|:\/\//.test(s.text)) continue
    const m = s.text.match(UK_SPELLING)
    if (m) add(s, 'uk-spelling', `British spelling "${m[0]}". The house style is American (CONTENT-STYLE.md).`)
  }

  // Watched phrases: fine now and then, a tell when they pile up.
  for (const p of rules.watchPhrases) {
    const re = new RegExp(wordRe(p).source, 'gi')
    const count = prose.reduce((n, s) => n + (s.text.match(re)?.length ?? 0), 0)
    if (count > rules.watchLimit) {
      const first = prose.find((s) => wordRe(p).test(s.text))
      add(first, 'overused', `"${p}" appears ${count} times. The limit is ${rules.watchLimit}.`)
    }
  }

  // Structure: the same opening on three or more paragraphs. A line that
  // doesn't open a block element is a wrapped continuation of the previous
  // one (long table-cell prose wraps across source lines), not a new
  // paragraph, so it can't "open" with anything.
  const opensBlock = (s) => /^\s*<(p|li|dd|dt|blockquote|figcaption|td|th|div|summary|h[1-6])\b/i.test(s.raw)
  const openers = new Map()
  for (const s of prose.filter((x) => x.kind === 'paragraph' && opensBlock(x))) {
    const key = words(s.text).slice(0, 3).join(' ').toLowerCase().replace(/[^a-z0-9' ]/g, '')
    if (words(s.text).length < 6 || key.split(' ').length < 3) continue
    openers.set(key, [...(openers.get(key) ?? []), s])
  }
  for (const [, list] of openers) if (list.length >= 3) add(list[0], 'repeated-opener', `${list.length} paragraphs open with the same three words.`)

  // Structure: headings built on one formula.
  const formula = prose.filter((s) => s.kind === 'heading' && /:\s+(the|a|an|every|why|how|what|when|where)\b/i.test(s.text))
  if (formula.length >= 3) add(formula[0], 'formula-heading', `${formula.length} headings use the "X: the Y" formula.`)

  // Rhythm: runs of very short sentences.
  for (const s of prose.filter((x) => x.kind === 'paragraph')) {
    let run = 0
    for (const sentence of sentences(s.text)) {
      run = words(sentence).length <= 7 ? run + 1 : 0
      if (run === 4) {
        add(s, 'staccato', 'Four or more very short sentences in a row. Mix short and long.')
        break
      }
    }
  }

  return findings.sort((a, b) => a.line - b.line)
}

module.exports = { FIX, lint, loadRules }
