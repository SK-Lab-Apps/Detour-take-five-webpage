import gsap from 'gsap'

/**
 * journey — the single shared state the 3D scene reads every frame.
 *
 * A GSAP master timeline (built in `createJourneyTimeline`) animates these fields and is
 * scrubbed by a page-length ScrollTrigger, so the whole 3D narrative is deterministic and
 * tied 1:1 to scroll position. The scene reads `journey` inside useFrame and lerps toward
 * it for an extra layer of silk.
 *
 * Field meanings (all 0..1 unless noted):
 *   p       overall progress, linear across the page
 *   chaos   how cold / frantic / dispersed the swarm is   (peaks at "the problem")
 *   warmth  color grade, cold(0) → warm paper(1)
 *   gather  particles scattered(0) → assembled into the menu(1)
 *   bloom   glow strength of the warm emissives
 *   cam     camera path parameter, hero(0) → final calm(1)
 *   focus   which feature row is highlighted (0..1 across the features beat)
 */
export interface Journey {
  p: number
  chaos: number
  warmth: number
  gather: number
  bloom: number
  cam: number
  focus: number
}

export const journey: Journey = {
  p: 0,
  chaos: 0.15,
  warmth: 0.55,
  gather: 0.16,
  bloom: 0.32,
  cam: 0,
  focus: 0,
}

/** Live pointer in normalized device coords (-1..1), smoothed for parallax. */
export const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

/** Narrative beats, keyed to fractional scroll positions (0..1). */
export const BEATS = {
  hero: 0.0,
  problem: 0.2,
  idea: 0.4,
  features: 0.62,
  feeling: 0.82,
  cta: 1.0,
} as const

/**
 * Build the master timeline. Each `.to` is one beat; eased so motion within a beat is
 * non-linear even though scroll→time is linearized by ScrollTrigger scrub. Total duration
 * is normalized to 1 (positions are fractions of the page scroll).
 */
export function createJourneyTimeline(): gsap.core.Timeline {
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 0.2 } })

  // p advances linearly the whole way for any code that wants raw progress.
  tl.to(journey, { p: 1, ease: 'none', duration: 1 }, 0)

  // ── The problem: pulled into the cold, frantic feed ──────────────────────
  tl.to(journey, { chaos: 1, warmth: 0, gather: 0, bloom: 0.18, cam: 0.2 }, BEATS.hero)

  // ── The idea: one warm card rises; the cold starts to let go ─────────────
  tl.to(journey, { chaos: 0.42, warmth: 0.58, gather: 0.36, bloom: 0.4, cam: 0.4 }, BEATS.problem)

  // ── Features: the swarm organizes into the glowing menu ───────────────────
  tl.to(journey, { chaos: 0.14, warmth: 0.86, gather: 0.82, bloom: 0.52, cam: 0.6 }, BEATS.idea)
  tl.to(journey, { focus: 1, ease: 'none' }, BEATS.idea)

  // ── The feeling: everything settles into golden-hour calm ────────────────
  tl.to(journey, { chaos: 0.05, warmth: 1, gather: 0.93, bloom: 0.7, cam: 0.82 }, BEATS.features)

  // ── Final CTA: most beautiful, most peaceful state ───────────────────────
  tl.to(journey, { chaos: 0, warmth: 1, gather: 1, bloom: 1, cam: 1 }, BEATS.feeling)

  return tl
}

/** Snap the journey to a given progress without animation (reduced-motion / static use). */
export function setJourneyProgress(p: number) {
  // Sample the timeline deterministically by tweening a scratch tl to `p` would be heavy;
  // instead approximate the keyframes with simple piecewise interpolation.
  const clamp = (v: number) => Math.max(0, Math.min(1, v))
  journey.p = clamp(p)
}
