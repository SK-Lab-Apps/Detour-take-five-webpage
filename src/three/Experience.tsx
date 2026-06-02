import { Suspense, lazy } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { useDeviceProfile } from '@/lib/useDeviceTier'

// Heavy 3D runtime is split into its own chunk and only fetched when we actually render it.
const Canvas3D = lazy(() => import('./Canvas3D'))

/**
 * Experience — the fixed, full-viewport backdrop behind all content.
 *
 * • prefers-reduced-motion → a calm, fully static warm gradient (no WebGL at all).
 *   The story is still told by the 2D sections layered on top.
 * • otherwise → the persistent 3D canvas.
 */
export function Experience() {
  const reduced = useReducedMotion()
  const profile = useDeviceProfile()

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ contain: 'strict' }}
    >
      {reduced ? (
        <StaticBackdrop />
      ) : (
        <Suspense fallback={<StaticBackdrop />}>
          <Canvas3D profile={profile} />
        </Suspense>
      )}
    </div>
  )
}

/** The reduced-motion / loading backdrop: a warm paper gradient with a soft terracotta glow. */
function StaticBackdrop() {
  return (
    <div className="absolute inset-0 bg-paper">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 38%, rgba(210,100,58,0.10), rgba(210,100,58,0) 70%),' +
            'radial-gradient(80% 60% at 80% 90%, rgba(201,154,43,0.10), rgba(201,154,43,0) 70%),' +
            'linear-gradient(180deg, #faf4e8 0%, #f3ecda 100%)',
        }}
      />
    </div>
  )
}
