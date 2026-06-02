import { useMemo } from 'react'

export type DeviceTier = 'high' | 'low'

export interface DeviceProfile {
  tier: DeviceTier
  isMobile: boolean
  isTouch: boolean
  /** Capped device pixel ratio — keeps the GPU honest on retina/4k. */
  dpr: [number, number]
  /** Particle budget for the 3D field. */
  particleCount: number
  /** Whether to run post-processing (bloom / DOF). */
  postprocessing: boolean
}

function detect(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { tier: 'high', isMobile: false, isTouch: false, dpr: [1, 1.75], particleCount: 1400, postprocessing: true }
  }

  const ua = navigator.userAgent || ''
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Silk/i.test(ua)
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const cores = navigator.hardwareConcurrency ?? 4
  // deviceMemory is non-standard but widely available on Chrome/Android.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const smallViewport = Math.min(window.innerWidth, window.innerHeight) < 640

  const low = isMobile || smallViewport || cores <= 4 || mem <= 4

  if (low) {
    return {
      tier: 'low',
      isMobile,
      isTouch,
      dpr: [1, 1.5],
      particleCount: isMobile ? 520 : 800,
      postprocessing: false,
    }
  }

  return {
    tier: 'high',
    isMobile,
    isTouch,
    dpr: [1, Math.min(window.devicePixelRatio || 1, 2)],
    particleCount: 1600,
    postprocessing: true,
  }
}

/** Static device capability profile (evaluated once). */
export function useDeviceProfile(): DeviceProfile {
  return useMemo(detect, [])
}
