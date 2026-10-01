import * as THREE from 'three';
import { box } from '../materials';

// Transition tunnel: studio doorway (z=-8) → factory floor edge (z=-37).
// Floor spans -37..-8 exactly — edge-touching both neighbors, zero overlap
// area, so no coplanar fight with either floor.

export function buildCorridor(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'corridor';

  const ink = new THREE.MeshStandardMaterial({ color: 0x171310, roughness: 0.96 });
  const ember = new THREE.MeshStandardMaterial({
    color: 0xff7a2f, roughness: 0.65, metalness: 0,
    emissive: 0xff7a2f, emissiveIntensity: 1.0,
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 29), ink);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -22.5);
  floor.receiveShadow = true;
  g.add(floor);
  g.add(box(0.3, 5, 29, ink, -3.15, 2.5, -22.5));
  g.add(box(0.3, 5, 29, ink, 3.15, 2.5, -22.5));
  g.add(box(6.6, 0.3, 29, ink, 0, 5.1, -22.5));

  // Ember guide strips, alternating sides every 6 units.
  for (let i = 0; i < 5; i++) {
    const x = i % 2 === 0 ? -2.9 : 2.9;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 1.6), ember);
    bar.position.set(x, 3.4, -10 - i * 6);
    g.add(bar);
  }

  return g;
}
