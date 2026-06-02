import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * A soft terracotta glow that trails the cursor — a quiet premium accent. The native
 * cursor is kept (accessibility); this only adds warmth. Disabled on touch + reduced motion.
 */
export function CursorGlow() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const el = ref.current
    if (!el) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0
    let visible = false
    let hovering = false

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      if (!visible) {
        visible = true
        el.style.opacity = '1'
      }
      const interactive = (e.target as Element)?.closest?.('a, button, [role="button"]')
      hovering = !!interactive
    }
    const onLeave = () => {
      visible = false
      el.style.opacity = '0'
    }

    const tick = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      const s = hovering ? 1.9 : 1
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${s})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerout', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onLeave)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70] h-10 w-10 rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background: 'radial-gradient(circle, rgba(210,100,58,0.34), rgba(210,100,58,0) 68%)',
        mixBlendMode: 'multiply',
        willChange: 'transform, opacity',
      }}
    />
  )
}
