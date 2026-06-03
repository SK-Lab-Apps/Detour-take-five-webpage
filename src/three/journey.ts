import gsap from 'gsap'

/**
 * journey — the single shared state the 3D scene reads every frame.
 *
 * A GSAP master timeline (built in `createJourneyTimeline`) animates these fields and is
 * scrubbed by a page-length ScrollTrigger, so the whole 3D narrative is deterministic and
 * tied 1:1 to scroll position. The scene reads `journey` inside useFrame and lerps toward
 * it for an extra layer of silk.
 *
 * The arc runs "feed → menu": the page opens inside the chaotic feed and resolves into the
 * calm menu.
 *
 * Field meanings (all 0..1 unless noted):
 *   p       overall progress, linear across the page
 *   chaos   swarm(0) → vortex/tunnel(1); the frantic "pull" of the feed   (peaks at the problem)
 *   warmth  colour grade, cold steel(0) → warm paper/tier(1)
 *   gather  scattered cards(0) → assembled menu of tokens(1)
 *   settle  assembled menu(0) → "put the phone down": the menu dissolves and only a few soft
 *           warm motes remain, breathing, in a calm near-empty space (the final CTA state)
 *   cam     camera path parameter, hero(0) → final calm(1)
 */
export interface Journey {
  p: number
  chaos: number
  warmth: number
  gather: number
  settle: number
  cam: number
}

/** Initial state = Beat 1, the hero swarm: a busy, cool-ish, dispersed feed. */
export const journey: Journey = {
  p: 0,
  chaos: 0.12,
  warmth: 0.28,
  gather: 0,
  settle: 0,
  cam: 0,
}

/** Live pointer in normalized device coords (-1..1), smoothed for parallax. */
export const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

/** Narrative beats as fractional scroll positions (0..1). */
export interface Beats {
  hero: number
  problem: number
  idea: number
  features: number
  feeling: number
  cta: number
}

/** Fallback fractions if the DOM can't be measured (roughly the real section layout). */
export const BEAT_FALLBACK: Beats = {
  hero: 0,
  problem: 0.14,
  idea: 0.28,
  features: 0.43,
  feeling: 0.66,
  cta: 0.92,
}

/**
 * Build the master timeline. Each `.to` is one beat, eased so motion within a beat is
 * non-linear even though ScrollTrigger linearizes scroll→time. The timeline's total duration
 * is 1, so timeline time == scroll fraction and beats land on their measured sections.
 */
export function createJourneyTimeline(beats: Beats = BEAT_FALLBACK): gsap.core.Timeline {
  const b = beats
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

  // p advances linearly the whole way for any code that wants raw progress.
  tl.to(journey, { p: 1, ease: 'none', duration: 1 }, 0)

  // ── Beat 2 · The pull: dragged into the cool, frantic feed-tunnel; chaos peaks. ──
  tl.to(journey, { chaos: 1, warmth: 0.08, gather: 0, cam: 0.33, duration: b.problem - b.hero }, b.hero)

  // ── Beat 3 · The detour: motion decelerates, the world warms, cards begin to organize. ──
  tl.to(journey, { chaos: 0.35, warmth: 0.55, gather: 0.45, cam: 0.5, duration: b.idea - b.problem }, b.problem)

  // ── Beat 4 · The menu: cards resolve into calm tier rows of tokens. The payoff. ──
  tl.to(journey, { chaos: 0, warmth: 0.92, gather: 1, cam: 0.72, duration: b.features - b.idea }, b.idea)

  // ── Beat 5 · Settle: golden-hour calm. The menu holds through Feeling… ──
  tl.to(journey, { warmth: 1, cam: 0.86, duration: b.feeling - b.features }, b.features)
  // …then "put the phone down": the menu dissolves into a few breathing warm motes by the CTA.
  tl.to(journey, { settle: 1, cam: 1, duration: b.cta - b.feeling }, b.feeling)

  return tl
}
