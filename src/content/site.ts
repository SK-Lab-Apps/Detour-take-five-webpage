/**
 * site.ts — Single source of truth for all marketing copy, links, and lists.
 *
 * ✏️  EDIT HERE. Everything the visitor reads lives in this file so you never have to
 *     hunt through components. Swap the store URLs, testimonials, ratings, and screenshots
 *     below; the rest of the site reads from here.
 *
 * Placeholders to fill in are marked with  // TODO(you)
 */

export const site = {
  name: 'Instead',
  fullName: 'Instead: Things To Do',
  tagline: 'Beat the urge to scroll.',
  description:
    'Instead is a dopamine menu: a short, hand-written list of small real-life detours ' +
    'you’d rather do than doomscroll. Decide while you’re calm, then beat the urge to scroll.',

  // ── Store links ───────────────────────────────────────────────────────────
  // TODO(you): paste your real store URLs. Leaving the {{...}} placeholder keeps
  // the button disabled-looking and harmless until you swap it.
  links: {
    appStore: 'https://apps.apple.com/us/app/detour-take-five/id6774246848',
    playStore: '{{PLAY_STORE_URL}}',
    // Optional secondary footer links. Leave '' to hide.
    // (Terms & Privacy are built-in pages at /terms and /privacy — see src/content/legal.ts.)
    support: '',
    instagram: '',
  },

  // ── Brand accent for tiers (mirrors the app) ──────────────────────────────
  tiers: [
    {
      key: 'starters',
      label: 'Starters',
      blurb: '1–5 min · easy yes',
      color: 'mustard',
      examples: ['Step outside for two minutes', 'Splash cold water on your face', 'Tidy one square foot'],
    },
    {
      key: 'mains',
      label: 'Mains',
      blurb: '10–30 min · the good stuff',
      color: 'forest',
      examples: ['Take a real walk, no phone', 'Read ten pages of a paper book', 'Cook something good'],
    },
    {
      key: 'desserts',
      label: 'Desserts',
      blurb: 'Quick joy, not junk',
      color: 'plum',
      examples: ['Play one song, very loud', 'Pet an animal', 'Watch a favorite scene'],
    },
  ],

  // ── Section copy ──────────────────────────────────────────────────────────
  hero: {
    eyebrow: 'Est. Today',
    title: 'Instead',
    sub: 'Things To Do',
    line: 'Beat the urge to scroll.',
    cta: 'Get the app',
    scrollHint: 'Scroll to begin',
  },

  problem: {
    eyebrow: 'The trap',
    title: 'The feed never runs out. That’s the problem.',
    body:
      'You reach for five minutes of relief and surface an hour later — flatter, foggier, ' +
      'a little worse. It isn’t weakness. The loop is built to keep pulling, and willpower ' +
      'in a weak moment never wins.',
    pull: 'When the urge hits, you don’t make good decisions.',
  },

  idea: {
    eyebrow: 'The idea',
    title: 'So decide now, while you’re calm.',
    body:
      'A dopamine menu is a short list of real-life detours you actually want — written in ' +
      'advance, by you, for the version of you who’s tired and tempted. When the urge hits, ' +
      'you don’t negotiate. You just order off the menu.',
    pull: 'A menu you wrote in advance beats willpower every time.',
    foot: 'It takes two minutes.',
  },

  features: {
    eyebrow: 'How it works',
    title: 'Three tiers, like a real menu.',
    items: [
      {
        key: 'menu',
        title: 'Today’s Menu',
        body:
          'Open the app and your menu is already set for right now — grouped into Starters, ' +
          'Mains, and Desserts, with a gentle streak for simply showing up.',
      },
      {
        key: 'fit',
        title: 'Mood & time, matched',
        body:
          'Tell it how you feel and how long you’ve got — fifteen minutes, an hour, anything. ' +
          'The menu quietly narrows to what actually fits.',
      },
      {
        key: 'surprise',
        title: 'Surprise me',
        body:
          'No energy to choose? One tap pulls a single pick from everything that fits right ' +
          'now. Decision made.',
      },
      {
        key: 'yours',
        title: 'Made by you',
        body:
          'Start from a curated bank, then add your own and rename the tiers until it sounds ' +
          'like you. It’s your menu — edit it anytime.',
      },
      {
        key: 'reflect',
        title: 'One gentle ping',
        body:
          'An optional evening reflection around nine — a quiet nudge to step away before the ' +
          'day folds shut. No badges screaming at you.',
      },
      {
        key: 'grace',
        title: 'A grace day, built in',
        body:
          'Miss a day and the streak holds. Showing up matters more than the score — so the ' +
          'app never punishes you for being human.',
      },
    ],
  },

  feeling: {
    eyebrow: 'The payoff',
    title: 'Five minutes back. Then the next five.',
    body:
      'No detox, no shame, no twelve-step cleanse. Just a calmer reach for your phone and a ' +
      'shorter walk back to yourself — one small detour at a time.',
    stats: [
      // TODO(you): replace with real numbers once you have them.
      { value: '5 min', label: 'is all it asks for' },
      { value: '60+', label: 'curated detours to start' },
      { value: '3', label: 'tiers, made yours' },
    ],
  },

  // ── Social proof (PLACEHOLDERS — swap for real once you have them) ─────────
  social: {
    eyebrow: 'Kind words',
    title: 'Quietly, it’s working.',
    // TODO(you): real ratings once live.
    rating: { stars: 5, score: '5.0', count: 'New on the App Store' },
    // TODO(you): replace with real testimonials (with permission).
    testimonials: [
      {
        quote:
          'I stopped white-knuckling my phone. Now I just glance at the menu and pick something. ' +
          'It’s embarrassing how well it works.',
        name: 'Placeholder Name',
        meta: 'Early tester',
      },
      {
        quote:
          'The grace day is the whole thing for me. I don’t spiral after one bad night anymore.',
        name: 'Placeholder Name',
        meta: 'Early tester',
      },
      {
        quote:
          'It feels less like an app yelling at me and more like a note from a calmer version ' +
          'of myself.',
        name: 'Placeholder Name',
        meta: 'Early tester',
      },
    ],
    // TODO(you): swap these for real logos/marks; shown as text until then.
    press: ['As seen in — your press here', 'Featured by — your feature here'],
  },

  finalCta: {
    eyebrow: 'Beat the urge',
    title: 'Your menu is waiting.',
    body: 'Two minutes to build it. A lifetime of small, better detours.',
    cta: 'Get Instead',
    foot: 'Free to start.',
  },

  footer: {
    tagline: 'Beat the urge to scroll.',
    madeBy: '— made by you —',
    // TODO(you): year auto-updates; edit the rest as you like.
    legal: 'Instead: Things To Do',
  },
} as const

export type Site = typeof site
export type Tier = (typeof site.tiers)[number]
