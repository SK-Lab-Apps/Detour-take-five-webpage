import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createJourneyTimeline, BEAT_FALLBACK, pointer, type Beats } from '@/three/journey'
import { useReducedMotion } from './useReducedMotion'

/**
 * Measure each narrative section's top as a fraction of total scroll, so the 3D beats land on
 * their real sections regardless of section height. Falls back to fixed fractions if the DOM
 * isn't ready (e.g. before first layout).
 */
function measureBeats(): Beats {
  const total = document.documentElement.scrollHeight - window.innerHeight
  if (total <= 0) return BEAT_FALLBACK
  const frac = (sel: string, fallback: number) => {
    const el = document.querySelector<HTMLElement>(sel)
    if (!el) return fallback
    const top = el.getBoundingClientRect().top + window.scrollY
    return Math.min(1, Math.max(0, top / total))
  }
  return {
    hero: 0,
    problem: frac('[data-section="problem"]', BEAT_FALLBACK.problem),
    idea: frac('[data-section="idea"]', BEAT_FALLBACK.idea),
    features: frac('[data-section="features"]', BEAT_FALLBACK.features),
    feeling: frac('[data-section="feeling"]', BEAT_FALLBACK.feeling),
    cta: frac('[data-section="cta"]', BEAT_FALLBACK.cta),
  }
}

gsap.registerPlugin(ScrollTrigger)

/**
 * ScrollProvider wires the whole scroll system together, once:
 *   • Lenis for buttery smooth scroll (skipped under prefers-reduced-motion)
 *   • GSAP ticker drives Lenis so ScrollTrigger and Lenis share one clock
 *   • a page-length ScrollTrigger scrubs the master journey timeline (drives the 3D)
 *   • a smoothed global pointer for parallax
 *
 * It renders its children unchanged — all effects, no layout.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    let lenis: Lenis | null = null
    const tickerFn = (time: number) => lenis?.raf(time * 1000)

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)
      document.documentElement.classList.add('lenis', 'lenis-smooth')
    }

    // Master timeline scrubbed by overall page scroll → drives `journey`. Beats are anchored
    // to the real section offsets, so it's rebuilt whenever layout (and thus those offsets) change.
    let tl: gsap.core.Timeline | null = null
    let st: ScrollTrigger | null = null
    const build = () => {
      st?.kill()
      tl?.kill()
      tl = createJourneyTimeline(measureBeats())
      st = ScrollTrigger.create({
        animation: tl,
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: reduced ? true : 1, // a touch of lag = silk; instant for reduced motion
        invalidateOnRefresh: true,
      })
    }
    build()

    // Keep beats + ScrollTrigger honest as fonts/images/viewport change layout height.
    const refresh = () => {
      build()
      ScrollTrigger.refresh()
    }
    window.addEventListener('load', refresh)
    const ro = new ResizeObserver(refresh)
    ro.observe(document.body)

    return () => {
      window.removeEventListener('load', refresh)
      ro.disconnect()
      st?.kill()
      tl?.kill()
      if (lenis) {
        gsap.ticker.remove(tickerFn)
        lenis.destroy()
        document.documentElement.classList.remove('lenis', 'lenis-smooth')
      }
    }
  }, [reduced])

  // Smoothed global pointer for 3D parallax (cheap; no React state churn).
  useEffect(() => {
    if (reduced) return
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  return <>{children}</>
}
