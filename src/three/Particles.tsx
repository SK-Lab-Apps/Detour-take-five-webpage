import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { journey, pointer } from './journey'
import { C, TIER_COLORS } from './colors'

/**
 * Particles — the single morphing object that carries the whole story.
 *
 * Three target states, blended by `journey`:
 *   drift  (calm, wide, warm)         → the hero / idle
 *   vortex (cold, tight, frantic)     → the doomscroll problem  (uChaos → 1)
 *   menu   (three warm tier rows)     → the resolved menu       (uGather → 1)
 *
 * position = mix( mix(drift, vortex, chaos), menu, gather )
 *
 * One draw call (THREE.Points). All morph math is on the GPU. Colors stay "ink on warm
 * paper" — darker, saturated tokens rather than neon, so they read on the light background
 * and match the app's printed-menu language.
 */
const vert = /* glsl */ `
  uniform float uTime;
  uniform float uChaos;
  uniform float uGather;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uFocus;
  uniform vec2  uPointer;

  attribute vec3  aDrift;
  attribute vec3  aHome;
  attribute float aSeed;
  attribute float aTier;

  varying float vTier;
  varying float vSeed;
  varying float vGather;
  varying float vHi;

  // calm, wide ambient cloud — slow breathing
  vec3 driftPos(vec3 base, float seed, float t) {
    return base + vec3(
      sin(t * 0.25 + seed * 11.0) * 0.45,
      cos(t * 0.22 + seed * 7.0) * 0.45,
      sin(t * 0.2 + seed * 5.0) * 0.35
    );
  }

  // a swirling cold funnel of shards
  vec3 vortexPos(float seed, float t) {
    float a = seed * 6.2831853 + t * (0.5 + seed * 0.7);
    float r = 1.6 + 3.2 * fract(seed * 7.137);
    r *= 0.7 + 0.5 * sin(t * 0.6 + seed * 19.0);
    float y = (fract(seed * 31.7) - 0.5) * 8.0 + sin(t * 0.9 + seed * 10.0) * 0.8;
    return vec3(cos(a) * r, y, sin(a) * r - 0.5);
  }

  void main() {
    vSeed = aSeed;
    vTier = aTier;

    float c = smoothstep(0.0, 1.0, uChaos);
    float g = smoothstep(0.0, 1.0, uGather);
    vGather = g;

    vec3 drift = driftPos(aDrift, aSeed, uTime);
    vec3 vortex = vortexPos(aSeed, uTime);
    vec3 home = aHome + vec3(
      sin(uTime * 0.7 + aSeed * 12.0) * 0.04,
      cos(uTime * 0.8 + aSeed * 9.0) * 0.04,
      0.0
    );

    vec3 base = mix(drift, vortex, c);
    vec3 pos = mix(base, home, g);

    // a soft highlight sweep across the menu rows during the features beat
    float sweep = smoothstep(0.12, 0.0, abs((aHome.x / 5.0 * 0.5 + 0.5) - uFocus));
    vHi = sweep * g;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    mv.xy += uPointer * (0.16 + 0.12 * aSeed) * (-mv.z * 0.016);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.5 + aSeed * 0.75) * (0.72 + g * 0.95 + vHi * 0.5);
    gl_PointSize = size * uPixelRatio * (300.0 / max(-mv.z, 0.1));
  }
`

const frag = /* glsl */ `
  precision highp float;
  uniform float uWarmth;
  uniform vec3  uCold;
  uniform vec3  uWarmBase;
  uniform vec3  uT0;
  uniform vec3  uT1;
  uniform vec3  uT2;

  varying float vTier;
  varying float vSeed;
  varying float vGather;
  varying float vHi;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.07, d);
    if (alpha < 0.01) discard;
    float core = smoothstep(0.3, 0.0, d);

    vec3 tierCol = vTier < 0.5 ? uT0 : (vTier < 1.5 ? uT1 : uT2);
    // dispersed particles stay warm-neutral; tier color only emerges as they gather
    vec3 warm = mix(uWarmBase, tierCol, 0.12 + 0.72 * vGather);
    vec3 col = mix(uCold, warm, uWarmth);
    // gathered tokens get a soft bright core; sweep adds a kiss of light
    col = mix(col, mix(col, vec3(1.0, 0.96, 0.86), 0.6), core * (vGather * 0.25 + vHi * 0.5));

    float a = alpha * mix(0.32, 0.95, vGather);
    a *= 0.6 + 0.4 * vSeed; // gentle density variation
    gl_FragColor = vec4(col, a);
  }
`

export function Particles({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { gl } = useThree()

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const drift = new Float32Array(count * 3)
    const home = new Float32Array(count * 3)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const tier = new Float32Array(count)

    // Menu layout: three horizontal tier rows of tokens.
    const rowsY = [1.35, 0.0, -1.35]
    const spanX = 5.0

    for (let i = 0; i < count; i++) {
      const t = i % 3
      // ── drift: a calm, wide cloud shell (kept off dead-center so text reads) ──
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const rad = 4.6 + Math.random() * 3.6
      drift[i * 3] = Math.sin(phi) * Math.cos(theta) * rad * 1.25
      drift[i * 3 + 1] = (Math.cos(phi) * rad) * 0.7
      drift[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * rad - 1.0

      // ── menu home: tier rows, lightly clustered into tokens ──
      const u = Math.random()
      home[i * 3] = (u - 0.5) * spanX + (Math.random() - 0.5) * 0.3
      home[i * 3 + 1] = rowsY[t] + (Math.random() - 0.5) * 0.6
      home[i * 3 + 2] = (Math.random() - 0.5) * 1.1

      pos[i * 3] = drift[i * 3]
      pos[i * 3 + 1] = drift[i * 3 + 1]
      pos[i * 3 + 2] = drift[i * 3 + 2]
      seed[i] = Math.random()
      tier[i] = t
    }

    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aDrift', new THREE.BufferAttribute(drift, 3))
    g.setAttribute('aHome', new THREE.BufferAttribute(home, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aTier', new THREE.BufferAttribute(tier, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: journey.chaos },
      uGather: { value: journey.gather },
      uWarmth: { value: journey.warmth },
      uFocus: { value: 0 },
      uSize: { value: 8.0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uCold: { value: C.steel.clone() },
      uWarmBase: { value: new THREE.Color('#e9cd9a') },
      uT0: { value: TIER_COLORS[0].clone() },
      uT1: { value: TIER_COLORS[1].clone() },
      uT2: { value: TIER_COLORS[2].clone() },
    }),
    [gl],
  )

  useFrame((_, dt) => {
    const u = uniforms
    u.uTime.value += dt
    const k = 1 - Math.pow(0.0016, dt)
    u.uChaos.value += (journey.chaos - u.uChaos.value) * k
    u.uGather.value += (journey.gather - u.uGather.value) * k
    u.uWarmth.value += (journey.warmth - u.uWarmth.value) * k
    // focus sweeps 0→1 across the features beat
    u.uFocus.value += (journey.focus - u.uFocus.value) * k
    u.uPointer.value.x += (pointer.x - u.uPointer.value.x) * k
    u.uPointer.value.y += (pointer.y - u.uPointer.value.y) * k
  })

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        args={[{ uniforms, vertexShader: vert, fragmentShader: frag }]}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </points>
  )
}
