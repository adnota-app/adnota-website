# Adnota Marketing Site — Code Walkthrough

Implementation-level reference for [adnota.app](https://adnota.app). The user-facing README is at [README.md](README.md); this document covers what each file does, the design system, and the internals of the hero browser mockup.

---

## File Structure

```
adnota/
├── public/             # Everything that ships to the browser (Cloudflare Pages build output)
│   ├── index.html      # Single-page document, markup only
│   ├── styles.css      # Site styling — design tokens, layout, components, animations
│   ├── demo.css        # Hero browser-mockup styles, ported from the extension under .hero-mockup scope
│   ├── main.js         # Site JS — scroll reveal, upvote logic, tweaks API
│   ├── demo.js         # Hero demo loop — sequenced 4-tool animation in the browser mockup
│   ├── privacy.html    # Privacy policy
│   ├── terms.html      # Terms of service
│   ├── og-image.html   # Source HTML used to render og-image.png (1200×630 social preview)
│   ├── og-image.png    # Rendered social preview image
│   ├── favicon.svg     # Inline SVG favicon (purple→magenta gradient with white "A")
│   ├── robots.txt
│   └── sitemap.xml
├── LICENSE
├── README.md           # User-facing intro
└── CODE.md             # This file
```

Anything outside `public/` is invisible to the live site — Cloudflare only uploads `public/`. Drop scratch files, drafts, and design experiments anywhere outside `public/` without worrying about leaking them.

---

## Design System (`styles.css`)

All design tokens are defined as CSS custom properties on `:root`. Every color, font, and surface reference in the stylesheet uses these variables — never hardcoded values (with the exception of the browser mockup's "fake article" which intentionally mimics a light-mode third-party site).

### Color Tokens
| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#08080f` | Page background |
| `--surface` | `#0f0f1a` | Cards, sections |
| `--surface2` | `#16162a` | Nested surfaces, inputs |
| `--accent` | `#7c3aed` | Primary brand violet |
| `--accent-glow` | `rgba(124,58,237,0.35)` | Box-shadow glows |
| `--accent-soft` | `rgba(124,58,237,0.12)` | Tinted backgrounds |
| `--border` | `rgba(124,58,237,0.18)` | All borders |
| `--red` / `--red-soft` | `#e74c3c` / opacity variant | Eraser tool color |
| `--amber` / `--amber-soft` | `#f59e0b` / opacity variant | Sticky notes color |
| `--blue` / `--blue-soft` | `#3b82f6` / opacity variant | Resizer tool color |
| `--green` / `--green-soft` | `#22c55e` / opacity variant | Persistence pill |
| `--pink` / `--pink-soft` | `#ec4899` / opacity variant | Highlight tool color |
| `--text` | `oklch(0.96 0.01 290)` | Primary text |
| `--text-muted` | `oklch(0.65 0.02 290)` | Secondary text |
| `--text-dim` | `oklch(0.45 0.02 290)` | Tertiary / labels |

### Typography
- **Display / Body**: `Lato` (weights 300, 400, 700, 900) — loaded from Google Fonts
- **Mono**: `DM Mono` (weights 400, 500) — used for keyboard shortcut labels, data readouts, section labels, and all monospaced UI
- Additional fonts `Noto Sans` and `DM Sans` are preloaded via link tags (available for future use / A/B testing)

### Spacing & Layout
- Sections all use `padding: 100px 48px` via the `section` selector. The `#requests` section overrides to `padding-top: 40px`
- Max content widths: `1100px` (features, knowledge base, how-it-works) and `900px` (feature board)
- `--r: 12px` is the base border-radius token (currently underutilized; most components declare their own radius)

### Scroll Reveal System
All elements with class `.reveal` start invisible (`opacity: 0; transform: translateY(28px)`) and transition to visible (`.in` class) when they enter the viewport. Staggered entrance delays are controlled via utility classes:
- `.reveal-delay-1` → 0.1s
- `.reveal-delay-2` → 0.2s
- `.reveal-delay-3` → 0.3s
- `.reveal-delay-4` → 0.4s

### Grain Texture Overlay
A subtle noise grain is applied via `body::before` using an SVG `feTurbulence` filter baked into a `data:image/svg+xml` URI. Opacity is `0.028` — barely perceptible but adds premium texture to dark surfaces.

---

## Page Sections

The page is a single-scroll document. Sections are linked via `#anchor` hrefs in the nav.

| Section | Anchor | Description |
|---|---|---|
| Nav | — | Fixed top bar, glassmorphism (`backdrop-filter: blur(20px)`) |
| Hero | — | Full-viewport, animated browser mockup |
| Pillars | — | Three value props in a grid strip |
| Features | `#features` | Four feature cards with CSS-art visuals |
| Knowledge Base | — | "Home" popup mockup |
| How It Works | `#how` | Three-step numbered flow |
| Privacy Strip | — | Four privacy guarantee cards |
| Feature Requests | `#requests` | Interactive upvote board |
| Footer | — | Logo, links, versioning |

---

## Hero Browser Mockup

The hero section contains a pixel-precise browser window mock (`.browser-wrap`) built entirely in HTML/CSS. It simulates a live Adnota session on a fake Ars Technica article.

**Elements inside the mockup:**
- `#demo-highlight` — an `<span>` with `background` transitioned from transparent to `rgba(236,72,153,0.35)` (simulates the highlight tool)
- `#demo-sticky` — a yellow sticky note (`.anno-sticky`) that fades in/out
- `#demo-rect` — a pink rectangle annotation (`.anno-rect`)
- `#demo-erase-target` — a fake ad sidebar that gets `.erased` (opacity → 0)
- `.adnota-toolbar` — a miniaturized version of the real extension toolbar
- `.radial-menu` — a miniaturized version of the real extension's radial tool picker

The mockup also shows the Adnota "A" chip (`.ext-chip`) in the browser toolbar, mimicking the real Chrome extension badge.

---

## JavaScript

Two files, split by concern:

### `main.js` — site behavior

#### 1. Scroll Reveal (`IntersectionObserver`)
```js
const obs = new IntersectionObserver(entries => { ... }, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
```
Triggers the `.in` class on `.reveal` elements once 12% of the element is visible. Unobserves after triggering (one-shot animation).

#### 2. Feature Board Upvotes (`upvote`)
Each `.fr-item` row calls `upvote(this)` on click. The function:
- Increments the vote counter text
- Sets arrow and count color to `--accent`
- Sets `el.onclick = null` to enforce one vote per session

#### 3. Tweaks API (dormant)
The `#tweaks-panel` (currently commented out in HTML) provides a runtime customization panel used during development / design review. It is activated via `postMessage` from a parent frame (`__activate_edit_mode`). It supports:
- Accent color override (live CSS variable update)
- Hero tagline text
- CTA button label
- Feature board visibility toggle

The tweaks config is read from `<script id="__tweaks__" type="application/json">` in the `<head>`. This system is wired but dormant in production.

### `demo.js` — hero browser mockup loop

A sequenced 4-tool demo (~13s per cycle): eraser → resizer → sticky → marker. Drives both the dock's active-tool state and the `data-accent` color so the mockup's border and glow match whichever tool is "in use." Kicks off on `window.load` with a short settle delay.

### `demo.css` — hero mockup styles

Ported from the extension's own dock/UI CSS (`content/dock.css`, `lib/vellumUI.css` in the [adnota extension repo](https://github.com/adnota-app/adnota)) so the mockup looks identical to the real product. Every rule is scoped under `.hero-mockup` to prevent the extension's class names (`#vellum-dock`, `.vellum-dock-tool`, etc.) from leaking into the rest of the site.

---

## Feature Cards — CSS Art Visuals

Each of the four feature cards (`.feature-card`) contains a `.feature-visual` block that holds a small CSS-drawn diagram illustrating the tool behavior. These are pure HTML/CSS — no images:

| Card | Visual Class | What it shows |
|---|---|---|
| Eraser | `.vis-eraser` | Red border selection box with "likely ad" HUD label |
| Sticky Notes | `.vis-sticky` | Light page background with two rendered sticky notes |
| Highlight & Draw | `.vis-highlight` | Text with `<mark>` highlights and an SVG arrow stroke |
| Resizer | `.vis-resizer` | Blue dashed resize box with handle dots and CSS readout |

---

## Feature Request Board

The `#requests` section renders a static list of 5 feature request items (`.fr-item`). Each item has:
- A vote count (`.fr-count`) — starts at a pre-seeded number
- A status tag (`.fr-tag`) in states: `planned` (amber), `idea` (blue), `wip` (green)
- One-click upvote via the `upvote()` function (session-only, no persistence)

The CTA buttons link to [Featurebase](https://featurebase.app) (external feature voting tool) and GitHub.

---

## Responsive Breakpoints

All responsive rules are in a single `@media (max-width: 768px)` block at the bottom of `styles.css`:
- Nav links hidden on mobile (hamburger not implemented)
- All CSS grids collapse to single column
- Section padding reduced to `64px 24px`
- Privacy strip collapses from 4-col to 2-col grid
- Footer stacks vertically and centers text

---

## Extension Version & Platform

The footer notes `v1 · Chrome Extension · MV3`. The actual extension is a separate codebase ([adnota-app/adnota](https://github.com/adnota-app/adnota)). Key technical facts about the extension referenced in the marketing copy:
- **Storage**: `chrome.storage.local` — all annotation data stays on-device
- **Highlight tool**: Uses the CSS Custom Highlights API (zero DOM mutation, React-safe)
- **Eraser tool**: DOM `visibility: hidden` / element removal, with ad-detection heuristics
- **Sticky notes**: Multi-signal fuzzy anchor system (CSS selector + text fingerprint + structure + geometry scoring)
- **Resizer tool**: Injects CSS `width`/`max-width` overrides, persists domain-wide
- **Radial menu**: Alt+click (or keyboard shortcuts `Alt+E`, `Alt+H`, `Alt+S`)

---

## Tweaks Panel (development)

The `#tweaks-panel` can be enabled by uncommenting its HTML block in `public/index.html` and ensuring it has `display: block`. See the [Tweaks API](#3-tweaks-api-dormant) section above for what it controls.

---

## Deployment

Hosted on **Cloudflare Pages**, deployed automatically on push to `main`.

- **Build command**: none
- **Build output directory**: `public`

Only files inside `public/` are uploaded and served. The repo root (`README.md`, `CODE.md`, `LICENSE`, etc.) is invisible to visitors — those URLs return 404 on the live site. This means scratch files, drafts, and design experiments can live freely in the repo without leaking to the public.

To add a new asset (image, font, etc.), drop it inside `public/` and reference it with a path relative to the site root (e.g. `<img src="og-image.png">` for `public/og-image.png`).
