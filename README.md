# Alan Weibel — Portfolio

Source for [alanweibel.com](https://alanweibel.com): a single static page with no build step.

## Files

- `index.html` — all page content: About, Curriculum Vitae, Extracurricular Activities (with Volunteering and Publications sub-lists) and Contact
- `styles.css` — all styles, including the small-screen layout (below 760px)
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
