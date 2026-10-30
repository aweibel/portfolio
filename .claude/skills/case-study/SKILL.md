---
name: case-study
description: Writes UX and software product design case studies and portfolio pieces. Turns a designer's spoken or pasted notes about a project into a case study a hiring manager can use (markdown), asks them for what's missing, especially metrics, research, setbacks, disagreements and lessons, and then puts the finished write-up into their own portfolio page or doc. Use this whenever someone asks to create, write, draft, improve or flesh out a case study, portfolio piece, portfolio project, project write-up, portfolio entry, work sample or project page, talks through a past project "for my portfolio" or "for my site", shares notes or a voice transcript about a product they designed, asks what their case study is missing, or wants a case study put on their portfolio, even if they never say "case study". Load this skill first, before reading their notes or files, because it explains how to capture them.
---

# Case study

Hiring managers and recruiters spend about two minutes on a case study. In that time they want to know what the problem was, what the designer did, what changed because of it, and how they think and work with other people. This skill turns someone's spoken history of a project into that story. Then it asks them for the pieces they left out, because nobody remembers their metrics while talking off the top of their head.

There are three parts to the work. First you draft from what they said. Then you ask about what they didn't say. Last, you put the result on their own page.

## Before you start

Read these files when you get to the step that needs them, not all at once:

- `references/structure.md` explains the 10 sections, what each one needs, and gives examples. Read it before drafting.
- `references/rubric.md` is the checklist hiring managers use, with its sources. Read it before scoring a draft.
- `references/question-bank.md` has follow-up questions for each section, including the ones about metrics. Read it before asking questions.
- `references/apply.md` covers finding the user's case study page or doc and fitting the sections into it. Only read it when you're putting the case study on their page.
- `templates/case-study.md` is the markdown skeleton to copy.
- `scripts/check_draft.py` checks that every section is there, that every number traces back to what the user said, how many placeholders are left, and how often the draft says "I" versus "we". Run it on every draft.

## 1. Capture

Let the user talk. Expect a dictated ramble that jumps around, repeats itself, and is full of names and half-remembered details. Don't interrupt it with questions. All of it is useful.

Save what they gave you, word for word, to `.case-study/<slug>.source.md` at the project root, and add their later answers to the same file. Every fact in the draft has to trace back to this file, and `check_draft.py` uses it to catch numbers that were never said. Keep it outside the draft folder on purpose. It holds things that shouldn't be published, like the name of a client under NDA, colleagues' names and offhand comments, and files that sit next to a draft tend to get published with it. If the project is a git repo, add `.case-study/` to `.gitignore` and tell the user you did. If a source file already exists somewhere else, for example next to an older draft, keep using that one.

If they've only given you a few sentences and most sections would be empty, tell them so. Still create the draft from the skeleton, then go straight to questions. A draft with honest gaps is more useful than a full one built on guesses. Keep the gaps light, with one short `[[ASK: ...]]` in each empty section. A page full of placeholders is as hard to read as a page full of filler.

## 2. Draft

Copy `templates/case-study.md` to `case-studies/<slug>.md`, using a short slug based on the project name, and fill it in from the source file.

How to write it:

- **Don't invent anything.** Every number, quote, research finding, persona detail, name and result has to come from what the user said. If a recruiter asks about a number the designer never gave, the interview is over, and the designer pays for it, not you. When something is missing, leave a placeholder they can't miss:
  - `[[METRIC: what to measure, for example setup time before and after, over the first 30 days]]`
  - `[[ASK: the question that would fill the gap, for example who pushed back on removing the wizard, and why?]]`
  - `[[IMAGE: the screen to capture, for example the old and new setup screens side by side, with notes]]`

  You can improve the wording and the order as much as you like, but you can't add substance. That includes describing people or results more strongly than the user did. If they said the sales VP came around, don't write that she went from biggest critic to biggest fan. Don't add your own opinions either, like saying someone's concern "was fair" or "was real", and don't widen what the designer owned beyond what they said they did. If they only said they made the demo mode, don't write that they designed the checklist too. If it isn't clear who did something, ask. Simple math on their own numbers is fine (38 days down to 11 is 27 days sooner), but check it twice, because a wrong derived number is still a wrong number. Keep each metric's time period and source with that metric only. If they gave a time period for one number and not another, leave the other without one or add `[[METRIC: time period?]]`.
- **Confirm the details they weren't sure about.** When the user hedges ("I think it was fourteen steps", "I want to say twelve admins", "it helped with a couple of deals"), use the detail but add it to a short **To confirm** list, and ask about it in the next round. People often misremember numbers when they're talking, and readers will take the draft as exact.
- **Use "I" for their own work.** Write "I" for what the designer did and name the people or roles who did the rest. A vague "we redesigned..." is the problem reviewers mention most, because it hides what the candidate actually did.
- **Start with the result.** The title should say what changed ("Cut enterprise setup from weeks to a day"), not just name the project. The TL;DR is one or two sentences covering the problem, what they did, and the result.
- **Write headings that say something.** Keep each section's id in its HTML comment, but change the visible heading to say what the section is about. "Admins didn't trust auto-sync" tells the reader more than "Research".
- **Include the hard parts.** Things that didn't work and disagreements with other people are what make a project believable. A story where everything went smoothly reads as edited. If the user mentioned a disagreement, a failed idea or a change of direction, give it space.
- **Make it easy to skim.** Use short paragraphs, bold lead-ins, lists where they help, and a caption for every image. It should take three to five minutes to read. Proofread it, because sloppy sentences undercut a piece whose whole job is to show care.
- **Handle NDAs.** If the user mentions an NDA or a client they can't name, describe the client generally ("a large US insurer"), set `nda: true`, and say in the shot list that screens need to be blurred or recreated.

### Write it the way the designer talks

The case study goes out under the designer's name, so it should sound like a person wrote it, not a tool. Use their own words and phrasing where you can. Write in plain, specific sentences. In particular:

- No em dashes. Use a comma, a period, parentheses or a new sentence instead.
- No arrow characters. Write "from 38 days to 11" instead of putting an arrow between the numbers.
- Avoid stock words like seamless, robust, leverage, elevate, unlock, empower, delve, journey, game-changer and cutting-edge.
- Avoid stock patterns like "It's not just X, it's Y", rhetorical questions, dramatic one-line paragraphs, colon reveals ("The result: ..."), and lists of three that exist for rhythm rather than content.
- Don't open sections with scene-setting ("In today's fast-paced world..."). Start with the point.
- The same goes for your replies to the user. Write in normal sentences, not bold slogans like "**Nothing is made up.**"

When the draft is written, read it once more, one sentence at a time, next to the source file. For each sentence, ask whether the user actually said it. Small additions creep in while writing, like a feature detail they never described ("nothing times out" when they only said "save and come back"), a result they didn't claim, or "I" where they said "we". Cut those, or turn them into an `[[ASK: ...]]`. Summarising what they said is fine. Adding to it isn't.

Then run:

```bash
python3 <skill-dir>/scripts/check_draft.py case-studies/<slug>.md --source .case-study/<slug>.source.md
```

Before you show the user, fix anything it flags: a missing section, a number that doesn't trace back to the source, or an em dash or arrow. It sometimes flags a number the user said in a different form, like "two weeks" and "2 weeks". Use your judgment on those.

## 3. Score it and ask questions

Score each section against `references/rubric.md` as **complete**, **thin** or **missing**, and show the user a short scorecard so they can see where the story is weak.

Then ask the **3 to 5 questions** that would improve the case study most. Pick them from `references/question-bank.md` and fit them to the project, using their names, product and words, because general questions get general answers. Ask in this order, since it's what reviewers look for and what people tend to forget:

1. **Impact metrics.** Always ask these first if the impact section is thin. Ask for the number before, the number after, the time period, and how it was measured, and suggest where they could look it up. If the exact numbers are gone, offer substitutes or rough wording they'd be comfortable with.
2. **Disagreements.** A specific disagreement, who saw it differently and why, how it was settled, and what they gave up.
3. **Setbacks.** What didn't work and what they changed because of it.
4. **Research.** Who they learned from, something a user actually said, and the finding that changed the design.
5. **Looking back.** What they'd do differently.

Ask open questions in plain sentences, numbered, so they can answer by voice in any order. Five is the limit for a round, because people answer five questions well and fifteen badly. Don't add a second list of lower-priority questions. Just say how many smaller gaps are left and that you'll come back to them. Put the **To confirm** items into one of the five ("Quick check: was it fourteen steps, and twelve admins?"). Then stop and let the user answer.

When their answers come back, add them to the source file, update the draft, run `check_draft.py` again, show the new scorecard and what changed, and ask the next most useful round. Keep going until the user says it's done or nothing important is missing.

When you're finished, list any placeholders that are still open, and give them a **shot list**: every `[[IMAGE: ...]]`, what to capture, and what to point out on it.

## 4. Preview

Offer to show it as a readable page. Rendered markdown in the terminal is fine. If they want to see it as a web page, make a simple HTML preview next to the draft and open it. Skip this step when nobody is there to look at it.

## 5. Put it on their page

When the user wants it in their portfolio or a doc, read `references/apply.md` and follow it. In short, find their case study page, template or doc, match the 10 sections to its parts, confirm that with them, and save the match to `case-study.config.json` so the next case study goes in without these questions. Write the content using their markup, then run their usual preview or deploy step.

Visitors should never see the unfinished parts. Open placeholders become HTML comments, or are left out of a doc. Images that don't exist yet are left out instead of linking to missing files. A page that still has open metric or question placeholders stays marked "coming soon", or unlinked, until the user says otherwise. Tell them exactly what is still open.

## Examples

A weak TL;DR: *"I redesigned the onboarding experience for our enterprise product to make it better for users."*

A good one: *"Enterprise admins were giving up halfway through a 14-step setup wizard. I led research and design for a checklist they could pause and come back to, and setup completion went from 41% to 78% in the first quarter."*

A disagreement written at the right depth:

> **Sales wanted to keep the wizard.** Our VP of Sales thought the wizard helped close deals because it looked good in demos. Instead of arguing about taste, I showed her five session recordings of admins quitting at step 9, and suggested keeping a demo mode for sales calls. We gave the checklist to new accounts first so we could compare the two, and once the numbers came in, Sales started using the checklist in their own demos.
