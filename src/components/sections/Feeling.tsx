import { site } from '@/content/site'
import { Section, Eyebrow } from '@/components/primitives'
import { Reveal, RevealText } from '@/components/Reveal'

export function Feeling() {
  const { feeling } = site
  return (
    <Section id="feeling">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <Eyebrow>{feeling.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="mt-5 font-display text-[clamp(2rem,6vw,4rem)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          <RevealText text={feeling.title} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            {feeling.body}
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-3 gap-6">
          {feeling.stats.map((s, i) => (
            <Reveal key={s.label} delay={0.1 + i * 0.08}>
              <div>
                <div className="font-display text-[clamp(1.8rem,5vw,3rem)] font-light text-terracotta">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
