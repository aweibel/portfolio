# Applying a case study to the user's own page

Everyone's portfolio is different, so the draft markdown is the portable source of truth. This step maps its 10 section ids into whatever layout the user already has, without restyling their site.

## 1. Find the target

Check in this order, and stop at the first hit:

1. **`case-study.config.json`** in the project root. It's saved from an earlier run. If it exists, use its mapping and skip to step 4.
2. **Something the user names or provides**: a page URL or path, a template file, a Google Doc, Notion page, Claude Doc, or a Framer/Webflow page.
3. **Scan the project** for an existing case-study page or template:
   - Folders named `work/`, `projects/`, `case-studies/`, `portfolio/`, or `content/` with project pages.
   - Static site generators:
     - Astro: `src/pages`, `src/content`
     - Next: `app/`, `pages/`, MDX
     - Hugo: `content/`, `layouts/`
     - Jekyll: `_posts`, `_layouts`
     - Eleventy
     - Gatsby
   - HTML pages with repeated case-study markup, or `data-section` attributes.
   - Cards on the home page that link, or should link, to case studies. For example, "Coming soon" placeholders.
4. **Nothing found**: offer to scaffold a page (see step 5).

## 2. Read the template's slots

A slot is any place a piece of the case study goes. Identify slots by:

- `data-section="…"` attributes, which are the most reliable
- headings in an existing case page ("Overview", "Challenge", "Approach", "Results", "Learnings", …)
- front-matter fields in content collections (`summary`, `role`, `timeline`, `cover`, …)
- distinct layout regions: a hero image, a meta row, a body

## 3. Map ids to slots

Propose a mapping table and confirm it with the user before writing. Merges are judgment calls they should see.

Typical matches:

| Their slot | Our section ids |
|---|---|
| Overview / Intro / Summary / TL;DR | `summary` (+ `context` if there's no separate slot) |
| Challenge / Problem / Background | `context` (+ `setbacks`, `tensions` if there's no other home) |
| Role / My role / Team | `role` (+ front-matter `role`, `team`, `timeline`) |
| Research / Discovery / Understanding | `research` |
| Approach / Process / Exploration | `process` |
| Challenges / Obstacles / What didn't work | `setbacks` + `tensions` |
| Solution / Design / Outcome (as design) | `solution` |
| Results / Impact / Outcome (as numbers) | `impact` |
| Learnings / Reflection / Retro / Next | `retro` |

Rules:

- **Fewer slots than sections**: merge adjacent sections and keep each one's bold lead-in, so nothing is lost. Never drop `tensions`, `setbacks` or `impact` silently. Those are what reviewers look for.
- **More slots than sections**: ask what belongs there. Don't invent content.
- **Meta fields** (company, role, team, timeline, platform, status) come from front matter.

Save the confirmed mapping so later case studies apply without asking:

```json
{
  "target": "work/{slug}.html",
  "template": "work/_template.html",
  "kind": "html",
  "slots": {
    "summary": "[data-section=summary]",
    "context": "[data-section=context]",
    "setbacks": "[data-section=challenges]",
    "tensions": "[data-section=challenges]"
  },
  "link_from": "index.html .case",
  "after": ["vercel --prod"]
}
```

`kind` is one of:
- `html`
- `mdx`
- `markdown-collection`
- `doc`
- `builder`

## 4. Write

- **Code sites (HTML, MDX, collections)**
  - Copy their template or existing page and fill each slot.
  - Convert markdown to their markup, reusing their classes, components and image conventions.
- **Open placeholders: hidden from visitors, never lost.** A published page is read by recruiters, so raw `[[METRIC: …]]` text on it looks unfinished. Instead:
  - turn each placeholder into an HTML comment (`<!-- TODO METRIC: … -->`) at the spot where it belongs, or an equivalent in their format;
  - leave out images that don't exist yet; don't point `<img>` tags at missing files. Put a comment with the intended filename and shot description where they go;
  - if the sentence only made sense with the missing fact, trim it rather than leave a dangling clause;
  - if a whole section is still empty, hide it (comment it out) rather than writing new copy to fill it — the page should only say what the draft says;
  - list every hidden placeholder in your reply, so nothing is forgotten.
- **Link it up**
  - If the home page has a card for this project, link it to the new page.
  - Keep a "Coming soon" (or similar) marker while any `[[METRIC` or `[[ASK` placeholders are open. Remove it only when the user says the page is ready to go live.
- **Docs and builders** (Google Doc, Notion, Claude Doc, Framer, Webflow)
  - If a connector or tool for that service is available, write into it, keeping their headings.
  - Otherwise, produce one copy-paste block per slot, in slot order.

## 5. Scaffold, when there's no template

- Create a page in the site's existing style: reuse its stylesheet, fonts, tokens, header and footer.
- Give each section id a `data-section` container. That makes the next mapping trivial.
- Link the page from wherever projects are listed.
- Write the config.

## 6. Finish

- Run the project's own preview or deploy step if one is documented (README, package scripts, a deploy memory) and the user expects it.
- Report:
  - which file was written
  - the mapping used
  - any placeholders still open
  - the shot list of images to capture
