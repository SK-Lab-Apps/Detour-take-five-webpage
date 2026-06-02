import type { ReactNode } from 'react'

/** Uppercase tracked label, the app's "eyebrow". */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={'eyebrow ' + className}>{children}</p>
}

/** A full-bleed narrative section. Content is centered with generous gutters. */
export function Section({
  id,
  children,
  className = '',
  full = true,
}: {
  id?: string
  children: ReactNode
  className?: string
  /** full = at least one screen tall (the immersive beats); false = auto height. */
  full?: boolean
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={
        'relative z-10 w-full px-6 sm:px-10 ' +
        (full ? 'flex min-h-[100svh] items-center py-24 sm:py-28 ' : 'py-20 ') +
        className
      }
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  )
}

/** Italic serif pull-quote with a terracotta rule, lifted from the app's quote style. */
export function PullQuote({ children, foot }: { children: ReactNode; foot?: string }) {
  return (
    <figure className="border-l-[3px] border-terracotta pl-6 sm:pl-8">
      <blockquote className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">
        <span className="mr-1 font-display text-3xl not-italic text-terracotta">“</span>
        {children}
      </blockquote>
      {foot && (
        <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-muted">
          {foot}
        </figcaption>
      )}
    </figure>
  )
}
