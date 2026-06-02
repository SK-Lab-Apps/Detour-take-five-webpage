import { site } from '@/content/site'
import { Section, Eyebrow, PullQuote } from '@/components/primitives'
import { Reveal, RevealText } from '@/components/Reveal'

export function Idea() {
  const { idea } = site
  return (
    <Section id="idea">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow>{idea.eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.6rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
            <RevealText text={idea.title} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-pretty text-lg leading-relaxed text-ink-soft">
              {idea.body}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="lg:pl-6">
            <PullQuote foot={idea.foot}>{idea.pull}</PullQuote>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
