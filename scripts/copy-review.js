#!/usr/bin/env node
'use strict'

const { existsSync, readFileSync, writeFileSync } = require('node:fs')
const { join } = require('node:path')
const { extract } = require('../lib/copy/extract')
const { lint, loadRules } = require('../lib/copy/rules')
const { fingerprint, read } = require('../lib/copy/units')

/**
 * `npm run copy:review -- <file> --reviewer "<who>"`: records that a human
 * (or, if the summary says so, Claude standing in for one) read this file
 * against CONTENT-STYLE.md and found nothing it couldn't check for itself.
 * Refuses if the automatic check still finds something.
 */
const args = process.argv.slice(2)
const reviewerIdx = args.indexOf('--reviewer')
const reviewer = reviewerIdx >= 0 ? args[reviewerIdx + 1] : null
const file = args.filter((_, i) => i !== reviewerIdx && i !== reviewerIdx + 1)[0]

if (!file || !reviewer) {
  console.error('Usage: npm run copy:review -- <file> --reviewer "<who>"')
  process.exitCode = 1
  process.exit()
}

const root = process.cwd()
const source = read(file, root)
const findings = lint(extract(source, file), loadRules(root))
if (findings.length) {
  console.error(`${file} still fails the check (${findings.length} finding(s)). Run npm run copy:check ${file} first.`)
  process.exitCode = 1
  process.exit()
}

const reviewsPath = join(root, 'lib/copy/reviews.json')
const reviews = existsSync(reviewsPath) ? JSON.parse(readFileSync(reviewsPath, 'utf8')) : {}
reviews[file] = { fingerprint: fingerprint(source, file), reviewedOn: new Date().toISOString().slice(0, 10), reviewer }
writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2) + '\n')
console.log(`Recorded: ${file}, reviewed by ${reviewer}.`)
