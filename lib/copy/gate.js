'use strict'

const { existsSync, readFileSync } = require('node:fs')
const { join } = require('node:path')
const { extract } = require('./extract')
const { FIX, lint, loadRules } = require('./rules')
const { copyUnits, fingerprint, read } = require('./units')

/**
 * Decides what's cleared to publish. See "How copy gets published" in
 * CONTENT-STYLE.md for the process this enforces.
 *
 * This site has no build step, so nothing here can block a deploy by
 * itself: `copy:gate` reports what's unreviewed or broken, and the README
 * asks for a clean gate before `vercel --prod`.
 *
 * For each tracked file:
 * - reviewed, unchanged since, and passing the rules: reviewed
 * - reviewed but the text changed since, or never reviewed: held
 * - reviewed, unchanged, but no longer passes the rules in CONTENT-STYLE.md
 *   (the guide changed under it): failed
 */

function readJson(root, file) {
  const p = join(root, 'lib/copy', file)
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : {}
}

function runGate(root = process.cwd()) {
  const rules = loadRules(root)
  const reviews = readJson(root, 'reviews.json')
  const results = copyUnits(root).map((file) => {
    const source = read(file, root)
    const fp = fingerprint(source, file)
    const findings = lint(extract(source, file), rules)
    const review = reviews[file]
    if (review && review.fingerprint === fp) {
      return findings.length ? { file, state: 'failed', reason: 'reviewed, but no longer passes the rules in CONTENT-STYLE.md', findings } : { file, state: 'reviewed', findings }
    }
    const why = review ? 'changed since its review' : 'new and not reviewed'
    return { file, state: 'held', reason: why, findings }
  })
  return {
    results,
    failed: results.filter((r) => r.state === 'failed'),
    held: results.filter((r) => r.state === 'held'),
  }
}

function formatFindings(r) {
  const head = `${r.file}${r.reason ? ` (${r.reason})` : ''}`
  const rules = [...new Set(r.findings.map((f) => f.rule))]
  return [head, ...r.findings.map((f) => `  line ${f.line} [${f.rule}] ${f.message}`), ...rules.map((rule) => `  How to fix ${rule}: ${FIX[rule] ?? 'see CONTENT-STYLE.md.'}`)].join('\n')
}

module.exports = { runGate, formatFindings }
