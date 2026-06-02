import { useEffect, useState } from 'react'
import { site } from '@/content/site'

const isPlaceholder = (url: string) => !url || url.startsWith('{{')

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const appStore = site.links.appStore
  const ctaProps = isPlaceholder(appStore)
    ? ({ as: 'button', title: 'Add your store link in src/content/site.ts' } as const)
    : ({ as: 'a', href: appStore, target: '_blank', rel: 'noopener noreferrer' } as const)

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ' +
        (scrolled ? 'border-b border-hair bg-paper/70 backdrop-blur-md' : 'border-b border-transparent')
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <a href="#hero" className="flex items-center gap-2.5" aria-label="Detour — back to top">
          <img src="/brand/app-icon.png" alt="" width={32} height={32} className="h-8 w-8 rounded-lg border border-hair" />
          <span className="font-display text-lg tracking-tight text-ink">Detour</span>
        </a>

        {ctaProps.as === 'a' ? (
          <a
            href={ctaProps.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
          >
            {site.hero.cta}
          </a>
        ) : (
          <button
            type="button"
            title={ctaProps.title}
            className="cursor-not-allowed rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper opacity-90"
          >
            {site.hero.cta}
          </button>
        )}
      </div>
    </header>
  )
}
