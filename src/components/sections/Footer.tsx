import { Link } from 'react-router-dom'
import { site } from '@/content/site'

export function Footer() {
  const { footer, links } = site
  const year = new Date().getFullYear()

  // Optional external links (set in site.ts). Internal legal pages are always shown.
  const external = (
    [
      ['Support', links.support],
      ['Instagram', links.instagram],
    ] as const
  )
    .filter(([, href]) => href)
    .map(([label, href]) => ({ label, href: href as string }))

  return (
    <footer className="relative z-10 border-t border-hair bg-paper/60 px-6 py-12 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/brand/app-icon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-lg border border-hair" />
          <div className="leading-tight">
            <div className="font-display text-ink">{site.fullName}</div>
            <div className="text-xs italic text-ink-muted">{footer.tagline}</div>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link to="/terms" className="transition-colors hover:text-terracotta">
            Terms of Service
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-terracotta">
            Privacy Policy
          </Link>
          {external.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-terracotta"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="text-xs text-ink-muted">
          © {year} {footer.legal}
        </div>
      </div>
    </footer>
  )
}
