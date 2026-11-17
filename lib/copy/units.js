'use strict'

const { createHash } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { join } = require('node:path')
const { extract } = require('./extract')

/**
 * Every file a visitor (human or AI tool) reads words from. This site is five
 * static files with no build step, so the list is just written out, rather
 * than discovered by walking a framework's page directory.
 */
const UNITS = ['index.html', 'case-study-skill/index.html', 'screen-showcase-skill/index.html', 'llms.txt', 'ai.txt']

function copyUnits() {
  return UNITS.slice()
}

const read = (file, root = process.cwd()) => readFileSync(join(root, file), 'utf8')

/**
 * A fingerprint of the words a visitor sees, not of the whole file, so an
 * HTML/CSS tweak that doesn't touch any text doesn't need a new review.
 */
function fingerprint(source, file) {
  return createHash('sha256')
    .update(
      extract(source, file)
        .map((s) => `${s.kind}:${s.text}`)
        .join('\n'),
    )
    .digest('hex')
    .slice(0, 16)
}

module.exports = { UNITS, copyUnits, read, fingerprint }
