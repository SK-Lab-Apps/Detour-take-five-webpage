import { site } from '@/content/site'

export function Footer() {
  const { footer, links } = site
  const year = new Date().getFullYear()
  const secondary = (
    [
      ['Support', links.support],
      ['Privacy', links.privacy],
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

        {secondary.length > 0 && (
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            {secondary.map((l) => (
              <a key={l.label} href={l.href} className="transition-colors hover:text-terracotta">
                {l.label}
              </a>
            ))}
          </nav>
        )}

        <div className="text-xs text-ink-muted">
          © {year} {footer.legal}
        </div>
      </div>
    </footer>
  )
}
