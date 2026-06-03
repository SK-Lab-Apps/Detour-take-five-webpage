import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * Preloader — masks font/3D-chunk loading and sets the tone. A warm paper panel with the
 * folded-menu-clock mark; lifts away like a menu being opened once things are ready.
 */
export function Preloader() {
  const reduced = useReducedMotion()
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const minMs = reduced ? 150 : 800
    // hard cap: the preloader ALWAYS lifts, even if fonts.ready never resolves.
    const maxMs = reduced ? 400 : 2400

    let fontsReady = false
    if ('fonts' in document) document.fonts.ready.then(() => (fontsReady = true))
    else fontsReady = true

    // lock scroll while loading
    document.documentElement.classList.add('lenis-stopped')
    document.body.style.overflow = 'hidden'

    // Absolute guarantee the loader lifts, independent of rAF/fonts timing.
    const hardStop = window.setTimeout(() => {
      setProgress(100)
      setDone(true)
    }, maxMs + 120)

    const tick = (now: number) => {
      const elapsed = now - start
      const ready = (fontsReady && elapsed >= minMs) || elapsed >= maxMs
      const ceil = ready ? 100 : 92
      setProgress((p) => Math.min(ceil, p + (ceil - p) * 0.08 + 0.7))
      if (ready) {
        setProgress(100)
        setTimeout(() => setDone(true), 160)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(hardStop)
    }
  }, [reduced])

  // Release the scroll lock once loading is done. The overlay animates away but this
  // component stays mounted, so the unlock must react to `done` — not the effect cleanup.
  // The cleanup also covers unmount (e.g. navigating away mid-load) so the lock can't leak.
  useEffect(() => {
    const unlock = () => {
      document.documentElement.classList.remove('lenis-stopped')
      document.body.style.overflow = ''
    }
    if (done) unlock()
    return unlock
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%' }}
          transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            src="/brand/app-icon.png"
            alt="Detour"
            width={72}
            height={72}
            className="h-18 w-18 rounded-2xl border border-hair shadow-paper"
            initial={reduced ? {} : { opacity: 0, scale: 0.9 }}
            animate={reduced ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <p className="mt-6 eyebrow text-ink-muted">Setting the table</p>
          <div className="mt-4 h-px w-40 overflow-hidden bg-hair">
            <div
              className="h-full bg-terracotta transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
