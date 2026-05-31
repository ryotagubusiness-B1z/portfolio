# ÉCLAT — 光と影のあいだ

An editorial, magazine-style portfolio for **Ryota Gu** — a visual essay on
light, shadow, and the quiet objects between them. Built in the spirit of
*Emergence Magazine*: generous negative space, a high typographic jump,
warm paper, deep shadow, and one earth-toned accent used sparingly.

Hand-built. **No framework, no build step, no dependencies** — just semantic
HTML, a bespoke CSS design system, and ~120 lines of vanilla JS. This keeps it
fast (Lighthouse 95+ territory), accessible, and trivial to host anywhere
(GitHub Pages, Netlify, any static host).

## Type
| Role | Typeface |
|------|----------|
| Display / headings | **Gravitas One** |
| Accent / script | **Great Vibes** |
| Body & Japanese | **Sawarabi Gothic** |

Loaded from Google Fonts with `display=swap`.

## Run it
No tooling required — open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000   # → http://localhost:8000
```

## Structure
```
index.html              # one page, semantic landmarks, a11y skip-link
assets/
  css/style.css         # design tokens + every component, hand-tuned
  js/main.js            # scroll-reveal, parallax, progress, magnetic hover
  img/*.svg             # editorial light-&-shadow placeholder art (see below)
```

## ▸ Swapping in the real photographs
The four `.svg` files in `assets/img/` are hand-drawn placeholders that match
each photo's mood (botanical shadow, venetian-blind sunflower, books in amber
light, the walnut desk). **To use the real photos, drop them in and update the
`src`** in `index.html`:

| Placeholder | Replace with | Used in |
|-------------|--------------|---------|
| `hero-botanica.svg` | the botanical-shadow-on-linen photo | hero + Folio 04 |
| `work-sunflower.svg` | the sunflower + blind-light photo | Folio 01 |
| `work-books.svg` | the stacked books in amber light | Folio 02 |
| `work-desk.svg` | the walnut-desk flat-lay | Folio 03 + Studio |

Recommended: export as `.webp` (or `.jpg`), keep them ~1600px on the long edge,
and update the `src`/`width`/`height` attributes. The CSS already handles
cropping via `object-fit: cover` and per-figure `aspect-ratio`, so any
orientation slots in cleanly.

## Accessibility & motion
- Semantic landmarks, descriptive `alt` text, visible focus, skip-to-content.
- All motion is gated behind `prefers-reduced-motion` and a single
  `requestAnimationFrame` loop (no scroll jank).
