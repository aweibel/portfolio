---
name: case-study
description: Writes UX / software product design case studies and portfolio pieces. Turns a designer's spoken or pasted brain-dump about a project into a hiring-grade case study (markdown), interviews them for what's missing — especially metrics, research, setbacks, stakeholder tensions and lessons — and places the finished write-up into their own portfolio page or doc. Use this whenever someone asks to create, write, draft, improve or flesh out a case study, portfolio piece, portfolio project, project write-up, portfolio entry, work sample or project page; talks through a past project "for my portfolio" or "for my site"; shares notes or a voice transcript about a product they designed; asks what their case study is missing; or wants a case study put on their portfolio — even if they never say "case study". Load this skill first, before reading their notes or files, since it defines how to capture them.
---

# Case study

Hiring managers and recruiters read a case study for about two minutes. In that time they want to know: what was the problem, what did *you* do, what changed because of it, and how do you think and work with people. This skill turns a messy verbal history of a project into that story, and then pulls the missing pieces out of the designer, because nobody remembers their metrics while talking off the top of their head.

The work happens in three movements: **draft** from what they said, **interview** for what they didn't, **apply** the result to their own page.

## Before you start

Read these when you reach the step that needs them (not all up front):

- `references/structure.md` — the 10 sections, what each must contain, and examples. Read before drafting.
- `references/rubric.md` — the hiring-side checklist used to score a draft, with the sources it comes from. Read before scoring.
- `references/question-bank.md` — follow-up questions per section, including the metric probes. Read before interviewing.
- `references/apply.md` — how to find the user's case-study page or doc and map the sections into it. Read only when applying.
- `templates/case-study.md` — the markdown skeleton to copy.
- `scripts/check_draft.py` — mechanical checks (sections present, numbers traceable to what the user said, placeholders left, "I" vs "we"). Run it on every draft.

## 1. Capture

Let the user talk. A dictated ramble is the expected input: out of order, repetitive, full of names and half-remembered details. Don't interrupt it with questions; everything said is raw material.

Save what they gave you verbatim to `.case-study/<slug>.source.md` at the project root (append later answers to it too). This file is the ground truth that every fact in the draft must trace back to, and it lets `check_draft.py` catch invented numbers. It deliberately lives outside the draft folder: it holds unfiltered words — client names under NDA, colleagues' names, offhand remarks — and anything sitting next to the draft tends to get published with it. If the project is a git repo, add `.case-study/` to `.gitignore` and say so. If a source file already exists elsewhere (e.g. beside an older draft), keep using it.

If the input is so thin that most sections would be empty (a few sentences), say so plainly, still create the draft with the skeleton, and go straight to questions — a half-empty draft with honest gaps is more useful than a full one built on guesses. Keep it light: one short `[[ASK: …]]` per empty section, not a questionnaire in every paragraph. A wall of placeholders is as hard to read as a wall of filler.

## 2. Draft

Copy `templates/case-study.md` to `case-studies/<slug>.md` (pick a short kebab-case slug from the project name) and fill it from the source.

How to write it, and why:

- **Never invent facts.** Every number, quote, research finding, persona detail, name and outcome must come from what the user said. A recruiter who asks about a made-up metric ends the interview, and the designer is the one who pays for it. Where something is missing, leave a visible placeholder the user can't miss:
  - `[[METRIC: what to measure, e.g. setup time before → after, first 30 days]]`
  - `[[ASK: the question that would fill this, e.g. who pushed back on removing the wizard, and why?]]`
  - `[[IMAGE: the shot to capture, e.g. before/after of the setup screen, annotated]]`
  You may sharpen wording and structure freely; you may not add substance. That includes colour: don't characterise people or outcomes beyond what was said ("she went from loudest critic to biggest fan" when they only said she came around). Simple arithmetic on their own numbers is fine ("38 → 11 days" → "27 days sooner"), but check it twice — a wrong derived number is still a wrong number — and keep each metric's timeframe and source attached only to that metric; if they gave a period for one number and not another, the other stays without one (or gets a `[[METRIC: timeframe?]]`).
- **Hedged facts get confirmed, not hardened.** When the user hedges ("I think it was fourteen steps", "I want to say twelve admins", "it helped with a couple of deals"), use the detail but add it to a short **To confirm** list and ask about it in the next round. Spoken numbers are often off, and the draft will be read as precise.
- **Ownership in first person.** Write "I" for what they did and name the team for what others did. Vague "we redesigned…" is the most common red flag reviewers cite, because it hides the candidate's contribution.
- **Lead with the outcome.** The title states what changed ("Cut enterprise setup from weeks to a day"), not just the project name. The TL;DR is one or two sentences: problem → what I did → result.
- **Descriptive headings.** Keep each section's stable id in its HTML comment, but rewrite the visible heading to say something ("Admins didn't trust auto-sync" beats "Research").
- **Show the friction.** Setbacks and tensions are what make a project read as real; a story with no friction reads as edited. If the user mentioned any disagreement, failed idea or pivot, give it room.
- **Scannable.** Short paragraphs, bold lead-ins, lists where they help, a caption under every image placeholder. Aim for something readable in 3–5 minutes. Proofread before showing it: run-ons and comma splices undercut a piece whose job is to show care.
- **NDA.** If the user mentions an NDA or a confidential client, use a generic descriptor ("a Fortune 500 insurer"), set `nda: true`, and note in the shot list that screens must be redacted or recreated.

Then run:

```bash
python3 <skill-dir>/scripts/check_draft.py case-studies/<slug>.md --source .case-study/<slug>.source.md
```

Fix anything it flags as an untraceable number or missing section before showing the user. (If it flags a number that the user did say in another form — "two weeks" vs "2 weeks" — that's fine; use judgment.)

## 3. Score and interview

Score each section against `references/rubric.md` as **complete**, **thin**, or **missing**, and show the user a compact scorecard so they can see where the story is weak.

Then ask the **3–5 questions** that would improve the case study most, picked from `references/question-bank.md` and tailored to their project (use their names, product, and words — generic questions get generic answers). Priority order, because this is what reviewers look for and what people forget:

1. **Impact metrics** — always first if impact is thin. Ask for the baseline, the result, the timeframe, and how it was measured, and say where they might look it up. Offer proxies and directional framing if exact numbers are lost.
2. **Tensions** — a specific disagreement, who held the other view and why, how it was resolved, what was traded off.
3. **Setbacks** — what didn't work and what they changed.
4. **Research & empathy** — who they learned from, a real quote, the insight that changed the design.
5. **Retro** — what they'd do differently.

Ask as open questions in plain prose, numbered, so they can answer by voice in any order. Five is a hard ceiling for the round — people answer five questions well and fifteen badly — so don't append a second "lower priority" list; say how many smaller gaps remain and that you'll get to them. Fold the **To confirm** items into one of the five ("Quick checks: was it fourteen steps, and twelve admins?"). End your turn there; the user's answers are the next input.

When answers come back: append them to the source file, revise the draft (replace placeholders, deepen sections), re-run `check_draft.py`, show the updated scorecard and what changed, and ask the next most valuable round. Keep going until the user says it's done or nothing important is missing.

When finished, list any placeholders still open and a **shot list**: every `[[IMAGE: …]]` with what to capture and how to annotate it.

## 4. Preview

Offer a readable preview: the markdown rendered in the terminal is fine; if the user wants to see it as a page, generate a simple HTML preview next to the draft and open it. Skip this in non-interactive runs.

## 5. Apply to their page

When the user wants it in their portfolio (or a doc), read `references/apply.md` and follow it. In short: find their case-study page, template, or doc; map the 10 section ids to its slots; confirm the mapping; save it to `case-study.config.json` so future case studies apply automatically; write the content in their markup; then run their usual preview or deploy step.

Visitors should never see the scaffolding. Open placeholders become HTML comments (or are left out of a doc), missing images are left out rather than pointed at files that don't exist, and a page that still has open metric or ask placeholders stays marked "coming soon" (or unlinked) until the user says otherwise. Tell them exactly what's still open.

## Example of the bar

A weak TL;DR: *"I redesigned the onboarding experience for our enterprise product to make it better for users."*

A strong one: *"Enterprise admins were abandoning setup halfway through a 14-step wizard. I led research and design for a guided checklist that let them stop and resume; setup completion rose from 41% to 78% in the first quarter."*

A tension paragraph at the right depth:

> **Sales wanted the wizard kept.** Our VP of Sales believed the wizard helped close deals, because it demoed well. I didn't argue taste; I brought five session recordings of admins quitting at step 9 and proposed keeping a "demo mode" for sales calls. We shipped the checklist to new accounts first, which let the numbers settle it — and Sales became its loudest advocate.
