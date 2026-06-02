import * as THREE from 'three'

/** Brand colors as THREE.Color, straight from THEME.md. */
export const C = {
  paper: new THREE.Color('#faf4e8'),
  paperDeep: new THREE.Color('#f2e9d6'),
  // cool, desaturated greige the world drifts toward during the doomscroll beat
  cool: new THREE.Color('#dfe1e2'),
  coolDeep: new THREE.Color('#b9c0c6'),
  ink: new THREE.Color('#2a1f18'),
  terracotta: new THREE.Color('#d2643a'),
  terracottaDeep: new THREE.Color('#a84a26'),
  mustard: new THREE.Color('#c99a2b'),
  forest: new THREE.Color('#4f6b3a'),
  plum: new THREE.Color('#8b4060'),
  // cold shard color (steel) for chaos particles
  steel: new THREE.Color('#6e7e8c'),
} as const

export const TIER_COLORS = [C.mustard, C.forest, C.plum] as const
