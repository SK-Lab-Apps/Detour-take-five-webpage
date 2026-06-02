# THEME.md — Detour: Take Five

> Extracted from the app source at `../Detour-Take_Five` (read-only reference).
> Every design token in this marketing site derives from what's documented here, so the
> site reads as a natural extension of the app — not a generic template.

---

## 1. Brand in one line

**Detour — Take Five** is a *dopamine menu*: a short, hand-written list of real-life things
you'd rather do than doomscroll. You decide while you're calm, so when the urge hits you
just pick off the menu instead of fighting willpower.

> "A menu of things you'd rather do than scroll." — app onboarding
> "When the urge hits, you don't make good decisions. So we'll decide now, while you're calm."

The governing metaphor is a **vintage restaurant / café menu**: letterpress paper, dotted
leaders, three tiers (Starters / Mains / Desserts), tasteful flourishes.

---

## 2. Color palette (exact hex, from `constants/theme.ts`)

### Core / paper

| Token         | Hex                      | Role |
|---------------|--------------------------|------|
| `paper`       | `#FAF4E8`                | Primary background (warm cream) |
| `paperDeep`   | `#F2E9D6`                | Deeper paper / section wash |
| `splashBg`    | `#F3ECDA`                | App splash background (between the two) |
| `card`        | `#FFFCF5`                | Card / surface (near-white cream) |
| `cream`       | `#F7EBD0`                | Soft accent fill |

### Ink (text)

| Token       | Hex         | Role |
|-------------|-------------|------|
| `ink`       | `#2A1F18`   | Primary text (warm near-black) |
| `inkSoft`   | `#5A4A3D`   | Body text |
| `inkMuted`  | `#8A7B6D`   | Captions, meta, leaders |
| `hair`      | `rgba(42,31,24,0.08)` | Hairline borders |
| `hairStrong`| `rgba(42,31,24,0.16)` | Stronger dividers |

### Accents

| Token            | Hex         | Role |
|------------------|-------------|------|
| `terracotta`     | `#D2643A`   | **Primary brand accent** — CTAs, "Surprise me", highlights |
| `terracottaDeep` | `#A84A26`   | Eyebrows, pressed states, deep accent |
| `mustard`        | `#C99A2B`   | **Tier: Starters** |
| `forest`         | `#4F6B3A`   | **Tier: Mains** (also `success`) |
| `plum`           | `#8B4060`   | **Tier: Desserts** |
| `danger`         | `#A8392A`   | Errors only |

### Tier mapping (load-bearing brand system)

```
Starters → mustard #C99A2B → "1–5 min · easy yes"
Mains    → forest  #4F6B3A → "10–30 min · the good stuff"
Desserts → plum    #8B4060 → "Quick joy, not junk"
```

### Gradients / treatment
- The app is **light-only** (warm paper), not dark. We honor that: the site is a warm,
  paper-lit experience. The one "dark" beat is narrative (the doomscroll vortex), rendered
  as a *cold desaturation* of the same world rather than a true dark theme — it resolves
  back to warm paper.
- App background gradient (from `PaperBackground`): a faint terracotta glow over paper —
  `linear-gradient(to bottom right, rgba(210,100,58,0.06), transparent)`. Reuse as the
  ambient page wash.
- Shadows are soft and warm: `shadowColor #000, opacity 0.08, radius 20, offset y 10`.
  No hard/black shadows.

---

## 3. Typography

### App
- **Display / headings:** serif — `Georgia` on iOS, platform `serif` on Android. Used for
  titles, the "Today's Menu" header, menu lines, prices, italic quotes.
- **Body / UI:** the system sans (San Francisco / Roboto), 16px, `inkSoft`.
- **Eyebrow / labels:** 11px, `letter-spacing: 2`, UPPERCASE, weight 700, `terracottaDeep`.
- **Menu header:** 14px, `letter-spacing: 6`, UPPERCASE, `inkMuted` — very wide tracking.
- Big titles use **negative tracking**: `-0.5` at 32px, down to `-2` at 56px.
- Line-height on titles ≈ `1.1`. Italic serif for pull-quotes.

### Site choice (web)
Georgia isn't distinctive enough on the web to feel premium, so we use a warm optical serif
that carries the same literary, slightly-vintage feeling and supports the negative-tracking
display look:

- **Display:** **Fraunces** (variable; weights 300–700, optical `opsz`, `SOFT` axis,
  italic). Warm, editorial, a touch quirky — exactly the "calm but characterful menu" vibe.
- **Body / UI:** **Inter** (variable) — clean, neutral, excellent at small sizes; stands in
  for the app's system sans.
- Fallback stack mirrors the app: `Fraunces, Georgia, 'Times New Roman', serif` and
  `Inter, -apple-system, system-ui, sans-serif`.

Type scale (rem, fluid via `clamp()`): eyebrow .69 · body 1 · h3 1.5 · h2 2.25 · h1 3–5.5.
Tracking: eyebrows `0.18em`, menu labels `0.32em`, display `-0.02em`.

---

## 4. Iconography, shape & material language

- **App mark:** a folded paper **menu card** (standing tent-card) with a **clock face** on
  it, hands at ~**11:55** — literally "take five (to twelve)". Ink line-art outline,
  terracotta hands + dots, on cream. Line-drawn, letterpress, hand-inked feel.
  Assets: `assets/images/icon.png` (1024²), `splash-icon.png`, `adaptive-icon.png`,
  `favicon*.png`. **Reuse these** for favicon / OG / app-icon on the site.
- **Illustration style:** thin ink line-art, vintage menu ornaments — corner brackets,
  dotted **leader lines** (`••••` between a dish and its time), short **flourish** bars in
  terracotta, hairline rules / "crest" rules around eyebrows.
- **Activity icons:** plain emoji (🌿 ✍️ 🎷 🛏️ ✨ 💌 📖) — friendly, not custom glyphs.
- **Corner radii** (`radius`): `sm 8 · md 12 · lg 18 · xl 28`. Cards use **lg (18)**.
  Buttons & pills are **fully rounded (999)**. The paper "menu" card uses a tight **6**
  (real-paper feel) and a slight `-1.2°` rotation.
- **Spacing rhythm** (`spacing`): `4 · 8 · 12 · 16 · 24 · 32` (xs→xxl). 8px base grid.
- **Buttons:** primary = solid `ink` fill, `paper` text, pill, subtle press scale `0.985`
  + medium haptic. Outline = hairline border. Ghost = text only. The big "Surprise me"
  CTA is a **terracotta** pill.
- **Cards:** `card` fill, `lg` radius, `hair` border, soft warm shadow. Tier cards add a
  4px top border in the tier color.

---

## 5. Brand voice & tone

Calm, warm, literary, reassuring — with a dry, knowing wit. Never clinical, never hustle,
never shaming. Anti-willpower, pro-showing-up. The menu metaphor runs through every string.

**Pillars**
- **Restorative, not productive.** "Showing up matters more than the score."
- **Decide while calm.** "A menu you wrote in advance beats willpower every time."
- **Gentle / forgiving.** Streaks have a "grace day"; a missed day isn't failure.
- **Playful menu-speak.** "the good stuff", "Quick joy, not junk", "munches",
  "made by you", "Maybe add one you'll actually pick", "9 fits right now".
- **Yours.** "— made by you —"; you write and edit your own menu.

Words it uses: *menu, today's menu, tiers, starters/mains/desserts, take five, detour,
showed up, grace day, fits right now, surprise me, reflection.*
Words to avoid: *productivity, hustle, optimize, hack, grind, screen-time police, shame.*

---

## 6. Core value prop & key features (the site must explain these)

**Value prop:** Break the doomscroll/dopamine-depletion loop by choosing, in advance and
while calm, a personal menu of small real-life "detours" you actually want to do — then,
in a weak moment, pick one off the menu in seconds instead of relapsing into the feed.

**Key features / screens (from `app/`):**
1. **Today's Menu** — the home screen. A daily, mood- and time-filtered menu of your
   activities, grouped into the three tiers. Shows a streak (🔥) and an "N fits right now".
2. **Mood + Time filters** — pick how you feel (😴😢😐😌⚡) and how long you've got
   (`15m · 30m · 1h · any`); the menu adapts to what fits.
3. **Surprise me** — one tap shuffles a single fitting pick out of everything that fits
   right now ("9 fits right now"). Removes decision friction.
4. **Three tiers** — Starters (1–5 min, easy yes), Mains (10–30 min, the good stuff),
   Desserts (quick joy, not junk). A curated starter bank + you add your own.
5. **Build-your-own menu** — onboarding has you pick/add items; fully editable anytime.
   Custom tier names in Settings ("Make it sound like you.").
6. **Check-in / streak** — mark that you showed up; gentle streak with a **grace day** so
   one off day doesn't reset you.
7. **Stats** — "Showed up" days, munches this week, top items, most-skipped tier,
   average mood at open ("Showing up matters more than the score.").
8. **History** — what you picked over time.
9. **Evening reflection** — one optional gentle notification (~9pm) to take five.

**Onboarding arc (good source of site narrative):** Welcome → why (decide while calm) →
meet the menu (three tiers) → build yours → mood → reminder → ready.

---

## 7. Site design tokens (derived — wired into Tailwind `@theme`)

```
--color-paper:        #FAF4E8
--color-paper-deep:   #F2E9D6
--color-card:         #FFFCF5
--color-cream:        #F7EBD0
--color-ink:          #2A1F18
--color-ink-soft:     #5A4A3D
--color-ink-muted:    #8A7B6D
--color-terracotta:   #D2643A
--color-terracotta-deep: #A84A26
--color-mustard:      #C99A2B   (Starters)
--color-forest:       #4F6B3A   (Mains)
--color-plum:         #8B4060   (Desserts)
--color-hair:         rgba(42,31,24,0.08)
--color-hair-strong:  rgba(42,31,24,0.16)

font-display: 'Fraunces', Georgia, serif
font-sans:    'Inter', system-ui, sans-serif

radius: sm .5rem · md .75rem · lg 1.125rem · xl 1.75rem · pill 999px
shadow-paper: 0 10px 30px -12px rgba(42,31,24,.18)
```

### 3D color grade (lighting through the scroll journey)
- **Warm / resolved (hero, idea, features, calm, CTA):** key light warm terracotta
  `#D2643A`, fill mustard `#C99A2B`, ambient paper `#FAF4E8`; bloom on warm emissives.
- **Cold / chaos (the doomscroll beat):** desaturate + cool toward steel-blue
  `~#6E7E8C` over the same paper world; faster motion, tighter camera — then it warms back.
- Tier tokens in 3D glow in their tier colors (mustard / forest / plum).

### Ambiguity calls (noted per brief)
- App is Georgia/light-only with no custom web font → chose **Fraunces + Inter** as the
  closest premium web equivalents (warm, literary). Documented above.
- App has no "dark mode"; the doomscroll darkness is a *narrative grade*, not a theme.
- No marketing illustrations exist in-app beyond the icon → site illustration is the
  procedural 3D scene, styled to the ink-line + warm-paper language above.
