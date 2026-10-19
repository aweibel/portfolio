# Alan Weibel — Portfolio

Source for [alanweibel.com](https://alanweibel.com): a single static page with no build step.

## Files

- `index.html` — all page content: About, Curriculum Vitae, Extracurricular Activities (Side Quests, Volunteering and Publications sub-lists) and Contact
- `styles.css` — all styles, including the small-screen layout (below 760px)
- `og.png` — the 1200×630 image shown when the link is shared
- `favicon.svg`, `apple-touch-icon.png` — site icons
- `robots.txt`, `sitemap.xml` — for search engines; update `lastmod` in the sitemap when the page changes
- `vercel.json` — redirects www.alanweibel.com to alanweibel.com
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
