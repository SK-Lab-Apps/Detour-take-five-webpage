import { site } from '@/content/site'
import { Section, Eyebrow } from '@/components/primitives'
import { Reveal } from '@/components/Reveal'

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={i < n ? 'fill-mustard' : 'fill-hair-strong'}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function Social() {
  const { social } = site
  return (
    <Section id="loved" full={false} className="py-28 sm:py-32">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Reveal>
          <Eyebrow>{social.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="mt-5 font-display text-[clamp(1.9rem,5vw,3.2rem)] font-light tracking-[-0.03em] text-ink">
          {social.title}
        </h2>
        <Reveal delay={0.08}>
          <div className="mt-5 flex items-center justify-center gap-3 text-sm text-ink-soft">
            <Stars n={social.rating.stars} />
            <span className="font-display text-base text-ink">{social.rating.score}</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">{social.rating.count}</span>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {social.testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <figure className="card-paper flex h-full flex-col p-7">
              <Stars n={5} />
              <blockquote className="mt-4 flex-1 text-pretty text-[1.02rem] leading-relaxed text-ink">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 border-t border-hair pt-4">
                <span className="font-display text-ink">{t.name}</span>
                <span className="ml-2 text-xs uppercase tracking-[0.12em] text-ink-muted">
                  {t.meta}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      {/* press / as-seen-in — placeholders */}
      <Reveal delay={0.1}>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center opacity-70">
          {social.press.map((p) => (
            <span key={p} className="font-display text-sm italic text-ink-muted">
              {p}
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
