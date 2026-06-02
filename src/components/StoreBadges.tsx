import { site } from '@/content/site'

const isPlaceholder = (url: string) => !url || url.startsWith('{{')

function BadgeShell({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  const placeholder = isPlaceholder(href)
  const className =
    'group inline-flex items-center gap-3 rounded-xl bg-ink px-4 py-2.5 text-paper ' +
    'shadow-paper transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] ' +
    'hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(42,31,24,.5)] ' +
    'focus-visible:-translate-y-0.5 active:translate-y-0 will-change-transform'

  if (placeholder) {
    return (
      <button
        type="button"
        aria-label={`${label} — link coming soon`}
        title="Add your store link in src/content/site.ts"
        className={className + ' cursor-not-allowed opacity-90'}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </button>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  )
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" className="shrink-0 fill-paper">
      <path d="M17.05 12.04c-.03-3.16 2.58-4.67 2.7-4.75-1.47-2.15-3.76-2.45-4.57-2.48-1.94-.2-3.79 1.14-4.78 1.14-.98 0-2.5-1.11-4.11-1.08-2.11.03-4.06 1.23-5.15 3.12-2.2 3.81-.56 9.45 1.58 12.54 1.05 1.51 2.3 3.21 3.94 3.15 1.58-.06 2.18-1.02 4.09-1.02 1.9 0 2.45 1.02 4.12.99 1.7-.03 2.78-1.54 3.82-3.06 1.2-1.75 1.7-3.45 1.72-3.54-.04-.02-3.3-1.27-3.33-5.03zM14.13 4.34c.87-1.05 1.46-2.52 1.3-3.98-1.25.05-2.77.83-3.67 1.88-.81.93-1.51 2.42-1.32 3.85 1.39.11 2.81-.71 3.69-1.75z" />
    </svg>
  )
}

function GooglePlayLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="shrink-0">
      <path fill="#00D3FF" d="M3.6 1.4C3.3 1.7 3.1 2.1 3.1 2.7v18.6c0 .6.2 1 .5 1.3l.1.1 10.4-10.4v-.2L3.7 1.3l-.1.1z" />
      <path fill="#FFCE00" d="M18 16.1l-3.5-3.5v-.2L18 8.9l.1.1 4.1 2.3c1.2.7 1.2 1.8 0 2.5L18 16.1z" />
      <path fill="#FF3C4B" d="M18.1 16L14.5 12.4 3.6 23.3c.4.4 1 .5 1.8.1L18.1 16z" />
      <path fill="#00E676" d="M18.1 8.9L5.4.6C4.6.2 4 .3 3.6.7l10.9 10.9L18.1 8.9z" />
    </svg>
  )
}

export function AppStoreBadge() {
  return (
    <BadgeShell href={site.links.appStore} label="Download on the App Store">
      <AppleLogo />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[0.62rem] tracking-wide text-paper/80">Download on the</span>
        <span className="font-display text-lg leading-tight">App Store</span>
      </span>
    </BadgeShell>
  )
}

export function PlayStoreBadge() {
  return (
    <BadgeShell href={site.links.playStore} label="Get it on Google Play">
      <GooglePlayLogo />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[0.62rem] uppercase tracking-[0.18em] text-paper/80">Get it on</span>
        <span className="font-display text-lg leading-tight">Google Play</span>
      </span>
    </BadgeShell>
  )
}

/** Both badges, the standard download CTA used in hero / mid-page / footer. */
export function StoreBadges({ className = '' }: { className?: string }) {
  return (
    <div className={'flex flex-wrap items-center gap-3 ' + className}>
      <AppStoreBadge />
      <PlayStoreBadge />
    </div>
  )
}
