import { site } from '@/content/site'
import { Section, Eyebrow } from '@/components/primitives'
import { Reveal, RevealText } from '@/components/Reveal'

export function Problem() {
  const { problem } = site
  return (
    <Section id="problem">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>{problem.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="mt-5 font-display text-[clamp(2rem,6vw,4rem)] font-light leading-[1.02] tracking-[-0.03em] text-ink">
          <RevealText text={problem.title} />
        </h2>
        <Reveal delay={0.1}>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ink-soft">
            {problem.body}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <p className="mt-10 font-display text-xl italic text-ink-soft sm:text-2xl">
            {problem.pull}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
