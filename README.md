# Instead — Things to do · Marketing site

A standalone, static, single-page marketing site for the **Instead: Things to do** mobile app —
a *dopamine menu* that helps you break the doomscroll loop. It's a fully immersive,
scroll-controlled **3D experience**: one persistent WebGL canvas behind the page tells a
continuous story (calm → the cold doomscroll trap → the warm, assembled "menu") as you scroll
from the hero to the final download CTA.

This repo is **completely separate** from the app — it's promotional only (no auth, no
backend, no app logic). Design tokens, voice, and the icon are derived from the app; see
[`THEME.md`](./THEME.md).

---

## Tech stack

| Concern | Choice |
|---|---|
| Build | **Vite 8** + **React 19** + **TypeScript** |
| 3D | **Three.js** via **@react-three/fiber** + **drei** + **postprocessing** (bloom/vignette) |
| Smooth scroll | **Lenis** |
| Scroll choreography | **GSAP + ScrollTrigger** scrubbing one master timeline that drives the scene |
| 2D motion | **Framer Motion** |
| Styling | **Tailwind CSS v4** (tokens wired in `src/index.css` `@theme`) |
| Fonts | **Fraunces** (display) + **Inter** (body), self-hosted via `@fontsource-variable` |

Output is **fully static** (`vite build` → `/dist`), deployable to any static host.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:5173  (this repo pins the public npm registry via .npmrc)
```

> **Note on the registry:** a local `.npmrc` pins installs to `https://registry.npmjs.org/`
> so they don't hit a private/corporate registry. Safe to keep; remove it if you prefer your
> own registry.

## Build (static)

```bash
npm run build      # type-checks, then emits /dist
npm run preview    # serve the production build locally
```

Other scripts: `npm run typecheck`, `npm run lint`.

---

## ✏️ Where to change things

Almost everything you'll want to edit lives in **one file**:

### `src/content/site.ts` — all copy, links, lists
- **Store URLs** → `links.appStore` / `links.playStore`. They're set to `{{APP_STORE_URL}}`
  / `{{PLAY_STORE_URL}}` placeholders; until you paste real URLs the buttons render but stay
  inert (with a tooltip), so nothing links nowhere.
- **Footer links** → Terms/Privacy are always shown (internal pages). Optional extras
  `links.support` / `links.instagram` appear when set (empty = hidden).
- **Section copy, tiers, features, stats** → the `hero`, `problem`, `idea`, `features`,
  `feeling`, `finalCta`, `footer` objects.
- **Testimonials / ratings / press** → `social.*` (these are clearly-marked placeholders —
  see "Placeholders to fill" below).

### Screenshots
- Drop PNGs in **`public/screens/`** and reference them in the components.
- The device mockup currently uses `public/screens/today-menu.png` (copied from the app's
  `feature_ss.png`). To add more device frames, add images there and render another
  `<DeviceFrame src="/screens/your-file.png" alt="…" />` (see `src/components/sections/Features.tsx`).

### Brand assets
- Live in **`public/brand/`** (app icon, splash, favicons), copied from the app. The favicon,
  Apple touch icon, OG image, and in-page logos all reference these.

### Design tokens
- **`src/index.css`** → the `@theme` block (colors, fonts, radii, shadows). Change a hex here
  and it updates everywhere (Tailwind utilities + the 3D scene reads matching values from
  `src/three/colors.ts`).

### The 3D story
- **`src/three/journey.ts`** — the master GSAP timeline + the per-beat values (chaos / warmth /
  gather / camera). Tweak these numbers to re-choreograph the narrative.
- **`src/three/Particles.tsx`** — the particle field shader (drift → vortex → menu).
- **`src/three/Scene.tsx`** — camera path, background grade, warm glow.
- **`src/three/Canvas3D.tsx`** — canvas settings + post-processing (bloom/vignette).

### Legal pages (Terms of Service / Privacy Policy)
- Live at **`/terms`** and **`/privacy`** (real routes — directly linkable, refresh-safe), and
  are linked in the footer.
- Content + the editable constants are in **`src/content/legal.ts`**. Before launch, set:
  - `contactEmail` — your real support email (shown on both pages)
  - `governingLaw` — your jurisdiction (used in the Terms)
  - `lastUpdated` — the date string
  - These are general, plain-language docs adapted to a **local-first wellness app** (no
    accounts, on-device data, store-handled subscriptions). Have a lawyer review for your
    jurisdiction if you need certainty.
- Routing uses `react-router-dom`. Direct-URL access on static hosts is handled by
  `public/_redirects` (Netlify) and `vercel.json` (Vercel) — both included.

### Analytics
- No third-party scripts ship by default. Drop your snippet (Plausible / Fathom / GA) into the
  clearly-marked comment block in **`index.html`** `<head>`.

---

## Accessibility & performance

- **`prefers-reduced-motion`** → the 3D canvas is replaced by a calm, static warm gradient and
  all reveals/transitions are disabled; the story still reads via the 2D sections.
- **Mobile / low-end devices** → particle count, pixel ratio, and post-processing scale down
  automatically (`src/lib/useDeviceTier.ts`).
- Render loop **pauses when the tab is hidden**; pixel ratio is capped; the Three.js runtime is
  **lazy-loaded** in its own chunk so it never blocks first paint. A tasteful preloader masks
  loading and always lifts (hard timeout — never stuck).
- Semantic HTML, skip-link, keyboard-focusable CTAs with visible focus rings, alt text,
  `<noscript>` fallback, and high-contrast warm-paper palette.

---

## SEO / social

- Title, description, theme-color, canonical, Open Graph + Twitter cards, `site.webmanifest`,
  `robots.txt`, and `sitemap.xml` are all set in `index.html` / `public/`.
- **OG preview image**: `public/og.png` (1200×630). To regenerate after a copy change, open
  `scripts/og-template.html` in a browser and screenshot it at 1200×630, or just replace the PNG.
- Update the canonical/OG/sitemap URL (currently `https://insteadthingstodo.app/`) to your real
  domain in `index.html`, `public/sitemap.xml`, and `public/robots.txt`.

---

## Deploy

It's a static SPA — any static host works.

- **Vercel:** import the repo; framework preset **Vite**; build `npm run build`; output `dist`.
- **Netlify:** build `npm run build`; publish directory `dist`.
- **Any host / S3 / GitHub Pages:** upload the contents of `dist/`.

No env vars or secrets are required.

---

## ✅ Placeholders to fill in before launch

1. **`{{APP_STORE_URL}}`** and **`{{PLAY_STORE_URL}}`** → `src/content/site.ts` › `links`.
2. **Testimonials** (`social.testimonials`) — replace the three placeholder quotes/names.
3. **Rating** (`social.rating`) — real star score + review count once live.
4. **Press / "as seen in"** (`social.press`) — real logos/mentions (currently text placeholders).
5. **Feeling stats** (`feeling.stats`) — swap for real numbers if you have them.
6. **Domain** — replace `https://insteadthingstodo.app/` in `index.html`, `sitemap.xml`,
   `robots.txt`.
7. **Legal pages** — set `contactEmail`, `governingLaw`, and `lastUpdated` in
   `src/content/legal.ts` (and have a lawyer review the wording for your jurisdiction).
8. **(Optional)** more app screenshots in `public/screens/` and extra `<DeviceFrame>`s.
9. **(Optional)** analytics snippet in `index.html`.

> The store-badge artwork is a clean, faithful recreation of the Apple/Google badges. If you
> need the pixel-exact official badges, download them from Apple/Google and drop them into
> `src/components/StoreBadges.tsx`.
