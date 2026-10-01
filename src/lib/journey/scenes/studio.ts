import * as THREE from 'three';
import {
  box, wallMat, inkMat, woodMat, sageMat, brassMat, emberMat, bulbMat,
  plankTexture, artTexture, palette,
} from '../materials';

// Act 01 — The Studio. A real room: 16 x 16 x 6, window opening in the left
// wall, doorway in the back wall (the camera exits through it), drafting
// desk, material library, and the glowing scale model on a turntable.

export const DESK_Y = 1.06;

function buildRoom(): THREE.Group {
  const g = new THREE.Group();
  const wall = wallMat();
  const half = 8;

  const floorMat = new THREE.MeshStandardMaterial({ map: plankTexture(), roughness: 0.9 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);
  g.add(box(16, 0.3, 16, wall, 0, 6, 0)); // ceiling

  // Back wall with 4.4 x 4.4 doorway on centre line
  const dW = 2.2;
  const dH = 4.4;
  g.add(box(half - dW, 6, 0.3, wall, -(half + dW) / 2, 3, -half));
  g.add(box(half - dW, 6, 0.3, wall, (half + dW) / 2, 3, -half));
  g.add(box(dW * 2, 6 - dH, 0.3, wall, 0, dH + (6 - dH) / 2, -half));
  const ink = inkMat();
  g.add(box(0.12, dH, 0.42, ink, -dW, dH / 2, -half));
  g.add(box(0.12, dH, 0.42, ink, dW, dH / 2, -half));
  g.add(box(dW * 2, 0.12, 0.42, ink, 0, dH, -half));

  // Left wall with window opening (z -4.5..0.5, y 1.2..4.2)
  const wz0 = -4.5;
  const wz1 = 0.5;
  const wy0 = 1.2;
  const wy1 = 4.2;
  const wood = woodMat();
  g.add(box(0.3, 6, half + wz0, wall, -half, 3, (wz0 - half) / 2));
  g.add(box(0.3, 6, half - wz1, wall, -half, 3, (wz1 + half) / 2));
  g.add(box(0.3, wy0, wz1 - wz0, wall, -half, wy0 / 2, (wz0 + wz1) / 2));
  g.add(box(0.3, 6 - wy1, wz1 - wz0, wall, -half, wy1 + (6 - wy1) / 2, (wz0 + wz1) / 2));
  g.add(box(0.16, 0.14, wz1 - wz0 + 0.3, wood, -half + 0.08, wy0, (wz0 + wz1) / 2));
  g.add(box(0.16, 0.14, wz1 - wz0 + 0.3, wood, -half + 0.08, wy1, (wz0 + wz1) / 2));
  g.add(box(0.16, wy1 - wy0, 0.14, wood, -half + 0.08, (wy0 + wy1) / 2, wz0));
  g.add(box(0.16, wy1 - wy0, 0.14, wood, -half + 0.08, (wy0 + wy1) / 2, wz1));
  g.add(box(0.12, wy1 - wy0, 0.1, wood, -half + 0.08, (wy0 + wy1) / 2, (wz0 + wz1) / 2));

  g.add(box(0.3, 6, 16, wall, half, 3, 0)); // right wall
  g.add(box(16, 6, 0.3, wall, 0, 3, half)); // front wall

  // Drafting table
  const tz = -2;
  g.add(box(5.2, 0.16, 2.2, wood, 0, 1.05, tz));
  [[-2.4, -0.9], [2.4, -0.9], [-2.4, 0.9], [2.4, 0.9]].forEach(([x, dz]) =>
    g.add(box(0.18, 1.05, 0.18, wood, x, 0.52, tz + dz)),
  );
  g.add(box(1.5, 0.8, 1.9, wood, 1.5, 0.4, tz));
  const board = box(2.6, 0.06, 1.5, ink, -0.9, 1.28, tz - 0.1);
  board.rotation.x = -0.22;
  g.add(board);
  const sheet = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.1),
    new THREE.MeshStandardMaterial({ color: 0xfaf6ee, roughness: 0.95 }),
  );
  sheet.position.set(-0.9, 1.33, tz - 0.1);
  sheet.rotation.x = -0.22 - Math.PI / 2;
  g.add(sheet);

  // Material library shelf (instanced slabs)
  const slabColors = [palette.wood, palette.ember, palette.brass, palette.sage, 0x3d5a80, palette.ink];
  const slabs = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.16, 1.0, 0.62),
    new THREE.MeshStandardMaterial({ roughness: 0.95 }),
    36,
  );
  const d = new THREE.Object3D();
  const col = new THREE.Color();
  let k = 0;
  for (let r = 0; r < 4; r++) {
    g.add(box(0.7, 0.08, 6.4, wood, half - 0.45, 0.9 + r * 1.15, -1));
    for (let i = 0; i < 9; i++) {
      d.position.set(half - 0.5, 1.44 + r * 1.15, -3.8 + i * 0.68);
      d.updateMatrix();
      slabs.setMatrixAt(k, d.matrix);
      slabs.setColorAt(k, col.setHex(slabColors[(i + r) % slabColors.length]));
      k++;
    }
  }
  g.add(box(0.7, 0.08, 6.4, wood, half - 0.45, 5.4, -1));
  slabs.instanceMatrix.needsUpdate = true;
  if (slabs.instanceColor) slabs.instanceColor.needsUpdate = true;
  slabs.castShadow = true;
  g.add(slabs);

  // Moodboard triptych
  for (let i = 0; i < 3; i++) {
    g.add(box(1.3, 1.6, 0.07, ink, -6.4 + i * 1.3, 3.3, -7.87));
    const a = new THREE.Mesh(
      new THREE.PlaneGeometry(1.15, 1.45),
      new THREE.MeshStandardMaterial({ map: artTexture(i), roughness: 0.95 }),
    );
    a.position.set(-6.4 + i * 1.3, 3.3, -7.78);
    g.add(a);
  }

  // Pendants
  const pendants: THREE.Mesh[] = [];
  [-1.6, 0, 1.6].forEach((x) => {
    g.add(box(0.03, 2.2, 0.03, ink, x, 4.9, tz));
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.5, 18, 1, true), brassMat());
    shade.material = shade.material.clone();
    (shade.material as THREE.Material).side = THREE.DoubleSide;
    shade.position.set(x, 3.65, tz);
    g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), bulbMat());
    bulb.position.set(x, 3.48, tz);
    g.add(bulb);
    pendants.push(shade);
  });
  g.userData.pendants = pendants;

  // Task lamp
  g.add(new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.0, 1.13, tz + 0.6),
      new THREE.Vector3(2.2, 2.0, tz + 0.6),
      new THREE.Vector3(1.5, 2.3, tz + 0.3),
    ]), 18, 0.045, 8, false),
    brassMat(),
  ));
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.34, 14, 1, true), emberMat());
  head.material = head.material.clone();
  (head.material as THREE.Material).side = THREE.DoubleSide;
  head.position.set(1.5, 2.16, tz + 0.3);
  head.rotation.x = Math.PI;
  g.add(head);

  // Stool + lounge chair + plant
  g.add(box(0.8, 0.14, 0.8, sageMat(), 0, 0.66, tz + 1.9));
  g.add(box(0.12, 0.66, 0.12, ink, 0, 0.33, tz + 1.9));
  g.add(box(1.0, 0.5, 1.0, sageMat(), -5.6, 0.5, -1.4));
  g.add(box(1.0, 0.9, 0.3, sageMat(), -5.6, 1.0, -1.8));
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.32, 0.6, 12), emberMat());
  pot.position.set(6.2, 0.3, 2.6);
  pot.castShadow = true;
  g.add(pot);
  [[0, 1.5, 0, 0.6], [0.32, 2.0, 0.1, 0.44]].forEach(([x, y, z, r]) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), sageMat());
    leaf.position.set(6.2 + x, y, 2.6 + z);
    leaf.castShadow = true;
    g.add(leaf);
  });

  return g;
}

function buildDeskSet(): THREE.Group {
  const g = new THREE.Group();
  const wood = woodMat();
  const ink = inkMat();

  // Desk surface sits 0.04 BELOW the model's rest floor (1.06): the two
  // front-facing planes never coincide, so the macro floor can't shimmer.
  g.add(box(7.4, 0.16, 4.6, wood, 0, DESK_Y - 0.12, 0));
  g.add(box(7.5, 0.06, 4.7, ink, 0, DESK_Y - 0.18, 0));
  [[-3.2, -2], [3.2, -2], [-3.2, 2], [3.2, 2]].forEach(([x, z]) =>
    g.add(box(0.22, 0.9, 0.22, ink, x, 0.45, z)),
  );
  // Mat shifted clear of the model's footprint — its top was 0.02 under
  // the model floor at the overlap strip.
  g.add(box(2.6, 0.02, 1.8, sageMat(), -2.6, DESK_Y + 0.01, 0.6));

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.42, 12), emberMat());
  cup.position.set(2.9, DESK_Y + 0.21, 1.3);
  cup.castShadow = true;
  g.add(cup);
  [0, 1, 2, 3, 4].forEach((i) => {
    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.5, 6),
      i % 2 ? brassMat() : ink,
    );
    pencil.position.set(2.9 + (i - 2) * 0.07, DESK_Y + 0.55, 1.3);
    pencil.rotation.z = (i - 2) * 0.07;
    g.add(pencil);
  });

  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.19, 0.34, 14), wallMat());
  mug.position.set(-3.0, DESK_Y + 0.17, -1.2);
  mug.castShadow = true;
  g.add(mug);

  // No desk-lamp meshes: the SpotLight in the Experience lights the macro
  // invisibly. Visible fixtures near the flight corridor kept popping
  // through frame, so they were deleted, not moved.

  return g;
}

export function buildStudio(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'studio';
  const miniature = buildRoom();
  miniature.position.y = DESK_Y;
  miniature.scale.setScalar(0.12);
  g.add(miniature);
  const deskSet = buildDeskSet();
  g.add(deskSet);
  g.userData.miniature = miniature;
  g.userData.deskSet = deskSet;
  return g;
}
