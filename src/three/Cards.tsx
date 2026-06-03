import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { journey, pointer } from './journey'
import { C } from './colors'

/**
 * Cards — the single instanced object that carries the whole "feed → menu" story.
 *
 * One InstancedBufferGeometry of small rounded-rect quads (crisp silhouettes, never blobs).
 * Each card has a deterministic home in three states, blended every frame by `journey`:
 *
 *   swarm   — a turbulent cylindrical SHELL around the camera (the endless feed).      chaos=0 gather=0
 *   vortex  — a tunnel streaming past the camera (being pulled in).                    chaos=1 gather=0
 *   menu    — three calm, tier-tinted rows of activity TOKENS (the payoff).            gather=1
 *
 *   position = mix( mix(swarm, vortex, uChaos), menu, uGather )
 *
 * Turbulence is deterministic trig (a swirl + bounded sinusoidal flow), never random-noise
 * mush — it reads as flowing, not gooey. Cards billboard to the camera; they tumble in the
 * swarm and stand upright as tokens. Colour grades cool steel → warm tier (mustard/forest/
 * plum) by `uWarmth`. The hero shell density falls off toward the centre so copy stays crisp.
 */

// A clearly-readable subset resolves into distinct, separated menu tokens; the rest become a
// faint background field so the menu frame stays calm and legible (clarity over density).
const HERO_COLS = 5
const HERO_LINES = 2
const HERO_PER_TIER = HERO_COLS * HERO_LINES
const HERO_TOTAL = HERO_PER_TIER * 3

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uChaos;
  uniform float uGather;
  uniform float uWarmth;
  uniform float uSize;
  uniform float uMotion;   // global motion scale (calmer on mobile)
  uniform vec2  uPointer;
  uniform vec3  uTier0, uTier1, uTier2;

  attribute vec3  aShell;  // swarm home (cylindrical shell around camera)
  attribute vec3  aMenu;   // resolved menu home
  attribute float aSeed;
  attribute float aTier;   // 0/1/2 → mustard/forest/plum row
  attribute float aHero;   // 1 = distinct menu token, 0 = faint background card

  varying vec2  vP;        // fragment position in the quad's local world units
  varying vec2  vHalf;     // card half-extents (for the rounded-rect SDF)
  varying float vRadius;   // corner radius
  varying vec3  vTierCol;
  varying float vSeed;
  varying float vHero;
  varying float vGather;
  varying float vWarmth;
  varying float vDepth;

  // a slow swirl around the view axis + bounded local flow — busy but never gooey
  vec3 swarmPos(vec3 shell, float seed, float t){
    float ang = t * 0.12 * (0.5 + 0.8 * seed) * uMotion;
    float c = cos(ang), s = sin(ang);
    vec3 p = vec3(shell.x * c - shell.y * s, shell.x * s + shell.y * c, shell.z);
    p += uMotion * vec3(
      sin(t * 0.9 + seed * 30.0) * 0.22,
      cos(t * 0.8 + seed * 21.0) * 0.22,
      sin(t * 0.7 + seed * 12.0) * 0.40
    );
    return p;
  }

  // a tunnel of cards streaming far → near and past the camera (the feed pulling you in)
  vec3 vortexPos(float seed, float t){
    float a  = seed * 6.2831853 + t * (0.8 + seed * 0.6) * uMotion;
    float zc = fract(seed * 13.17 + t * 0.10 * uMotion); // 0..1 stream cycle, far → near
    float z  = mix(-15.0, 12.0, zc);
    float r  = (1.2 + 3.0 * fract(seed * 7.137)) * (0.45 + 0.85 * zc);
    return vec3(cos(a) * r, sin(a) * r * 0.85, z);
  }

  void main(){
    float c = smoothstep(0.0, 1.0, uChaos);
    float g = smoothstep(0.0, 1.0, uGather);

    vec3 swarm  = swarmPos(aShell, aSeed, uTime);
    vec3 vortex = vortexPos(aSeed, uTime);
    vec3 menu   = aMenu + vec3(
      sin(uTime * 0.45 + aSeed * 7.0) * 0.04,
      sin(uTime * 0.50 + aSeed * 9.0) * 0.07,   // gentle breathing bob
      0.0
    );

    vec3 base   = mix(swarm, vortex, c);
    vec3 center = mix(base, menu, g);

    vec4 mv = modelViewMatrix * vec4(center, 1.0);

    // depth parallax from the pointer — more for distant cards
    mv.xy += uPointer * (0.5 + 0.5 * aSeed) * (-mv.z) * 0.012;

    // cull cards that have streamed behind the camera (clip the whole quad)
    if (mv.z > -0.15) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }

    float depth = clamp((-mv.z - 4.0) / 16.0, 0.0, 1.0);

    // size & aspect: small feed-cards (landscape) in the swarm → calm tokens (squarer) in the menu
    float swarmSize = uSize * (0.5 + 0.5 * aSeed) * 0.70;
    float menuSize  = uSize * mix(0.42, 1.0, aHero) * (0.9 + 0.2 * aSeed);
    float size = mix(swarmSize, menuSize, g);
    float W = size * mix(1.45, 1.18, g);
    float H = size * mix(0.92, 1.00, g);

    // tumble in the swarm, stand upright as a token
    float swarmRoll = sin(uTime * 0.25 + aSeed * 30.0) * 0.5 * uMotion + (aSeed - 0.5) * 0.6;
    float roll = mix(swarmRoll, 0.0, g);

    vec2 corner = vec2(position.x * W, position.y * H);
    float cr = cos(roll), sr = sin(roll);
    vec2 rc = vec2(corner.x * cr - corner.y * sr, corner.x * sr + corner.y * cr);

    mv.xy += rc;                         // view-space offset = always faces the camera
    gl_Position = projectionMatrix * mv;

    vP      = vec2(uv.x - 0.5, uv.y - 0.5) * vec2(W, H);
    vHalf   = vec2(W, H) * 0.5 * 0.72;   // card sits inside the quad; margin holds the glow
    vRadius = min(vHalf.x, vHalf.y) * mix(0.22, 0.95, g);  // rounded card → pill token
    vTierCol = aTier < 0.5 ? uTier0 : (aTier < 1.5 ? uTier1 : uTier2);
    vSeed   = aSeed;
    vHero   = aHero;
    vGather = g;
    vWarmth = uWarmth;
    vDepth  = depth;
  }
`

const frag = /* glsl */ `
  precision highp float;
  uniform vec3 uCold;
  uniform vec3 uCream;

  varying vec2  vP;
  varying vec2  vHalf;
  varying float vRadius;
  varying vec3  vTierCol;
  varying float vSeed;
  varying float vHero;
  varying float vGather;
  varying float vWarmth;
  varying float vDepth;

  void main(){
    // rounded-rect signed distance (negative inside)
    vec2 b = vHalf - vRadius;
    float d = length(max(abs(vP) - b, 0.0)) - vRadius;
    float minDim = min(vHalf.x, vHalf.y);

    float aa   = 0.012 * (vHalf.x + vHalf.y);
    float fill = 1.0 - smoothstep(0.0, aa, d);          // crisp card body
    float haloW = minDim * 0.36;
    float halo = smoothstep(haloW, 0.0, d) * (1.0 - fill); // soft outer glow (premium edge)
    float core = smoothstep(0.0, -minDim, d);            // inner light toward the centre

    // colour: cool steel (chaos) → warm tier token (menu). Background cards stay a faint cream.
    vec3 warmCard = mix(uCream, vTierCol, mix(0.12, 1.0, vHero));
    vec3 warm = mix(uCream * 1.02, warmCard, vGather);
    vec3 col  = mix(uCold, warm, vWarmth);
    col = mix(col, mix(col, vec3(1.0, 0.97, 0.90), 0.7), core * (0.4 + 0.6 * vGather));

    float swarmA = 0.42 + 0.40 * vSeed;
    float menuA  = mix(0.16, 0.95, vHero);
    float a = mix(swarmA, menuA, vGather);

    float alpha = fill * a + halo * a * 0.5 * (0.4 + 0.6 * vGather);
    alpha *= 1.0 - 0.35 * vDepth;
    if (alpha < 0.004) discard;

    gl_FragColor = vec4(col, alpha);
  }
`

export function Cards({ count, motion = 1 }: { count: number; motion?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const geo = useMemo(() => {
    const shell = new Float32Array(count * 3)
    const menu = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const tier = new Float32Array(count)
    const hero = new Float32Array(count)

    // Hero tokens occupy the LAST indices so they draw on top of the background field.
    const heroStart = Math.max(0, count - HERO_TOTAL)
    const BAND_GAP = 2.1 // vertical gap between tiers
    const LINE_GAP = 0.82 // gap between the two lines within a tier
    const COL_GAP = 1.2

    for (let i = 0; i < count; i++) {
      const s = Math.random()
      seed[i] = s

      // ── swarm shell: cylinder around the z-axis, biased outward so the centre stays clear ──
      const a = Math.random() * Math.PI * 2
      const r = 3.0 + 6.5 * Math.sqrt(Math.random())
      shell[i * 3] = Math.cos(a) * r
      shell[i * 3 + 1] = Math.sin(a) * r * 0.8
      shell[i * 3 + 2] = THREE.MathUtils.lerp(-11, 13, Math.random())

      if (i >= heroStart) {
        // ── distinct menu token: 3 colour bands × (HERO_LINES × HERO_COLS) ──
        const h = i - heroStart
        const t = Math.floor(h / HERO_PER_TIER) // 0,1,2 = starters/mains/desserts
        const idx = h % HERO_PER_TIER
        const line = Math.floor(idx / HERO_COLS)
        const col = idx % HERO_COLS
        const bandY = (1 - t) * BAND_GAP
        const y = bandY + (line - (HERO_LINES - 1) / 2) * LINE_GAP
        const x = (col - (HERO_COLS - 1) / 2) * COL_GAP
        menu[i * 3] = x + (s - 0.5) * 0.08
        menu[i * 3 + 1] = y + (Math.random() - 0.5) * 0.06
        menu[i * 3 + 2] = (s - 0.5) * 0.4
        tier[i] = t
        hero[i] = 1
      } else {
        // ── faint background field: wide and deep, behind the menu plane ──
        menu[i * 3] = (Math.random() * 2 - 1) * 9.0
        menu[i * 3 + 1] = (Math.random() * 2 - 1) * 5.0
        menu[i * 3 + 2] = -2.0 - Math.random() * 7.0
        tier[i] = i % 3
        hero[i] = 0
      }
    }

    const base = new THREE.PlaneGeometry(1, 1)
    const g = new THREE.InstancedBufferGeometry()
    g.index = base.index
    g.setAttribute('position', base.attributes.position)
    g.setAttribute('uv', base.attributes.uv)
    g.setAttribute('aShell', new THREE.InstancedBufferAttribute(shell, 3))
    g.setAttribute('aMenu', new THREE.InstancedBufferAttribute(menu, 3))
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1))
    g.setAttribute('aTier', new THREE.InstancedBufferAttribute(tier, 1))
    g.setAttribute('aHero', new THREE.InstancedBufferAttribute(hero, 1))
    g.instanceCount = count
    return g
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uChaos: { value: journey.chaos },
      uGather: { value: journey.gather },
      uWarmth: { value: journey.warmth },
      uSize: { value: 0.5 },
      uMotion: { value: 1 }, // set from the `motion` prop each frame (see useFrame)
      uPointer: { value: new THREE.Vector2(0, 0) },
      uCold: { value: C.steel.clone() },
      uCream: { value: C.cream.clone() },
      uTier0: { value: C.mustard.clone() },
      uTier1: { value: C.forest.clone() },
      uTier2: { value: C.plum.clone() },
    }),
    [],
  )

  // Dispose GPU resources on unmount.
  useEffect(() => {
    const g = geo
    return () => {
      g.dispose()
      matRef.current?.dispose()
    }
  }, [geo])

  useFrame((_, dt) => {
    const u = uniforms
    u.uTime.value += dt
    u.uMotion.value = motion
    const k = 1 - Math.pow(0.0016, dt) // critically-damped easing toward the scroll state
    u.uChaos.value += (journey.chaos - u.uChaos.value) * k
    u.uGather.value += (journey.gather - u.uGather.value) * k
    u.uWarmth.value += (journey.warmth - u.uWarmth.value) * k
    u.uPointer.value.x += (pointer.x - u.uPointer.value.x) * k
    u.uPointer.value.y += (pointer.y - u.uPointer.value.y) * k
  })

  return (
    <mesh geometry={geo} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        args={[{ uniforms, vertexShader: vert, fragmentShader: frag }]}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  )
}
