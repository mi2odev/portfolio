# Mohamed Mehdi Zitouni — Portfolio

[![CI](https://github.com/mi2odev/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/mi2odev/portfolio/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built with Vite](https://img.shields.io/badge/built%20with-Vite%206-646CFF.svg)](https://vite.dev)

Eight fully-designed portfolio directions in one app, with a live version
switcher and an FR / EN / AR (RTL) language toggle.
Built with **Vite + React + TypeScript + Tailwind CSS**.

**Live:** <https://mohamedmehdi-zitouni.netlify.app>

| #   | Version        | Vibe                                       |
| --- | -------------- | ------------------------------------------ |
| V1  | **Terminal**   | Dark, code-driven, lime accent             |
| V2  | **Editorial**  | Warm paper & ink, brutalist                |
| V3  | **Serif**      | Cream & indigo, elegant                    |
| V4  | **Reactive**   | Live constellation, custom cursor, 3D tilt |
| V5  | **Gamer**      | RPG character-sheet HUD                    |
| V6  | **Blueprint**  | Technical drawing                          |
| V7  | **Manga**      | Black & white comic page                   |
| V8  | **Neural Map** | Force-directed skills graph                |

Switch versions from the control in the navbar, or press **Alt/Option + ← / →**.
The chosen version and language both persist across reloads.

---

## Getting started

Requires **Node 20.19+** (the version in [`.nvmrc`](.nvmrc) is what CI uses).

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check, then a production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

### Scripts

| Script                 | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Vite dev server with hot reload                    |
| `npm run build`        | `tsc -b` then `vite build` — a type error fails it |
| `npm run preview`      | Serves `dist/` locally                             |
| `npm run typecheck`    | TypeScript only, no emit                           |
| `npm run lint`         | ESLint (TypeScript + React Hooks + jsx-a11y)       |
| `npm run format`       | Prettier, write mode                               |
| `npm run format:check` | Prettier, check mode (what CI runs)                |
| `npm test`             | Vitest suite                                       |
| `npm run verify`       | typecheck + lint + test, i.e. the pre-push gate    |

---

## Project structure

```
portfolio/
├─ .github/workflows/ci.yml           # type-check · lint · format · test · build
├─ public/
│  ├─ photo.webp                      # portrait used by every version
│  ├─ og-image.jpg                    # social link preview
│  ├─ CV_Mohamed_Mehdi_ZITOUNI.pdf    # CV (the “Download CV” buttons)
│  ├─ site.webmanifest                # installable-app metadata
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx                        # React entry
│  ├─ App.tsx                         # version state, lazy loading, keyboard nav
│  ├─ index.css                       # Tailwind directives, resets, keyframes, focus styles
│  ├─ data/
│  │  └─ content.ts                   # ALL copy (FR/EN/AR) + profile + skills — one source of truth
│  ├─ context/
│  │  ├─ LanguageContext.tsx          # provider: language state, persistence, document dir
│  │  ├─ languageContextValue.ts      # the context object + its types
│  │  └─ useLanguage.ts               # the consumer hook
│  ├─ hooks/
│  │  ├─ useScrollProgress.ts         # top progress bar
│  │  ├─ useHover.ts                  # hover state for inline-styled elements
│  │  ├─ useReactiveFX.ts             # V4 engine (canvas, cursor, parallax, tilt, magnetic)
│  │  ├─ useGamerFX.ts                # V5 engine (reticle, parallax, XP bar; touch + gyro on phones)
│  │  ├─ useBlueprintFX.ts            # V6 engine (crosshair, survey markers, grid drift)
│  │  ├─ useMediaQuery.ts             # reactive matchMedia (+ useIsPhone / useIsTouch)
│  │  └─ useTilt.ts                   # shared touch helpers: haptics, gyroscope binding
│  ├─ components/
│  │  ├─ Hover.tsx                    # polymorphic element with a hover style
│  │  ├─ Reveal.tsx                   # scroll-into-view entrance animation
│  │  ├─ ErrorBoundary.tsx            # keeps a crashing version off the whole page
│  │  ├─ SkipLink.tsx                 # first tab stop, jumps past the navbar
│  │  ├─ icons.tsx                    # GitHub / Instagram / Facebook / phone SVGs
│  │  ├─ VersionSwitcher.tsx          # navbar dropdown + floating switcher
│  │  └─ versionThemes.ts             # per-version tag, accent and active styles
│  ├─ versions/                       # the eight designs + their shared props type
│  └─ __tests__/                      # content, theme, context and boundary tests
└─ index.html                         # meta, Open Graph, JSON-LD, fonts
```

### Editing content

All text, projects, education, skills, contact details and the three
translations live in **`src/data/content.ts`**. Edit it once and every version
updates. Version-specific vocabulary (the gamer “quest/loot” words, the
blueprint “revision/sheet” words) lives inside the relevant `versions/*.tsx`
file.

`npm test` guards this file: it fails if a translation drifts out of shape,
if a string is left empty, if a project link is not `https`, or if the `mailto:`
and `tel:` links stop matching the displayed email and phone number.

### A note on styling

Tailwind is set up (config, PostCSS, directives) and used for the global theme,
keyframes and the switcher shell. The eight version components use **inline
style objects** that mirror the original hand-tuned designs 1:1 — this keeps
them pixel-accurate and easy to tweak value-by-value. `src/versions/`,
`src/index.css` and `versionThemes.ts` are therefore excluded from Prettier so
their deliberate one-line-per-element layout survives; everything else is
formatted.

### Performance

Every version is a lazy chunk, so the first paint downloads only the design the
visitor lands on (~21 kB) instead of all eight (~433 kB). The neighbouring
versions are prefetched while the browser is idle, so switching still feels
instant. The portrait — the largest element on every version — is a preloaded
68 kB WebP rather than the original 2.2 MB PNG.

### Accessibility

- A skip link is the first tab stop on every version.
- `:focus-visible` rings are drawn in `currentColor`, so they stay legible on
  the dark, cream and paper themes alike.
- `prefers-reduced-motion` disables the animations, the canvas engines and the
  scroll behaviour.
- `<html lang>` and `dir` follow the language toggle; Arabic renders RTL.
- Page text is selectable — a recruiter can copy the email address — while the
  chrome and decorative layers are not.

---

## Deploying

`npm run build` outputs a static `dist/`, including a `robots.txt` and a
`sitemap.xml` generated with the correct absolute URL.

**Netlify** is configured in [`netlify.toml`](netlify.toml): build command,
Node version, SPA fallback, security headers and immutable caching for hashed
assets. Connect the repo and it deploys as-is.

**Anywhere else**, set the public origin so link previews and the canonical URL
resolve — copy `.env.example` to `.env` and fill in:

```bash
VITE_SITE_URL=https://your-domain.com
```

Netlify (`URL`) and Vercel (`VERCEL_PROJECT_PRODUCTION_URL`) are detected
automatically, so this is only needed for other hosts.

For **GitHub Pages** under `…/portfolio/`, add a base path in `vite.config.ts`:

```ts
export default defineConfig({ base: '/portfolio/' /* … */ });
```

---

## Licence

Code: [MIT](LICENSE). The personal content — photograph, CV, biography and
project descriptions — remains © Mohamed Mehdi Zitouni.
