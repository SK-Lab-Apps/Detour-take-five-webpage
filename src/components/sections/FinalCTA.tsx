import { site } from '@/content/site'
import { Eyebrow } from '@/components/primitives'
import { Reveal, RevealText } from '@/components/Reveal'
import { StoreBadges } from '@/components/StoreBadges'

export function FinalCTA() {
  const { finalCta } = site
  return (
    <section
      id="get"
      data-section="cta"
      className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <Reveal>
        <img
          src="/brand/app-icon.png"
          alt="Detour app icon"
          width={80}
          height={80}
          className="mb-8 h-20 w-20 rounded-[1.25rem] border border-hair shadow-paper"
        />
      </Reveal>
      <Reveal delay={0.05}>
        <Eyebrow>{finalCta.eyebrow}</Eyebrow>
      </Reveal>
      <h2 className="mt-5 font-display text-[clamp(2.4rem,8vw,5.5rem)] font-light leading-[0.98] tracking-[-0.04em] text-ink">
        <RevealText text={finalCta.title} />
      </h2>
      <Reveal delay={0.12}>
        <p className="mt-6 max-w-md text-balance text-lg leading-relaxed text-ink-soft">
          {finalCta.body}
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-10">
          <StoreBadges className="justify-center" />
        </div>
      </Reveal>
      <Reveal delay={0.28}>
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-ink-muted">{finalCta.foot}</p>
      </Reveal>
    </section>
  )
}
