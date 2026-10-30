# Alan Weibel — Portfolio

Source for [alanweibel.com](https://alanweibel.com): a single static page with no build step.

## Files

- `index.html` — all page content: About, Curriculum Vitae, Extracurricular Activities (Side Quests, Volunteering and Publications sub-lists) and Contact
- `styles.css` — all styles, including the small-screen layout (below 760px)
- `og.png` — the 1200×630 image shown when the link is shared
- `favicon.svg`, `apple-touch-icon.png` — site icons
- `robots.txt`, `sitemap.xml` — for search engines; update `lastmod` in the sitemap when the page changes
- `vercel.json` — redirects www.alanweibel.com to alanweibel.com
- `case-study-skill/` — landing page for the case-study skill (linked from Contact): overview, download (`case-study.skill`, a copy of the packaged skill), examples, live output and eval results. Re-copy the `.skill` file when the skill changes.
- `llms.txt` — a plain Markdown summary of the page for AI agents; keep it in step with `index.html`
- `ai.txt`, `agents.json` — further notes for AI crawlers and agents: allows AI use and points to `llms.txt`
- `archive/` — the previous Create React App version of the site, kept for reference and not deployed

## Editing

Open `index.html` in a browser to preview. There is nothing to install or build.

Each list entry follows the same pattern:

```html
<li><span><a href="https://example.com/">Name</a></span><span class="it">Role or title</span></li>
```

## Deploying

The site is hosted on Vercel (project `alanweibel`). Deploy to production from the repo root:

```
vercel --prod
```

`.vercelignore` keeps `README.md` and `archive/` out of the deployment.

## Case-study skill

`.claude/skills/case-study/` is a Claude Code skill that turns a spoken or pasted brain-dump about a project into a product design case study. It drafts the case study, then asks for what's missing, especially metrics. Once it's done, it places the case study into your own portfolio page or doc. Its structure follows what design hiring managers and recruiters say they look for (sources in `references/rubric.md`).

- **Use it here:** open Claude Code in this repo and talk through a project, e.g. "here's everything about the SLDS project, turn it into a case study".
- **Use it anywhere:** copy the `case-study/` folder to `~/.claude/skills/`, or install the packaged `case-study.skill` file.
- **Tests:** `evals/` holds the functional test cases. Run them with `claude plugin eval .claude/skills/case-study --allow-tools Write,Edit,Bash --scaffold`.

Drafts go in `case-studies/`. Raw notes go in `.case-study/`, which is gitignored and never deployed.
