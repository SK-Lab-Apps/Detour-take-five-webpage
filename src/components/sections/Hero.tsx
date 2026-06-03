import { motion } from 'framer-motion'
import { site } from '@/content/site'
import { StoreBadges } from '@/components/StoreBadges'
import { useReducedMotion } from '@/lib/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const reduced = useReducedMotion()
  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease: EASE, delay },
        }

  return (
    <section
      id="hero"
      data-section="hero"
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <div className="text-haze flex flex-col items-center">
      <motion.div {...fade(0.1)} className="mb-7">
        <img
          src="/brand/app-icon.png"
          alt="Detour app icon — a folded menu with a clock at five to twelve"
          width={88}
          height={88}
          className="h-20 w-20 rounded-[1.25rem] border border-hair shadow-paper sm:h-22 sm:w-22"
          style={{ boxShadow: 'var(--shadow-paper)' }}
        />
      </motion.div>

      <motion.div {...fade(0.2)} className="flex items-center gap-3">
        <span className="h-px w-8 bg-hair-strong" />
        <span className="eyebrow">{site.hero.eyebrow}</span>
        <span className="h-px w-8 bg-hair-strong" />
      </motion.div>

      <motion.h1
        {...fade(0.28)}
        className="mt-4 font-display text-[clamp(3.5rem,16vw,9rem)] font-light leading-[0.92] tracking-[-0.04em] text-ink"
      >
        {site.hero.title}
      </motion.h1>

      <motion.p {...fade(0.4)} className="eyebrow mt-2 text-ink-muted">
        {site.hero.sub}
      </motion.p>

      <motion.p
        {...fade(0.5)}
        className="mt-7 max-w-md text-balance text-lg leading-relaxed text-ink-soft sm:text-xl"
      >
        {site.hero.line}
      </motion.p>

      <motion.div {...fade(0.62)} className="mt-9">
        <StoreBadges className="justify-center" />
      </motion.div>
      </div>

      {/* scroll hint */}
      <motion.div
        {...fade(0.9)}
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-ink-muted">
          <span className="text-[0.65rem] uppercase tracking-[0.3em]">{site.hero.scrollHint}</span>
          <motion.span
            aria-hidden="true"
            className="block h-9 w-px bg-gradient-to-b from-ink-muted to-transparent"
            animate={reduced ? {} : { scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
