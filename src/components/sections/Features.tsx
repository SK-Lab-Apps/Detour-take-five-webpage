import { site } from '@/content/site'
import { Section, Eyebrow } from '@/components/primitives'
import { Reveal, RevealText } from '@/components/Reveal'
import { DeviceFrame } from '@/components/DeviceFrame'

const tierText: Record<string, string> = {
  mustard: 'text-mustard',
  forest: 'text-forest',
  plum: 'text-plum',
}
const tierBorder: Record<string, string> = {
  mustard: 'border-t-mustard',
  forest: 'border-t-forest',
  plum: 'border-t-plum',
}

export function Features() {
  const { features, tiers } = site
  return (
    <Section id="features" full={false} className="py-28 sm:py-36">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <Reveal>
          <Eyebrow>{features.eyebrow}</Eyebrow>
        </Reveal>
        <h2 className="mt-5 font-display text-[clamp(2rem,5.5vw,3.6rem)] font-light leading-[1.04] tracking-[-0.03em] text-ink">
          <RevealText text={features.title} />
        </h2>
      </div>

      {/* The menu + the app, side by side */}
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="order-2 grid gap-4 lg:order-1">
          {tiers.map((tier, i) => (
            <Reveal key={tier.key} delay={i * 0.08}>
              <div className={'card-paper border-t-4 p-6 ' + tierBorder[tier.color]}>
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className={'font-display text-2xl ' + tierText[tier.color]}>{tier.label}</h3>
                  <span className="text-xs uppercase tracking-[0.12em] text-ink-muted">
                    {tier.blurb}
                  </span>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {tier.examples.map((ex) => (
                    <li key={ex} className="flex items-baseline font-display text-[0.98rem] text-ink">
                      <span>{ex}</span>
                      <span className="leader" />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="order-1 lg:order-2">
          <DeviceFrame src="/screens/today-menu.png" alt="Instead — Today's Menu screen" />
        </Reveal>
      </div>

      {/* Feature grid */}
      <div className="mt-24 grid gap-px overflow-hidden rounded-card border border-hair bg-hair sm:grid-cols-2 lg:grid-cols-3">
        {features.items.map((f, i) => (
          <Reveal key={f.key} delay={(i % 3) * 0.06}>
            <div className="group h-full bg-card p-7 transition-colors duration-300 hover:bg-cream">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-terracotta">{String(i + 1).padStart(2, '0')}</span>
                <span className="h-px flex-1 bg-hair" />
              </div>
              <h3 className="mt-4 font-display text-xl text-ink">{f.title}</h3>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
