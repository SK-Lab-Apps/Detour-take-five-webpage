import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { journey, pointer } from './journey'
import { C } from './colors'

/**
 * Particles — the single morphing object that carries the whole story.
 *
 * Three target states, blended by `journey`:
 *   drift   (calm, wide, warm starfield)        → the hero / idle
 *   vortex  (cold, tight, frantic storm)        → the doomscroll problem  (uChaos → 1)
 *   galaxy  (a slowly-turning warm spiral)      → the calm resolution     (uGather → 1)
 *
 * position = mix( mix(drift, vortex, chaos), galaxy, gather )
 *
 * Colour is a warm sunset gradient by radius (gold core → terracotta → dusty rose), graded
 * cold→warm by `uWarmth`. No flat yellow, no hard colour bands — one cohesive, living field.
 */
const vert = /* glsl */ `
  uniform float uTime;
  uniform float uChaos;
  uniform float uGather;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec2  uPointer;

  attribute vec3  aDrift;
  attribute vec3  aDisc;   // base spiral-disc point (xz plane, y = thickness)
  attribute float aSeed;
  attribute float aTone;   // 0 (core) .. 1 (rim) for the colour gradient

  varying float vTone;
  varying float vSeed;
  varying float vGather;
  varying float vDepth;

  vec3 rotY(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
  vec3 rotX(vec3 p, float a){ float c=cos(a), s=sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }

  vec3 driftPos(vec3 base, float seed, float t){
    return base + vec3(
      sin(t*0.22 + seed*11.0)*0.5,
      cos(t*0.20 + seed*7.0)*0.5,
      sin(t*0.18 + seed*5.0)*0.4
    );
  }

  // a cold tunnel being sucked toward the camera — the endless feed pulling you in
  vec3 vortexPos(float seed, float t){
    float a = seed*6.2831853 + t*(0.8 + seed*0.6);
    float zc = fract(seed*13.17 + t*0.085);          // 0..1 stream cycle, far -> near
    float z = mix(-12.0, 4.0, zc);
    float r = (0.5 + 2.4*fract(seed*7.137)) * (0.32 + 0.9*zc); // funnel widens as it nears
    return vec3(cos(a)*r, sin(a)*r, z);
  }

  void main(){
    vSeed = aSeed;
    vTone = aTone;
    float c = smoothstep(0.0, 1.0, uChaos);
    float g = smoothstep(0.0, 1.0, uGather);
    vGather = g;

    vec3 drift  = driftPos(aDrift, aSeed, uTime);
    vec3 vortex = vortexPos(aSeed, uTime);

    // galaxy: spin the disc in-plane, tilt it toward camera, breathe gently
    vec3 gal = rotY(aDisc, uTime*0.05);
    gal = rotX(gal, 0.42);
    gal += vec3(0.0, sin(uTime*0.6 + aSeed*9.0)*0.05, 0.0);

    vec3 base = mix(drift, vortex, c);
    vec3 pos  = mix(base, gal, g);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    mv.xy += uPointer * (0.20 + 0.18*aSeed) * (-mv.z*0.02);   // depth parallax
    gl_Position = projectionMatrix * mv;

    vDepth = clamp((-mv.z - 6.0) / 10.0, 0.0, 1.0);
    float size = uSize * (0.45 + aSeed*0.8) * (0.5 + g*0.9) * (1.0 - 0.35*vDepth);
    gl_PointSize = min(size * uPixelRatio * (320.0 / max(-mv.z, 0.1)), 46.0 * uPixelRatio);
    if (mv.z > -0.05) gl_PointSize = 0.0; // cull anything that streamed behind the camera
  }
`

const frag = /* glsl */ `
  precision highp float;
  uniform float uWarmth;
  uniform vec3  uCold;
  uniform vec3  uCore;   // gold
  uniform vec3  uMid;    // terracotta
  uniform vec3  uRim;    // dusty rose / plum
  uniform float uGlow;

  varying float vTone;
  varying float vSeed;
  varying float vGather;
  varying float vDepth;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.06, d);
    if (alpha < 0.01) discard;
    float core = smoothstep(0.34, 0.0, d);

    // Dispersed (hero/idle) → a calm pale warm cream, so the hero is airy and light.
    // Assembled galaxy → the full warm sunset gradient (gold core → terracotta → rose rim).
    vec3 galaxyCol = vTone < 0.5 ? mix(uCore, uMid, vTone*2.0) : mix(uMid, uRim, (vTone-0.5)*2.0);
    vec3 dispersed = mix(uCore, vec3(0.97, 0.91, 0.80), 0.55);
    vec3 warm = mix(dispersed, galaxyCol, vGather);
    vec3 col = mix(uCold, warm, uWarmth);
    // gathered cores pick up a soft inner light
    col = mix(col, mix(col, vec3(1.0,0.96,0.88), 0.5), core * (vGather*0.3 + uGlow*0.2));

    float a = alpha * mix(0.16, 0.92, vGather) * (1.0 - 0.25*vDepth);
    a *= 0.55 + 0.45*vSeed;
    gl_FragColor = vec4(col, a);
  }
`

export function Particles({ count }: { count: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { gl } = useThree()

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const drift = new Float32Array(count * 3)
    const disc = new Float32Array(count * 3)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const tone = new Float32Array(count)

    const R = 3.2
    for (let i = 0; i < count; i++) {
      // ── drift: a wide calm starfield shell (kept off dead-centre so text reads) ──
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      const rad = 4.8 + Math.random() * 3.8
      drift[i * 3] = Math.sin(ph) * Math.cos(th) * rad * 1.3
      drift[i * 3 + 1] = Math.cos(ph) * rad * 0.7
      drift[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * rad - 1.0

      // ── galaxy: a spiral disc (xz plane), denser/thicker at the core ──
      const rr = 0.35 + R * Math.sqrt(Math.random())
      const arm = rr * 0.9 // spiral twist
      const ang = Math.random() * Math.PI * 2 + arm
      const thick = (Math.random() - 0.5) * (0.55 + 0.7 * (1 - rr / R))
      disc[i * 3] = Math.cos(ang) * rr
      disc[i * 3 + 1] = thick
      disc[i * 3 + 2] = Math.sin(ang) * rr

      pos[i * 3] = drift[i * 3]
      pos[i * 3 + 1] = drift[i * 3 + 1]
      pos[i * 3 + 2] = drift[i * 3 + 2]
      seed[i] = Math.random()
      tone[i] = Math.min(1, rr / R + (Math.random() - 0.5) * 0.15)
    }

    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aDrift', new THREE.BufferAttribute(drift, 3))
    g.setAttribute('aDisc', new THREE.BufferAttribute(disc, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aTone', new THREE.BufferAttribute(tone, 1))
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: journey.chaos },
      uGather: { value: journey.gather },
      uWarmth: { value: journey.warmth },
      uGlow: { value: 0 },
      uSize: { value: 8.5 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uCold: { value: C.steel.clone() },
      uCore: { value: new THREE.Color('#ffd29a') }, // warm gold core
      uMid: { value: new THREE.Color('#d2643a') }, // terracotta
      uRim: { value: new THREE.Color('#9c5a73') }, // dusty plum-rose rim
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
    u.uGlow.value += (journey.bloom - u.uGlow.value) * k
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
