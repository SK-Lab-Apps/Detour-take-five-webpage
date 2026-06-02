/**
 * DeviceFrame — a tasteful iPhone-style frame around an app screenshot.
 * Drop new screenshots in /public/screens and pass the src.
 */
export function DeviceFrame({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={'relative mx-auto w-full max-w-[280px] ' + className}>
      <div
        className="relative rounded-[2.6rem] border border-hair-strong bg-ink p-2.5 shadow-[0_40px_90px_-30px_rgba(42,31,24,0.55)]"
        style={{ aspectRatio: '1206 / 2622' }}
      >
        {/* screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.05rem] bg-paper">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
          />
          {/* dynamic island */}
          <div className="pointer-events-none absolute left-1/2 top-2 h-[1.05rem] w-[34%] -translate-x-1/2 rounded-full bg-ink" />
          {/* subtle screen sheen */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[2.05rem]"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 38%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
