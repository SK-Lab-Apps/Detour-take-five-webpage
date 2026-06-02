import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createJourneyTimeline, pointer } from '@/three/journey'
import { useReducedMotion } from './useReducedMotion'

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

    // Master timeline scrubbed by overall page scroll → drives `journey`.
    const tl = createJourneyTimeline()
    const st = ScrollTrigger.create({
      animation: tl,
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: reduced ? true : 1, // a touch of lag = silk; instant for reduced motion
      invalidateOnRefresh: true,
    })

    // Keep ScrollTrigger honest as fonts/images change layout height.
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(document.body)

    return () => {
      window.removeEventListener('load', onLoad)
      ro.disconnect()
      st.kill()
      tl.kill()
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
