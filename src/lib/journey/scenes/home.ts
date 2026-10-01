import * as THREE from 'three';
import {
  box, woodMat, sageMat, linenMat, brassMat, emberMat, glassMat,
  plankTexture, artTexture, bulbMat,
} from '../materials';

// Act 03 — Home at z = -76. Floor spans -89..-63: edge-touches the
// factory floor edge, zero overlap area, no coplanar fight.

export const HOME_Z = -76;

export function buildHome(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'home';
  g.position.z = HOME_Z;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 26),
    new THREE.MeshStandardMaterial({ map: plankTexture(), roughness: 0.86 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);

  const wall = linenMat();
  const oak = woodMat();
  g.add(box(24, 9, 0.4, wall, 0, 4.5, -8));
  g.add(box(0.4, 9, 26, wall, 12, 4.5, 0));
  g.add(box(0.4, 9, 26, wall, -12, 4.5, 0));
  g.add(box(24, 0.3, 26, wall, 0, 9, 0));

  // Window — warm glow, tone-mapped
  g.add(new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4.2),
    new THREE.MeshBasicMaterial({ color: 0xf2c98f })).translateX(-4.5).translateY(3.4).translateZ(-7.72));
  g.add(box(6.9, 0.2, 0.16, oak, -4.5, 5.6, -7.72));
  g.add(box(6.9, 0.2, 0.16, oak, -4.5, 1.2, -7.72));
  g.add(box(0.2, 4.6, 0.16, oak, -7.9, 3.4, -7.72));
  g.add(box(0.2, 4.6, 0.16, oak, -1.1, 3.4, -7.72));
  g.add(box(0.15, 4.2, 0.12, oak, -4.5, 3.4, -7.72));
  g.add(box(6.9, 0.12, 0.12, oak, -4.5, 3.4, -7.72));

  const shaftMat = new THREE.MeshBasicMaterial({
    color: 0xffc978, transparent: true, opacity: 0.07,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const shaftGeo = new THREE.PlaneGeometry(5.4, 9);
  [[-5.4, 0.3], [-3.6, -0.4]].forEach(([x, tilt]) => {
    const s = new THREE.Mesh(shaftGeo, shaftMat);
    s.position.set(x, 2.2, -4.2);
    s.rotation.x = -0.9;
    s.rotation.z = tilt * 0.2;
    s.renderOrder = 5;
    g.add(s);
  });

  [0, 1, 2].forEach((i) => {
    const x = 2.6 + i * 1.35;
    g.add(box(1.28, 1.58, 0.07, oak, x, 3.6, -7.83));
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(1.14, 1.44),
      new THREE.MeshStandardMaterial({ map: artTexture(i), roughness: 0.95 }),
    );
    art.position.set(x, 3.6, -7.73);
    g.add(art);
  });

  const sage = sageMat();
  g.add(box(3.4, 0.55, 1.3, sage, 1.5, 0.5, 0.5));
  g.add(box(3.4, 0.85, 0.35, sage, 1.5, 1.0, -0.05));
  g.add(box(0.35, 0.85, 1.3, sage, -0.3, 0.85, 0.5));
  g.add(box(0.35, 0.85, 1.3, sage, 3.3, 0.85, 0.5));
  [0.7, 1.5, 2.3].forEach((x) => {
    const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.5, 4, 10), linenMat());
    c.rotation.z = Math.PI / 2;
    c.position.set(x, 0.95, 0.45);
    c.castShadow = true;
    g.add(c);
  });
  const pillow = box(0.55, 0.55, 0.18, emberMat(), 0.45, 1.0, 0.35);
  pillow.rotation.set(-0.2, 0, 0.4);
  g.add(pillow);

  const rugOuter = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.03, 28), oak);
  rugOuter.position.set(1.5, 0.015, 2.6);
  rugOuter.receiveShadow = true;
  g.add(rugOuter);
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 0.04, 28), linenMat());
  rug.position.set(1.5, 0.03, 2.6);
  rug.receiveShadow = true;
  g.add(rug);

  g.add(box(1.6, 0.1, 0.8, oak, 1.5, 0.45, 2.6));
  g.add(box(0.1, 0.4, 0.7, oak, 0.85, 0.22, 2.6));
  g.add(box(0.1, 0.4, 0.7, oak, 2.15, 0.22, 2.6));
  g.add(box(0.5, 0.06, 0.35, emberMat(), 1.3, 0.53, 2.5));
  g.add(box(0.42, 0.05, 0.3, sage, 1.32, 0.58, 2.52));

  const seat = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 14), linenMat());
  seat.scale.set(1, 0.62, 1);
  seat.position.set(-1.9, 0.5, 2.2);
  seat.castShadow = true;
  g.add(seat);
  const backrest = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 12, 20, Math.PI), linenMat());
  backrest.position.set(-1.9, 0.85, 1.75);
  backrest.castShadow = true;
  g.add(backrest);

  g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.1, 0, 3.4),
    new THREE.Vector3(-3.1, 2.6, 3.4),
    new THREE.Vector3(-1.6, 3.0, 2.6),
  ]), 20, 0.045, 8, false), brassMat()));
  g.add(box(0.5, 0.08, 0.5, brassMat(), -3.1, 0.04, 3.4));
  const lampShade = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 14), bulbMat(0xfff0d4, 0xffb45e, 1.2));
  lampShade.position.set(-1.6, 2.9, 2.6);
  g.add(lampShade);
  g.userData.lampShade = lampShade;

  for (let i = 0; i < 5; i++) {
    const flute = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.1, 12), glassMat());
    flute.position.set(-6.4 + i * 0.55, 1.55, 0.6);
    flute.castShadow = true;
    g.add(flute);
  }
  const brass = brassMat();
  g.add(box(3.1, 0.12, 0.6, brass, -5.3, 3.15, 0.6));
  g.add(box(3.1, 0.12, 0.6, brass, -5.3, 0.06, 0.6));

  g.add(box(2.8, 0.12, 1.2, linenMat(), 6.2, 1.02, -2.5));
  g.add(box(2.6, 0.9, 1.0, oak, 6.2, 0.5, -2.5));
  [5.5, 6.9].forEach((x) => {
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 0.4, 14, 1, true), brass);
    (shade.material as THREE.Material).side = THREE.DoubleSide;
    shade.position.set(x, 3.2, -2.5);
    g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), bulbMat(0xfff0d4, 0xffb45e, 1.2));
    bulb.position.set(x, 3.05, -2.5);
    g.add(bulb);
  });

  for (let i = 0; i < 4; i++) {
    g.add(box(1.15, 3.4, 0.6, oak, -8.2 + i * 1.25, 1.7, -4));
    g.add(box(0.05, 0.5, 0.05, brass, -7.85 + i * 1.25, 1.6, -3.65));
  }

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.45, 12), emberMat());
  pot.position.set(8.2, 0.22, 1.4);
  pot.castShadow = true;
  g.add(pot);
  [[0, 1.2, 0, 0.55], [0.3, 1.7, 0.1, 0.45]].forEach(([x, y, z, r]) => {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 10), sage);
    leaf.position.set(8.2 + x, y, 1.4 + z);
    leaf.castShadow = true;
    g.add(leaf);
  });

  return g;
}
