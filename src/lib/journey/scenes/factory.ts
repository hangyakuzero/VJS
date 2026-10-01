import * as THREE from 'three';
import {
  box, steelMat, factoryEmberMat, concreteTexture, qcTexture,
} from '../materials';

// Act 02 — Factory at z = -50. Charcoal + steel + one ember accent.
// QC hologram sits off the camera axis; floor is lifted in value so shapes
// read against the fog.

export const FACTORY_Z = -50;

export function buildFactory(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'factory';
  g.position.z = FACTORY_Z;

  const floorMat = new THREE.MeshStandardMaterial({ map: concreteTexture(), roughness: 0.96 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);

  const ink = new THREE.MeshStandardMaterial({ color: 0x14100e, roughness: 0.95 });
  const inkBox = (w: number, h: number, d: number, x: number, y: number, z: number) =>
    g.add(box(w, h, d, ink, x, y, z));

  [-9, -3, 3, 9].forEach((x) => inkBox(0.55, 9, 0.55, x, 4.5, -7));
  inkBox(22, 0.6, 0.6, 0, 8.4, -7);
  [-4, 0, 4].forEach((x) => inkBox(0.3, 0.3, 13, x, 8.0, -1));
  // Back wall split around a 4.4 x 4.4 doorway on centre line — the home
  // flight threads it (same language as the studio exit).
  inkBox(10.8, 9, 0.4, -7.6, 4.5, -9);
  inkBox(10.8, 9, 0.4, 7.6, 4.5, -9);
  inkBox(4.4, 4.6, 0.4, 0, 6.7, -9);
  [-2.2, 0.6, 3.2].forEach((x, i) => {
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(x - 1.5, 8.0, -2),
      new THREE.Vector3(x, 7.0 + i * 0.2, -1),
      new THREE.Vector3(x + 1.5, 8.0, 0),
    ]), 16, 0.03, 6, false), ink));
  });

  // Cutting table + fresh panel + brass stamp
  const steel = steelMat();
  g.add(box(6, 0.22, 2.6, steel, 0, 1.0, -1));
  [[-2.6, -2], [2.6, -2], [-2.6, 0.2], [2.6, 0.2]].forEach(([x, z]) =>
    g.add(box(0.22, 1.0, 0.22, steel, x, 0.5, z)),
  );
  g.add(box(5.2, 0.1, 2.0, new THREE.MeshStandardMaterial({ color: 0x6d4a30, roughness: 0.9 }), 0, 1.16, -1));
  g.add(box(0.55, 0.03, 0.34, new THREE.MeshStandardMaterial({ color: 0xb08d3a, roughness: 0.38, metalness: 0.8 }), 2.05, 1.23, -0.4));

  // Panel stacks, one draw call
  const stacks: Array<[number, number]> = [];
  for (let sx = 0; sx < 3; sx++) for (let i = 0; i < 14; i++) stacks.push([-8 + sx * 3.2, i]);
  const inst = new THREE.InstancedMesh(
    new THREE.BoxGeometry(2.4, 0.1, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x6d4a30, roughness: 0.9 }),
    stacks.length,
  );
  const dummy = new THREE.Object3D();
  stacks.forEach(([x, i], k2) => {
    dummy.position.set(x, 0.11 + i * 0.11, 3.4);
    dummy.updateMatrix();
    inst.setMatrixAt(k2, dummy.matrix);
  });
  inst.instanceMatrix.needsUpdate = true;
  inst.castShadow = true;
  inst.receiveShadow = true;
  g.add(inst);

  // Rollers
  for (let i = 0; i < 6; i++) {
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 3.4, 14), steel);
    r.rotation.z = Math.PI / 2;
    r.position.set(5.6, 0.7, -3.6 + i * 0.86);
    r.castShadow = true;
    g.add(r);
  }
  inkBox(4.2, 0.32, 5.8, 5.6, 0.25, -1);

  // Ember strips — the only hot accent
  [-2.6, 0, 2.6].forEach((x) => {
    g.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.14), factoryEmberMat())
      .translateX(x).translateY(6.6).translateZ(-1));
    inkBox(2.0, 0.22, 0.3, x, 6.75, -1);
  });

  // QC hologram — off-axis, tone-mapped, modest opacity
  const holo = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 0.95),
    new THREE.MeshBasicMaterial({ map: qcTexture(), transparent: true, opacity: 0.72, side: THREE.DoubleSide }),
  );
  holo.position.set(3.4, 2.15, -2.2);
  holo.rotation.set(-0.1, -0.55, 0);
  g.add(holo);
  const scanBar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.04), factoryEmberMat());
  scanBar.position.set(3.4, 1.75, -2.15);
  g.add(scanBar);
  g.userData.holo = holo;
  g.userData.scanBar = scanBar;

  // Dust collector
  const vessel = new THREE.Mesh(new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(0.72, 0),
    new THREE.Vector2(0.72, 1.2), new THREE.Vector2(0.36, 1.8),
    new THREE.Vector2(0.12, 2.0),
  ], 20), steel);
  vessel.position.set(-6, 0, -5);
  vessel.castShadow = true;
  g.add(vessel);

  return g;
}
