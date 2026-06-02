import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Particles } from './Particles'
import { journey, pointer } from './journey'
import { C } from './colors'

// Camera keyframes along the journey (cam 0..1). Off-axis during the problem to feel
// unsettled; centered and calm by the end.
const CAM_STOPS: { at: number; pos: [number, number, number] }[] = [
  { at: 0.0, pos: [0.0, 0.2, 11.6] },
  { at: 0.2, pos: [0.8, -0.3, 8.4] },
  { at: 0.4, pos: [-0.5, 0.1, 9.8] },
  { at: 0.6, pos: [0.0, 0.0, 9.0] },
  { at: 0.82, pos: [0.0, 0.15, 9.8] },
  { at: 1.0, pos: [0.0, 0.3, 10.6] },
]

function sampleCam(t: number, out: THREE.Vector3) {
  const stops = CAM_STOPS
  if (t <= stops[0].at) return void out.set(...stops[0].pos)
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    if (t <= b.at) {
      const k = (t - a.at) / (b.at - a.at)
      const e = k * k * (3 - 2 * k) // smoothstep
      return void out.set(
        THREE.MathUtils.lerp(a.pos[0], b.pos[0], e),
        THREE.MathUtils.lerp(a.pos[1], b.pos[1], e),
        THREE.MathUtils.lerp(a.pos[2], b.pos[2], e),
      )
    }
  }
  out.set(...stops[stops.length - 1].pos)
}

/** A soft, warm radial light that swells as the world warms and the menu assembles. */
function WarmGlow() {
  const ref = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color('#ffd49a') },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform float uOpacity;
          uniform vec3 uColor;
          void main(){
            float d = distance(vUv, vec2(0.5));
            float a = smoothstep(0.5, 0.02, d);
            gl_FragColor = vec4(uColor, a * a * uOpacity);
          }
        `,
      }),
    [],
  )

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.quaternion.copy(camera.quaternion) // billboard
    const target = THREE.MathUtils.clamp(journey.warmth * (0.18 + 0.62 * journey.gather), 0, 1) * 0.85
    const o = mat.uniforms.uOpacity
    o.value += (target - o.value) * (1 - Math.pow(0.002, dt))
  })

  return (
    <mesh ref={ref} position={[0, 0, -1.5]} material={mat}>
      <planeGeometry args={[20, 13]} />
    </mesh>
  )
}

export function Scene({ count }: { count: number }) {
  const { camera, scene, gl } = useThree()
  const camTarget = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0))
  const bg = useMemo(() => new THREE.Color(), [])

  useMemo(() => {
    scene.fog = new THREE.Fog(C.paper.getHex(), 10, 30)
  }, [scene])

  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0015, dt)

    // Background grade: cool greige during chaos → warm paper when calm.
    bg.copy(C.cool).lerp(C.paper, journey.warmth)
    gl.setClearColor(bg, 1)
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(bg)

    // Camera dolly along the path + gentle pointer parallax.
    sampleCam(journey.cam, camTarget.current)
    camTarget.current.x += pointer.x * 0.5
    camTarget.current.y += -pointer.y * 0.32
    camera.position.lerp(camTarget.current, k)

    lookTarget.current.set(pointer.x * 0.28, -pointer.y * 0.18 + 0.05, 0)
    camera.lookAt(lookTarget.current)
  })

  return (
    <>
      <WarmGlow />
      <Particles count={count} />
    </>
  )
}
