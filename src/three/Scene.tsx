import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Particles } from './Particles'
import { journey, pointer } from './journey'

// Camera keyframes along the journey (cam 0..1). Off-axis during the problem to feel
// unsettled; centred and calm by the end.
const CAM_STOPS: { at: number; pos: [number, number, number] }[] = [
  { at: 0.0, pos: [0.0, 0.25, 12.2] }, // hero — far, calm
  { at: 0.2, pos: [0.4, -0.2, 5.2] }, //  problem — dive INTO the tunnel
  { at: 0.4, pos: [-0.35, 0.12, 9.2] }, // idea — pull out as the light ignites
  { at: 0.6, pos: [0.0, 0.05, 9.2] }, //  features
  { at: 0.82, pos: [0.0, 0.2, 10.8] }, // feeling — begin the pull-back
  { at: 1.0, pos: [0.0, 0.45, 13.8] }, //  cta — pull back to reveal the whole galaxy
]

function sampleCam(t: number, out: THREE.Vector3) {
  const s = CAM_STOPS
  if (t <= s[0].at) return void out.set(...s[0].pos)
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[i]
    const b = s[i + 1]
    if (t <= b.at) {
      const k = (t - a.at) / (b.at - a.at)
      const e = k * k * (3 - 2 * k)
      return void out.set(
        THREE.MathUtils.lerp(a.pos[0], b.pos[0], e),
        THREE.MathUtils.lerp(a.pos[1], b.pos[1], e),
        THREE.MathUtils.lerp(a.pos[2], b.pos[2], e),
      )
    }
  }
  out.set(...s[s.length - 1].pos)
}

// Warm / cool grades for the graded backdrop.
const GRADE = {
  warmTop: new THREE.Color('#f7edd8'),
  warmBottom: new THREE.Color('#ecd3a9'),
  warmGlow: new THREE.Color('#f7c79a'),
  coolTop: new THREE.Color('#dde2e6'),
  coolBottom: new THREE.Color('#bfc7cf'),
  coolGlow: new THREE.Color('#9fb0bd'),
}

/** A camera-filling gradient backdrop with a soft central glow + vignette → depth, not flat. */
function Backdrop() {
  const ref = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const fwd = useMemo(() => new THREE.Vector3(), [])

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthTest: false,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: GRADE.warmTop.clone() },
          uBottom: { value: GRADE.warmBottom.clone() },
          uGlow: { value: GRADE.warmGlow.clone() },
          uGlowStrength: { value: 0.5 },
          uVignette: { value: 0.22 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          uniform vec3 uTop, uBottom, uGlow;
          uniform float uGlowStrength, uVignette;
          void main(){
            vec3 col = mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y));
            float d = distance(vUv, vec2(0.5, 0.58));
            col += uGlow * uGlowStrength * smoothstep(0.62, 0.0, d);
            col *= 1.0 - uVignette * smoothstep(0.28, 0.92, distance(vUv, vec2(0.5)));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    const cam = camera as THREE.PerspectiveCamera
    const dist = 26
    cam.getWorldDirection(fwd)
    m.position.copy(cam.position).addScaledVector(fwd, dist)
    m.quaternion.copy(cam.quaternion)
    const vh = 2 * dist * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    m.scale.set(vh * cam.aspect, vh, 1)

    // grade cool → warm
    const w = journey.warmth
    const k = 1 - Math.pow(0.002, dt)
    const u = mat.uniforms
    ;(u.uTop.value as THREE.Color).lerp(
      GRADE.coolTop.clone().lerp(GRADE.warmTop, w),
      k,
    )
    ;(u.uBottom.value as THREE.Color).lerp(GRADE.coolBottom.clone().lerp(GRADE.warmBottom, w), k)
    ;(u.uGlow.value as THREE.Color).lerp(GRADE.coolGlow.clone().lerp(GRADE.warmGlow, w), k)
    u.uGlowStrength.value += (0.2 + 0.34 * journey.gather * w - u.uGlowStrength.value) * k
    u.uVignette.value += ((0.42 - 0.22 * w) - u.uVignette.value) * k
  })

  return (
    <mesh ref={ref} material={mat} renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

/** A soft warm light that swells behind the galaxy as the world warms + assembles. */
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
        uniforms: { uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#f8c89a') } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv; uniform float uOpacity; uniform vec3 uColor;
          void main(){
            float d = distance(vUv, vec2(0.5));
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor, a*a*uOpacity);
          }
        `,
      }),
    [],
  )

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.quaternion.copy(camera.quaternion)
    const k = 1 - Math.pow(0.002, dt)
    // "ignition": a warm light is born once warmth crosses out of the cold storm
    const ignite = THREE.MathUtils.clamp((journey.warmth - 0.2) * 1.5, 0, 1)
    const target = ignite * (0.32 + 0.4 * journey.gather) * 0.46
    const o = mat.uniforms.uOpacity
    o.value += (target - o.value) * k
    // grows from a small spark to a vast halo as the galaxy assembles
    const s = 0.42 + 1.45 * journey.gather + 0.18 * ignite
    const cur = ref.current.scale.x
    ref.current.scale.setScalar(cur + (s - cur) * k)
  })

  return (
    <mesh ref={ref} position={[0, 0, -1]} material={mat} renderOrder={-5} scale={0.42}>
      <planeGeometry args={[11, 8]} />
    </mesh>
  )
}

export function Scene({ count }: { count: number }) {
  const { camera, gl } = useThree()
  const camTarget = useRef(new THREE.Vector3())
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0))
  const bg = useMemo(() => new THREE.Color(), [])

  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.0015, dt)

    // clear colour matches the backdrop's warm bottom so any edge is seamless
    bg.copy(GRADE.coolBottom).lerp(GRADE.warmBottom, journey.warmth)
    gl.setClearColor(bg, 1)

    sampleCam(journey.cam, camTarget.current)
    camTarget.current.x += pointer.x * 0.55
    camTarget.current.y += -pointer.y * 0.34
    camera.position.lerp(camTarget.current, k)

    lookTarget.current.set(pointer.x * 0.3, -pointer.y * 0.2 + 0.05, 0)
    camera.lookAt(lookTarget.current)

    // a slow, disorienting roll while we're inside the cold storm
    const roll = journey.chaos * (0.09 + 0.05 * Math.sin(state.clock.elapsedTime * 0.5))
    camera.rotateZ(roll)
  })

  return (
    <>
      <Backdrop />
      <WarmGlow />
      <Particles count={count} />
    </>
  )
}
