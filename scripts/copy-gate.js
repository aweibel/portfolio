#!/usr/bin/env node
'use strict'

const { formatFindings, runGate } = require('../lib/copy/gate')

/**
 * `npm run copy:gate`: run this before `vercel --prod` (see README). Exits
 * non-zero if anything is held (new or changed text, never reviewed) or
 * failed (reviewed text that no longer passes CONTENT-STYLE.md).
 */
const { results, failed, held } = runGate()
for (const r of [...failed, ...held]) console.log(formatFindings(r) + '\n')
if (failed.length || held.length) {
  console.log(`${failed.length} file(s) failed, ${held.length} file(s) held back for review. Run npm run copy:check, fix what it finds, then npm run copy:review -- <file> --reviewer "<who>".`)
  process.exitCode = 1
} else {
  console.log(`All ${results.length} tracked files are reviewed and clean.`)
}
