#!/usr/bin/env node
'use strict'

const { formatFindings, runGate } = require('../lib/copy/gate')

/**
 * `npm run copy:check [file…]`: shows rule findings. With file names, checks
 * just those files, whatever their state. Without, lists everything that's
 * held or failed, then a count of files already reviewed and clean.
 */
const files = process.argv.slice(2)
const { results } = runGate()
const chosen = files.length ? results.filter((r) => files.some((f) => r.file.includes(f))) : results.filter((r) => r.state !== 'reviewed' || r.findings.length)
for (const r of chosen) console.log(formatFindings(r) + '\n')
if (!files.length) {
  const clean = results.filter((r) => r.state === 'reviewed' && !r.findings.length)
  console.log(`${clean.length} of ${results.length} tracked files are reviewed and clean.`)
}
if (chosen.some((r) => r.findings.length || r.state === 'failed')) process.exitCode = 1
