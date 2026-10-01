import * as THREE from 'three';

// Camera dolly path with Act 1's model->room scale transform.
// p 0.00-0.28 : inside the scale model on the drafting desk (`scale`
//               drives miniature.scale 0.12 -> 1.0).
// p 0.28-0.42 : exit through the doorway into the corridor tunnel.
// p 0.46-0.54 : table hold. p 0.54-0.82 : honey flight home (through the
// factory back-wall doorway). p 0.82-1.0 : home (floor meets factory edge).

export interface CamKey {
  p: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
  scale: number;
  fogColor: THREE.Color;
  fogDensity: number;
  warmth: number;
}

const C = (h: string) => new THREE.Color(h);

export const KEYS: CamKey[] = [
  { p: 0.00, pos: new THREE.Vector3(0.15, 1.25, 0.48), look: new THREE.Vector3(0, 1.22, -0.24), scale: 0.12, fogColor: C('#f3ece0'), fogDensity: 0.02, warmth: 1 },
  { p: 0.08, pos: new THREE.Vector3(0.35, 1.45, 1.30), look: new THREE.Vector3(0, 1.30, -0.30), scale: 0.18, fogColor: C('#efe6d4'), fogDensity: 0.02, warmth: 1 },
  { p: 0.18, pos: new THREE.Vector3(0.60, 1.90, 3.20), look: new THREE.Vector3(0, 1.50, -0.80), scale: 0.45, fogColor: C('#e8dcc4'), fogDensity: 0.02, warmth: 1 },
  { p: 0.28, pos: new THREE.Vector3(0.40, 2.60, 6.40), look: new THREE.Vector3(0, 1.80, -3.00), scale: 1.00, fogColor: C('#f3ece0'), fogDensity: 0.012, warmth: 1 },
  { p: 0.35, pos: new THREE.Vector3(0.20, 2.55, -8.00), look: new THREE.Vector3(0, 1.75, -20.0), scale: 1.00, fogColor: C('#3a332c'), fogDensity: 0.045, warmth: 0.4 },
  { p: 0.46, pos: new THREE.Vector3(0, 2.5, -40), look: new THREE.Vector3(0, 1.7, -51), scale: 1.00, fogColor: C('#38312a'), fogDensity: 0.012, warmth: 0 },
  { p: 0.54, pos: new THREE.Vector3(-0.5, 2.3, -46), look: new THREE.Vector3(0, 1.6, -55), scale: 1.00, fogColor: C('#38312a'), fogDensity: 0.014, warmth: 0.1 },
  { p: 0.68, pos: new THREE.Vector3(-0.3, 2.3, -58), look: new THREE.Vector3(0.2, 1.6, -72), scale: 1.00, fogColor: C('#e3c184'), fogDensity: 0.022, warmth: 0.6 },
  { p: 0.82, pos: new THREE.Vector3(0, 2.3, -66), look: new THREE.Vector3(0.5, 1.5, -77), scale: 1.00, fogColor: C('#f6efe2'), fogDensity: 0.011, warmth: 1 },
  { p: 1.00, pos: new THREE.Vector3(-1.5, 2.6, -69), look: new THREE.Vector3(1.5, 1.2, -77), scale: 1.00, fogColor: C('#fff4e0'), fogDensity: 0.009, warmth: 1 },
];

export function samplePath(progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = THREE.MathUtils.smoothstep((p - a.p) / (b.p - a.p || 1), 0, 1);
  return {
    pos: new THREE.Vector3().lerpVectors(a.pos, b.pos, t),
    look: new THREE.Vector3().lerpVectors(a.look, b.look, t),
    scale: THREE.MathUtils.lerp(a.scale, b.scale, t),
    fogColor: a.fogColor.clone().lerp(b.fogColor, t),
    fogDensity: THREE.MathUtils.lerp(a.fogDensity, b.fogDensity, t),
    warmth: THREE.MathUtils.lerp(a.warmth, b.warmth, t),
  };
}

/** 0..1 through the Act 1 reveal. Drives desk fade + model light. */
export function revealT(progress: number) {
  return THREE.MathUtils.clamp((progress - 0.10) / (0.26 - 0.10), 0, 1);
}

export function chapterAt(p: number) {
  if (p < 0.36) return 0;
  if (p < 0.72) return 1;
  return 2;
}
