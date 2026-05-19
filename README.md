# Adnota — Marketing Site

The landing page for [Adnota](https://github.com/adnota-app/adnota), the Chrome Extension that lets you annotate, erase, highlight, and draw on any webpage.

**Live at [adnota.app](https://adnota.app).**

A single-page static site built with vanilla HTML, CSS, and JavaScript. No build tools, no frameworks, no npm dependencies — what's in `public/` is exactly what ships to the browser.

---

## Run locally

```bash
ruby -run -e httpd public -p 8080
```

Then open <http://localhost:8080>. Edits to any file under `public/` take effect on browser refresh.

---

## Repo layout

```
public/        # Everything that ships to the browser (Cloudflare Pages build output)
LICENSE
README.md      # This file
CODE.md        # Implementation walkthrough
```

Anything outside `public/` is invisible to the live site — Cloudflare only uploads `public/`. Scratch files, drafts, and design experiments can live elsewhere in the repo without leaking to visitors.

---

## Deploy

Hosted on **Cloudflare Pages**, auto-deployed on push to `main`.

- **Build command**: none
- **Build output directory**: `public`

---

## Architecture

For an implementation-level walkthrough — design tokens, page sections, JS modules, hero mockup internals — see [CODE.md](CODE.md).
