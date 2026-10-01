import * as THREE from 'three';

// Exposure-safe palette. Every material is matte-first; emissives stay
// <= 1.2 and tone-mapped. Nothing here can blow out on its own —
// brightness comes from the single key light per act, not the materials.

const cache = new Map<string, THREE.MeshStandardMaterial>();

export function mat(key: string, opts: THREE.MeshStandardMaterialParameters) {
  if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial(opts));
  return cache.get(key)!;
}

const flat = (key: string, color: number, roughness = 0.94, metalness = 0.04) =>
  mat(key, { color, roughness, metalness });

export const palette = {
  cream: 0xf3ece0,
  ink: 0x241d18,
  wood: 0x8c5e3c,
  ember: 0xe2603a,
  brass: 0xc9a227,
  sage: 0x6f8064,
  steel: 0x9aa0a6,
  linen: 0xe8dfd3,
};

export function wallMat() { return flat('wall', palette.cream, 0.97); }
export function inkMat() { return flat('ink', palette.ink, 0.96, 0.08); }
export function woodMat() { return flat('wood', palette.wood, 0.88); }
export function darkWoodMat() { return flat('darkwood', 0x4a3423, 0.9); }
export function sageMat() { return flat('sage', palette.sage, 0.96); }
export function creamMat() { return flat('cream', palette.cream, 0.95); }
export function linenMat() { return flat('linen', palette.linen, 0.97); }
export function brassMat() { return flat('brass', palette.brass, 0.38, 0.75); }
export function steelMat() { return flat('steel', palette.steel, 0.45, 0.65); }
export function emberMat() {
  return mat('ember', {
    color: palette.ember, roughness: 0.7, metalness: 0,
    emissive: palette.ember, emissiveIntensity: 0.25,
  });
}
export function factoryEmberMat() {
  return mat('f_ember', {
    color: 0xff7a2f, roughness: 0.65, metalness: 0,
    emissive: 0xff7a2f, emissiveIntensity: 1.0,
  });
}
export function bulbMat(color = 0xffe9c4, emissive = 0xffc978, intensity = 1.0) {
  return new THREE.MeshStandardMaterial({
    color, emissive, emissiveIntensity: intensity, roughness: 1,
  });
}

// Shared fluted-glass divider material (home).
let _glass: THREE.MeshPhysicalMaterial | null = null;
export function glassMat() {
  if (!_glass) {
    _glass = new THREE.MeshPhysicalMaterial({
      color: 0xf5e8d0, roughness: 0.25, metalness: 0,
      transmission: 0.5, thickness: 0.25, ior: 1.4,
      transparent: true, opacity: 0.8,
    });
  }
  return _glass;
}

// --- Procedural canvas textures ---

function canvasTex(draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const s = 512;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  draw(c.getContext('2d')!, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

let _plank: THREE.CanvasTexture | null = null;
export function plankTexture() {
  if (_plank) return _plank;
  _plank = canvasTex((ctx, s) => {
    ctx.fillStyle = '#c99a5f';
    ctx.fillRect(0, 0, s, s);
    const rows = 6;
    for (let r = 0; r < rows; r++) {
      const y = (r * s) / rows;
      const v = 196 + Math.floor(Math.random() * 16);
      ctx.fillStyle = `rgb(${v},${Math.floor(v * 0.68)},${Math.floor(v * 0.47)})`;
      ctx.fillRect(0, y + 2, s, s / rows - 4);
      ctx.fillStyle = 'rgba(110,75,40,0.7)';
      ctx.fillRect(0, y, s, 3);
      ctx.strokeStyle = 'rgba(140,94,60,0.28)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 7; i++) {
        const gy = y + 4 + Math.random() * (s / rows - 8);
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.bezierCurveTo(s * 0.3, gy + 3, s * 0.6, gy - 3, s, gy + 1);
        ctx.stroke();
      }
      const jx = (r * 173) % s;
      ctx.fillStyle = 'rgba(110,75,40,0.7)';
      ctx.fillRect(jx, y, 4, s / rows);
    }
  });
  _plank.repeat.set(3, 3);
  return _plank;
}

let _concrete: THREE.CanvasTexture | null = null;
export function concreteTexture() {
  if (_concrete) return _concrete;
  _concrete = canvasTex((ctx, s) => {
    ctx.fillStyle = '#3a332e';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2200; i++) {
      const v = 42 + Math.floor(Math.random() * 40);
      ctx.fillStyle = `rgba(${v},${v - 4},${v - 8},${0.25 + Math.random() * 0.35})`;
      const r = 1 + Math.random() * 3;
      ctx.fillRect(Math.random() * s, Math.random() * s, r, r);
    }
    ctx.strokeStyle = 'rgba(20,16,14,0.55)';
    ctx.lineWidth = 3;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo((i * s) / 4, 0); ctx.lineTo((i * s) / 4, s);
      ctx.moveTo(0, (i * s) / 4); ctx.lineTo(s, (i * s) / 4);
      ctx.stroke();
    }
  });
  _concrete.repeat.set(3, 3);
  return _concrete;
}

const _art: THREE.CanvasTexture[] = [];
export function artTexture(i: number) {
  if (_art[i]) return _art[i];
  const sets = [
    ['#8c5e3c', '#e2603a', '#f3ece0'],
    ['#6f8064', '#c9a227', '#241d18'],
    ['#e2603a', '#c9a227', '#e8dfd3'],
  ];
  const c = sets[i % sets.length];
  const t = canvasTex((ctx, s) => {
    const grad = ctx.createLinearGradient(0, 0, s, s);
    grad.addColorStop(0, c[0]);
    grad.addColorStop(0.55, c[1]);
    grad.addColorStop(1, c[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = 'rgba(250,247,242,0.85)';
    ctx.beginPath();
    ctx.arc(s * (0.3 + i * 0.2), s * 0.35, s * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(28,25,23,0.35)';
    ctx.fillRect(0, s * 0.72, s, s * 0.08);
  });
  _art[i] = t;
  return t;
}

let _check: THREE.CanvasTexture | null = null;
export function qcTexture() {
  if (_check) return _check;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'rgba(14,12,10,0.88)';
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#e2603a';
  ctx.fillRect(0, 0, 512, 10);
  ctx.fillRect(0, 246, 512, 10);
  ctx.font = 'bold 32px monospace';
  ctx.fillText('QC PASSED', 26, 60);
  ctx.font = '24px monospace';
  ctx.fillStyle = '#9fd8a8';
  ['panel flat 0.2mm', 'edge band 100%', 'soft-close OK'].forEach((r, i) =>
    ctx.fillText('> ' + r, 26, 110 + i * 38),
  );
  _check = new THREE.CanvasTexture(c);
  _check.colorSpace = THREE.SRGBColorSpace;
  return _check;
}

export function disposeAll() {
  [_plank, _concrete, _check, ..._art].forEach((t) => t?.dispose());
  _glass?.dispose();
  _plank = _concrete = _check = null;
  _glass = null;
  _art.length = 0;
  cache.forEach((m) => m.dispose());
  cache.clear();
}

export function box(
  w: number, h: number, d: number,
  material: THREE.Material, x = 0, y = 0, z = 0,
) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
