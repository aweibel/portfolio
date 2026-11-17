'use strict'

/**
 * Pulls the words a visitor can see out of a source file, with line numbers,
 * so the copy rules judge prose and not markup.
 *
 * - .html: visible text between tags, headings (h1-h6), and the title/meta
 *   description/og: attributes. Scripts, styles, HTML comments, and anything
 *   inside <pre> or <code> (verbatim input, including the dictated-transcript
 *   demo) are skipped, the same way a fenced code block is skipped in
 *   Markdown. alt and aria-label text counts: it's read by a screen reader.
 * - .txt: plain text with light Markdown (headings, links, lists).
 */

/**
 * @typedef {{text: string, line: number, raw: string, kind: 'paragraph'|'heading'|'string', meta?: boolean}} Segment
 */

function decodeEntities(s) {
  return s
    .replace(/&rsquo;|&lsquo;|&#x27;|&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;|&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
}

function stripTags(s) {
  return decodeEntities(s.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
}

/** @returns {Segment} */
function seg(text, line, raw, kind, meta) {
  return { text: decodeEntities(String(text)).replace(/\s+/g, ' ').trim(), line, raw, kind, ...(meta ? { meta: true } : {}) }
}

function extractHtml(source) {
  const lines = source.split('\n')
  /** @type {Segment[]} */
  const out = []
  let inScript = false
  let inStyle = false
  let inPre = false
  let inComment = false
  let prevAllow = false

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = i + 1
    let text = raw
    const allowedHere = /copy-allow:/.test(raw) || prevAllow
    prevAllow = /copy-allow:/.test(raw)

    if (inComment) {
      if (/-->/.test(text)) {
        inComment = false
        text = text.replace(/^[\s\S]*?-->/, '')
      } else {
        continue
      }
    }
    text = text.replace(/<!--[\s\S]*?-->/g, ' ')
    if (/<!--/.test(text)) {
      inComment = true
      text = text.replace(/<!--[\s\S]*$/, '')
    }

    if (inScript) {
      if (/<\/script>/i.test(text)) inScript = false
      continue
    }
    if (inStyle) {
      if (/<\/style>/i.test(text)) inStyle = false
      continue
    }
    if (inPre) {
      if (/<\/pre>/i.test(text)) {
        inPre = false
        text = text.replace(/^[\s\S]*?<\/pre>/i, ' ')
      } else {
        continue
      }
    }
    if (/<script\b[^>]*>/i.test(text) && !/<\/script>/i.test(text)) {
      inScript = true
      text = text.replace(/<script\b[^>]*>[\s\S]*$/i, ' ')
    }
    text = text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    if (/<style\b[^>]*>/i.test(text) && !/<\/style>/i.test(text)) {
      inStyle = true
      text = text.replace(/<style\b[^>]*>[\s\S]*$/i, ' ')
    }
    text = text.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    if (/<pre\b[^>]*>/i.test(text) && !/<\/pre>/i.test(text)) {
      inPre = true
      text = text.replace(/<pre\b[^>]*>[\s\S]*$/i, ' ')
    }
    text = text.replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, ' ')

    const allowed = allowedHere

    // <title>
    const titleMatch = text.match(/<title>([^<]*)<\/title>/)
    if (titleMatch) out.push({ ...seg(titleMatch[1], line, raw, 'string', true), allowed })

    // <meta name="description"|property="og:*" content="...">
    for (const m of text.matchAll(/<meta\s+(?:name|property)="(description|og:title|og:description|og:image:alt)"\s+content="([^"]*)"/g)) {
      out.push({ ...seg(m[2], line, raw, 'string', true), allowed })
    }

    // alt / aria-label: visible to a screen reader, real copy
    for (const m of text.matchAll(/\balt="([^"]*)"/g)) {
      if (m[1].trim()) out.push({ ...seg(m[1], line, raw, 'string', false), allowed })
    }
    for (const m of text.matchAll(/\baria-label="([^"]*)"/g)) {
      if (m[1].trim()) out.push({ ...seg(m[1], line, raw, 'string', false), allowed })
    }

    // headings
    const headingMatch = text.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/)
    if (headingMatch) {
      const clean = stripTags(headingMatch[1])
      if (clean) out.push({ ...seg(clean, line, raw, 'heading', false), allowed })
    }

    // remaining visible body text
    const body = text
      .replace(/<title>[\s\S]*?<\/title>/g, ' ')
      .replace(/<meta\b[^>]*>/g, ' ')
      .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g, ' ')
      .replace(/<(link|svg|filter|feturbulence|fecolormatrix|fecomposite)\b[^>]*\/?>/gi, ' ')
    const clean = stripTags(body)
    if (clean && /[a-zA-Z]/.test(clean)) out.push({ ...seg(clean, line, raw, 'paragraph', false), allowed })
  }
  return out
}

function extractText(source) {
  const lines = source.split('\n')
  /** @type {Segment[]} */
  const out = []
  let inCode = false
  let prevAllow = false

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = i + 1
    if (/^\s*```/.test(raw)) {
      inCode = !inCode
      continue
    }
    const allowed = /copy-allow:/.test(raw) || prevAllow
    prevAllow = /copy-allow:/.test(raw)
    if (inCode || !raw.trim()) continue
    const isHeading = /^\s*#{1,6}\s/.test(raw)
    const clean = raw
      .replace(/^\s*#{1,6}\s*/, '')
      .replace(/^\s*[-*+]\s+/, '')
      .replace(/`[^`]*`/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/https?:\/\/\S+/g, ' ')
    const text = stripTags(clean)
    if (text) out.push({ ...seg(text, line, raw, isHeading ? 'heading' : 'paragraph', false), allowed })
  }
  return out
}

function extract(source, file) {
  return file.endsWith('.html') ? extractHtml(source) : extractText(source)
}

module.exports = { extract, extractHtml, extractText }
