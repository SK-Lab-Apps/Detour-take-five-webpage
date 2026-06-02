import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Scene } from './Scene'
import type { DeviceProfile } from '@/lib/useDeviceTier'

/**
 * The persistent WebGL canvas. One <Canvas> for the entire page; the DOM content scrolls
 * over it. Lazy-loaded (see Experience) so Three.js never blocks first paint.
 */
export default function Canvas3D({ profile }: { profile: DeviceProfile }) {
  // Pause the render loop entirely when the tab is hidden — saves battery/GPU.
  const [active, setActive] = useState(true)
  useEffect(() => {
    const onVis = () => setActive(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={profile.dpr}
      gl={{
        antialias: profile.tier === 'high',
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 38, near: 0.1, far: 100, position: [0, 0.25, 11.5] }}
    >
      <Scene count={profile.particleCount} />

      {profile.postprocessing && (
        <EffectComposer multisampling={0}>
          {/* gentle warm glow — threshold above paper luminance so only the warm
              light (and brightest token cores) bloom, never the paper background */}
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.7}
          />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}

      <AdaptiveDpr pixelated={false} />
      <Preload all />
    </Canvas>
  )
}
