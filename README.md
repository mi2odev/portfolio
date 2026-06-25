# Mohamed Mehdi Zitouni — Portfolio

Six fully-designed portfolio directions in one app, with a live version switcher and FR / EN / AR (RTL) language toggle. Built with **Vite + React + TypeScript + Tailwind CSS**.

| # | Version | Vibe |
|---|---------|------|
| V1 | **Terminal** | Dark, code-driven, lime accent |
| V2 | **Editorial** | Warm paper & ink, brutalist |
| V3 | **Serif** | Cream & indigo, elegant |
| V4 | **Reactive** | Live constellation, custom cursor, 3D tilt |
| V5 | **Gamer** | RPG character-sheet HUD |
| V6 | **Blueprint** | Technical drawing |

Use the floating switcher at the bottom of the screen to move between versions (← / → or click a tile). The choice and the chosen language both persist across reloads.

---

## Getting started

Requires **Node 18+**.

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # type-check + production build into dist/
npm run preview    # preview the production build
```

---

## Project structure

```
portfolio-react/
├─ public/
│  ├─ photo.png                      # portrait used by every version
│  ├─ CV_Mohamed_Mehdi_ZITOUNI.pdf   # CV (the “Download CV” buttons)
│  └─ favicon.svg
├─ src/
│  ├─ main.tsx                       # React entry
│  ├─ App.tsx                        # version state + switcher + LanguageProvider
│  ├─ index.css                      # Tailwind directives, resets, keyframes
│  ├─ data/
│  │  └─ content.ts                  # ALL copy (FR/EN/AR) + profile + skills — one source of truth
│  ├─ context/
│  │  └─ LanguageContext.tsx         # language state, persistence, document dir
│  ├─ hooks/
│  │  ├─ useScrollProgress.ts        # top progress bar
│  │  ├─ useHover.ts                 # hover state for inline-styled elements
│  │  ├─ useReactiveFX.ts            # V4 engine (canvas, cursor, parallax, tilt, magnetic)
│  │  ├─ useGamerFX.ts               # V5 engine (reticle, parallax, XP bar, stat fills)
│  │  └─ useBlueprintFX.ts           # V6 engine (crosshair guides, plot %)
│  ├─ components/
│  │  ├─ Hover.tsx                   # polymorphic element with a hover style
│  │  ├─ Reveal.tsx                  # scroll-into-view entrance animation
│  │  ├─ icons.tsx                   # GitHub / Instagram / Facebook / phone SVGs
│  │  └─ VersionSwitcher.tsx         # the floating bottom switcher
│  └─ versions/
│     ├─ Terminal.tsx   Editorial.tsx   Serif.tsx
│     └─ Reactive.tsx   Gamer.tsx       Blueprint.tsx
└─ index.html                        # loads all Google Fonts in one request
```

### Editing content

All text, projects, education, skills, contact details, and the three language
translations live in **`src/data/content.ts`**. Edit it once and every version
updates. Version-specific vocabulary (the gamer “quest/loot” words, the
blueprint “revision/sheet” words) lives inside the relevant `versions/*.tsx`
file.

### A note on styling

Tailwind is set up (config, PostCSS, directives) and used for the global theme,
keyframes, and the switcher shell. The six version components use **inline
style objects** that mirror the original hand-tuned designs 1:1 — this keeps
them pixel-accurate and easy to tweak value-by-value. You can progressively
convert any version to Tailwind utility classes if you prefer; the data layer
and structure won’t change.

---

## Push to GitHub

This was generated outside your machine, so push it yourself. From inside the
`portfolio-react/` folder:

```bash
git init
git add .
git commit -m "Portfolio: six design directions (Vite + React + TS + Tailwind)"
git branch -M main
git remote add origin https://github.com/mi2odev/portfolio.git
git push -u origin main
```

If the repo already has commits and you want to overwrite:

```bash
git push -u origin main --force
```

### Deploy

`npm run build` outputs a static `dist/`. Drop it on Vercel, Netlify, or GitHub
Pages. For **GitHub Pages** under `…/portfolio/`, set a base path in
`vite.config.ts`:

```ts
export default defineConfig({ plugins: [react()], base: '/portfolio/' });
```
