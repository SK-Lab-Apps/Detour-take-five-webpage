import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { site } from '@/content/site'
import { LEGAL, legalDocs, type LegalDoc } from '@/content/legal'
import { Footer } from '@/components/sections/Footer'

const isPlaceholder = (url: string) => !url || url.startsWith('{{')

/** A clean, fast, static legal page (no 3D) — Terms of Service / Privacy Policy. */
export default function Legal({ slug }: { slug: 'terms' | 'privacy' }) {
  const doc: LegalDoc = legalDocs[slug]

  // Per-page SEO + scroll reset (client-side route).
  useEffect(() => {
    window.scrollTo(0, 0)
    const prevTitle = document.title
    document.title = `${doc.title} · ${site.fullName}`
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? ''
    meta?.setAttribute('content', `${doc.title} for ${site.fullName}. ${doc.intro}`)
    return () => {
      document.title = prevTitle
      meta?.setAttribute('content', prevDesc)
    }
  }, [doc])

  return (
    <div className="relative min-h-screen bg-paper">
      {/* soft static warm wash (no canvas on legal pages) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(55% 40% at 50% 0%, rgba(210,100,58,0.07), rgba(210,100,58,0) 70%),' +
            'linear-gradient(180deg, #faf4e8 0%, #f3ecda 100%)',
        }}
      />

      <LegalHeader />

      <main className="mx-auto w-full max-w-3xl px-6 pb-24 pt-28 sm:px-10">
        <p className="eyebrow">{site.fullName}</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.5rem)] font-light tracking-[-0.03em] text-ink">
          {doc.title}
        </h1>
        <p className="mt-3 text-sm text-ink-muted">Last updated: {LEGAL.lastUpdated}</p>

        <p className="mt-8 text-pretty text-lg leading-relaxed text-ink-soft">{doc.intro}</p>

        <div className="mt-10 space-y-10">
          {doc.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="font-display text-xl text-ink sm:text-2xl">{section.heading}</h2>
              )}
              <div className="mt-3 space-y-4">
                {section.blocks.map((block, j) => {
                  if ('p' in block)
                    return (
                      <p key={j} className="text-pretty leading-relaxed text-ink-soft">
                        {block.p}
                      </p>
                    )
                  if ('list' in block)
                    return (
                      <ul key={j} className="space-y-2 pl-1">
                        {block.list.map((item, k) => (
                          <li key={k} className="flex gap-3 text-ink-soft">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  return (
                    <a
                      key={j}
                      href={`mailto:${block.email}`}
                      className="inline-block font-display text-lg text-terracotta-deep underline decoration-terracotta/40 underline-offset-4 transition-colors hover:text-terracotta"
                    >
                      {block.email}
                    </a>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* cross-link to the sibling document */}
        <div className="mt-16 border-t border-hair pt-8">
          <Link
            to={slug === 'terms' ? '/privacy' : '/terms'}
            className="font-display text-lg text-ink underline decoration-hair-strong underline-offset-4 transition-colors hover:text-terracotta"
          >
            {slug === 'terms' ? 'Read our Privacy Policy →' : 'Read our Terms of Service →'}
          </Link>
        </div>
      </main>

      <Footer />
      <div className="grain" aria-hidden="true" />
    </div>
  )
}

function LegalHeader() {
  const appStore = site.links.appStore
  const placeholder = isPlaceholder(appStore)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hair bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3.5 sm:px-10">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Back to Detour home">
          <img src="/brand/app-icon.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg border border-hair" />
          <span className="font-display text-lg tracking-tight text-ink">Detour</span>
        </Link>
        {placeholder ? (
          <Link to="/" className="text-sm text-ink-soft transition-colors hover:text-terracotta">
            ← Back to home
          </Link>
        ) : (
          <a
            href={appStore}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
          >
            {site.hero.cta}
          </a>
        )}
      </div>
    </header>
  )
}
