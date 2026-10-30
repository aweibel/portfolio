---
title: "Turning a 14-step setup wizard into a checklist admins could finish"
slug: routewise-onboarding
company: Routewise
role: Lead Product Designer
team: PM, 6 engineers, part-time researcher
timeline: 2022–2023
platform: Web, B2B SaaS (fleet routing & dispatch)
status: shipped
nda: false
hero: "[[IMAGE: the new setup checklist with two tasks assigned to teammates]]"
---

<!-- section: summary -->
## TL;DR

New fleet customers were abandoning a 14-step setup wizard and leaning on costly implementation calls. I led research and design for a flexible checklist with teammate hand-offs and a row-level CSV importer; [[METRIC: setup time and implementation calls, before → after]].

**Key takeaways**
- Admins don't hold all the data; designing for hand-offs mattered more than polish.
- Turned a sales objection into a demo mode and a staged rollout.
- [[METRIC: headline result]]

<!-- section: context -->
## Setup was costing more than it earned

Routewise sells routing and dispatch software to mid-size fleets. Setting up a customer meant a 14-step wizard (drivers, vehicles, depots, shift rules). Admins bailed halfway, implementation staff did it for them on calls, and go-live slipped past the two weeks sales promised.

<!-- section: role -->
## My role

I was the lead product designer on the admin side, working with PM Dana, the onboarding squad of six engineers, and a part-time researcher. I ran most of the interviews myself and sat in on implementation calls.

<!-- section: research -->
## "I feel like I'm doing someone else's homework"

We talked to twelve admins, some mid-setup and some who had churned. The data they needed lived with other people (drivers with HR, vehicles with the fleet manager), so they stalled at step four or five, the wizard timed out, and they lost their place. [[ASK: describe one admin you designed for in more detail]]

<!-- section: process -->
## From a tunnel to a checklist

We replaced the linear wizard with a checklist that could be done in any order, saved and resumed, with tasks assignable to a teammate. A new CSV importer reported problems row by row. [[ASK: how did you validate the checklist before launch?]]

<!-- section: setbacks -->
## What didn't work

A smarter branching wizard tested badly; it still felt like a tunnel. The first importer auto-fixed data and admins didn't trust it, so we switched to showing problems and letting them fix them.

<!-- section: tensions -->
## Sales loved the wizard

The sales VP wanted the wizard kept because it demoed well. I built a demo mode and we rolled the checklist out to new customers first. Engineering pushed back on teammate invites because they touched the roles model, so we scoped a limited "task assignee" role. [[ASK: how did the relationship with sales end up?]]

<!-- section: solution -->
## Solution

[[IMAGE: checklist, assignee flow, and importer error view]]

<!-- section: impact -->
## Impact

Setup got faster, implementation calls dropped, and the checklist became the default for all new customers. [[METRIC: setup time before → after, timeframe, source]] [[METRIC: implementation calls per customer before → after]]

<!-- section: retro -->
## Looking back

I'd bring sales in earlier and instrument the old wizard first so we had a baseline.
