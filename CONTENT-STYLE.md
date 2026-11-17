# Content style

The house style for this site: plain words, a human voice, no AI writing
tells. It applies to every page a visitor reads: the homepage and the skill
landing pages (`case-study-skill/`, `screen-showcase-skill/`), and the plain-text
summaries written for AI tools (`llms.txt`, `ai.txt`).

Ported from the house style at [Agent Experiences](https://www.agentexperiences.com/)
(`~/git/agentexperiences/CONTENT-STYLE.md`), trimmed to this site: no
newsletter section, no AXD/AXO/AEO glossary, no legacy-title carve-out. The
mechanism is the same: this file is the brief, the checklist, and the input
to the automated check. The word lists in the `copy-rules` block below drive
`npm run copy:check`, so changing this file changes what the check looks for.

## Plain words and a human voice

**Write in everyday words.** Someone new to product design or to Claude
skills should understand a page the first time. Someone who already knows
the space should still find it worth reading.

**No marketing language.** State what the thing does. "Composes a handful
of screenshots into one branded image" beats "revolutionizes your visual
storytelling."

**No em dashes. None.** Use a comma, a colon, a full stop, parentheses, or a
new sentence. The one exception on this site is the "A — W" initials
wordmark in the header, which is a logotype, not prose; it carries a
`copy-allow` comment saying so.

**No prose that reads as AI-generated.** Watch for: the same construction
repeated down a page (every figure caption built "Label — detail"), headings
built to one formula, long runs of short clipped sentences, a neat closing
one-liner that sounds like a pull quote, and contrast pairs used as a
device ("It's a script, not a generative model").

**This site's own voice.** First person where the page is about Alan
directly (the homepage, the bio), direct and a little dry everywhere else.
It is fine for the skill pages to sound proud of a result ("98% of checks
passed") without padding it with adjectives.

**Don't overuse a word or phrase.** If a word shows up again and again on
one page for no reason, vary it or cut the repeats that add nothing. Watch
list and limit are in the `copy-rules` block. A page's own subject word
("showcase" on the showcase skill's page, "case study" on the case-study
skill's page) is not a tell and is not on that list.

**Easy to read and engaging.** Read a page aloud as someone new to it
would. Wherever you'd stop to ask "what does that mean?", rewrite.

## Spelling

American English. labeled, behavior, center, organized,
favor, recognize, judgment, catalog, color, prioritized. Proper names and
direct quotations (a dictated transcript, a quoted question) keep their own
spelling.

## How copy gets published

**1. Write from this file.** Read it before writing anything a visitor will
see: the homepage, a skill landing page, or the AI-facing text files.

**2. The automatic check.** `npm run copy:check` reads the lists in the
`copy-rules` block below and checks every tracked page and text file for:

- em dashes, and spaced en dashes used as dashes
- banned words and phrases
- AI sentence patterns ("it's not just X, it's Y", "X isn't about A. It's
  about B.", "whether you're a X or a Y")
- the same opening words on three or more paragraphs
- three or more headings built on the "X: the Y" formula
- four or more very short sentences in a row
- British spelling
- any watched phrase used more often than the limit allows

Code samples (anything inside `<pre>` or `<code>`, including the dictated
transcript shown as a live example) are read as verbatim input, not as this
site's own prose, so the check skips them, the same way a fenced code block
is skipped in Markdown.

**3. The review.** Read the file as someone new to it would and check it
against this file, including what the check can't judge: is it warm, is it
clear, does it sound like a person, is the voice consistent with the rest of
the page. Then run `npm run copy:review -- <file> --reviewer "<who>"`, which
refuses if the check fails, and stores a fingerprint of the file's visible
text in `lib/copy/reviews.json`.

**4. The gate.** `npm run copy:gate` reports every tracked file whose
fingerprint no longer matches its last review (new text, or never reviewed)
as held, not failed, since this site has no build step to block. Run it
before `vercel --prod` the way the README asks, and clear anything it holds
back with another review pass.

**No dead ends.** A failing check always says what rule it hit, how to fix
that kind of finding, and which file to re-check. Fix, re-run
`copy:check`, and once it's clean, record the review. The check never
invents facts, numbers, or quotes to make a sentence livelier; a fix that
needs a real fact only Alan knows should ask him rather than guess.

If a rule is wrong for one line (a quoted title, a deliberate logotype like
the header wordmark), put `<!-- copy-allow: <reason> -->` on that line or
the line above it.

```copy-rules
banned-words: delve, delves, delving, leverage, leverages, leveraging, robust, seamless, seamlessly, comprehensive, holistic, landscape, realm, foster, fosters, underscore, underscores, pivotal, crucial, vital, elevate, elevates, harness, harnessing, unlock, unlocks, unlocking, empower, empowers, empowering, testament, tapestry, ever-evolving, game-changing, game-changer, revolutionary, revolutionize, supercharge, cutting-edge, next-level, paradigm, synergy, transformative, groundbreaking, embark, meticulous, bustling, plethora, myriad, utilize, utilizes
banned-phrases: rapidly changing, in today's world, in today's digital, in the world of, in the realm of, it's not just, it is not just, isn't just, is not just, think of it as, at its core, the key insight, the key takeaway, here's the thing, here's the kicker, that said, let's dive, dive into, deep dive, not only, in conclusion, navigate the complexities, a testament to, plays a key role, it's worth noting, it is worth noting, at the end of the day, the bottom line
watch-phrases: basically, essentially, kind of, sort of, pretty much, in other words
watch-limit: 3
```

## From the writers guide

**Lead with the fact.** The first sentence of a section carries the claim.
"Stacking a few screenshots on top of each other... reads as unfinished"
beats scene-setting about the state of design in general.

**Be specific.** Numbers, versions, counts. "19 of 20 correct on the first
try" beats "most requests worked."

**Active voice.** "A smart-crop pass scores a few candidate offsets", not
"a few candidate offsets are scored."

**Oxford comma, always.** Lists of three or more take a comma before the
final conjunction.

## Writing so it doesn't read as machine-generated

- Vary sentence length and paragraph length on purpose. A run of uniform
  medium sentences is the loudest tell there is.
- Avoid "it's not just X, it's Y" and its variants, "at its core", "here's
  the thing", rhetorical questions used as transitions, and closing a
  section by restating what it just said.
- Headings should say something specific. "How it behaves" beats
  "Overview."
- Bullet lists are for genuine lists. Prose chopped into bullets to look
  scannable reads as generated.
- State an opinion flatly where there is one, and say when something didn't
  work rather than smoothing it over (the eval notes on this site already do
  this well: "the one marked \* triggered correctly on an immediate retry, so
  it reads as sampling noise rather than a gap").

## Before publishing

Read it aloud. If a sentence sounds like it's performing thoroughness
rather than saying something, cut it.
