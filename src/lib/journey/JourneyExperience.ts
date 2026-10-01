import * as THREE from 'three';
import { buildStudio, DESK_Y } from './scenes/studio';
import { buildCorridor } from './scenes/corridor';
import { buildFactory } from './scenes/factory';
import { buildHome } from './scenes/home';
import { samplePath, revealT } from './transitions';
import { disposeAll } from './materials';

// Procedural rooms + fog flights. Anti-flicker discipline:
//  - toneMappingExposure FIXED at 1.0, never lerped
//  - NO bloom, NO bokeh: direct render only (depth pre-passes shimmer)
//  - sun frozen per act; shadow maps frozen unless the reveal is active
//  - nothing casts moving shadows; pendants are static geometry
export class JourneyExperience {
  private renderer!: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private progress = 0;
  private target = 0;
  private canvas: HTMLCanvasElement;
  private isMobile = false;

  private ambient!: THREE.AmbientLight;
  private hemi!: THREE.HemisphereLight;
  private sun!: THREE.DirectionalLight;
  private deskLamp!: THREE.SpotLight;
  private emberSpot!: THREE.SpotLight;
  private factoryCool!: THREE.DirectionalLight;
  private factoryFill!: THREE.HemisphereLight;
  private homeSpot!: THREE.SpotLight;

  private particles!: THREE.Points;
  private sparks!: THREE.Points;
  private sparkVel!: Float32Array;

  private miniature!: THREE.Group;
  private deskSet!: THREE.Group;
  private factory!: THREE.Group;
  private home!: THREE.Group;

  private sunSet1 = false;
  private sunSet3 = false;
  private forceShadow = true;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  init() {
    this.isMobile = window.matchMedia('(max-width: 767px)').matches;

    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.12, 220);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = !this.isMobile;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene.background = new THREE.Color(0x241d18);
    this.scene.fog = new THREE.FogExp2(0x241d18, 0.055);

    this.ambient = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(this.ambient);
    this.hemi = new THREE.HemisphereLight(0xffe6c0, 0x6b4a30, 0.28);
    this.scene.add(this.hemi);

    // Static per act — NEVER follows the camera (moving shadow frustum = crawl).
    // Act 1 window key; re-aimed once on entering Act 3.
    this.sun = new THREE.DirectionalLight(0xffc98a, 0.9);
    this.sun.position.set(-13, 6.5, 1);
    this.sun.target.position.set(0, 1.2, -1);
    this.sun.castShadow = !this.isMobile;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.camera.left = -12;
    this.sun.shadow.camera.right = 12;
    this.sun.shadow.camera.top = 12;
    this.sun.shadow.camera.bottom = -12;
    this.sun.shadow.camera.far = 60;
    this.sun.shadow.bias = -0.0001;
    this.sun.shadow.normalBias = 0.05;
    this.scene.add(this.sun, this.sun.target);

    // Desk lamp: the Act 1 macro key. Fixed values — no per-frame modulation.
    this.deskLamp = new THREE.SpotLight(0xffc078, 10, 14, 0.62, 0.72, 1.6);
    this.deskLamp.position.set(2.6, 3.28, -0.9);
    this.deskLamp.target.position.set(0, DESK_Y, 0);
    this.scene.add(this.deskLamp, this.deskLamp.target);

    // Factory key + fill + static cool edge light.
    this.factoryCool = new THREE.DirectionalLight(0x9fb4c8, 0.35);
    this.factoryCool.position.set(-8, 9, -44);
    this.factoryCool.target.position.set(2, 0, -52);
    this.scene.add(this.factoryCool, this.factoryCool.target);
    this.emberSpot = new THREE.SpotLight(0xff7a2f, 28, 34, 0.85, 0.75, 1.5);
    this.emberSpot.position.set(0, 6.6, -51);
    this.emberSpot.target.position.set(0, 0.6, -51);
    this.scene.add(this.emberSpot, this.emberSpot.target);
    this.factoryFill = new THREE.HemisphereLight(0x8a959e, 0x2e2823, 1.0);
    this.scene.add(this.factoryFill);

    // Home key.
    this.homeSpot = new THREE.SpotLight(0xffb45e, 20, 26, 0.7, 0.65, 1.5);
    this.homeSpot.position.set(-2.5, 6.5, -95.5);
    this.homeSpot.target.position.set(1.5, 0.8, -99.5);
    this.scene.add(this.homeSpot, this.homeSpot.target);

    const studio = buildStudio();
    this.miniature = studio.userData.miniature;
    this.deskSet = studio.userData.deskSet;
    this.scene.add(studio);
    this.scene.add(buildCorridor());
    this.factory = buildFactory();
    this.scene.add(this.factory);
    this.home = buildHome();
    this.scene.add(this.home);

    // Gold dust along the flight path.
    const count = this.isMobile ? 200 : 420;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 1] = Math.random() * 6 + 0.3;
      pos[i * 3 + 2] = 6 - Math.random() * 106;
    }
    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particles = new THREE.Points(
      pgeo,
      new THREE.PointsMaterial({
        color: 0xffc978, size: 0.055, sizeAttenuation: true,
        transparent: true, opacity: 0.5, depthWrite: false,
      }),
    );
    this.scene.add(this.particles);

    // Factory sparks, off the camera centre line.
    const scount = this.isMobile ? 60 : 120;
    const spos = new Float32Array(scount * 3);
    this.sparkVel = new Float32Array(scount * 2);
    for (let i = 0; i < scount; i++) {
      spos[i * 3] = 2.5 + (Math.random() - 0.5) * 4;
      spos[i * 3 + 1] = 1.4 + Math.random() * 1.1;
      spos[i * 3 + 2] = -51 + (Math.random() - 0.5) * 2.4;
      this.sparkVel[i * 2] = 0.5 + Math.random() * 1.2;
      this.sparkVel[i * 2 + 1] = Math.random() * Math.PI * 2;
    }
    const sgeo = new THREE.BufferGeometry();
    sgeo.setAttribute('position', new THREE.BufferAttribute(spos, 3));
    this.sparks = new THREE.Points(
      sgeo,
      new THREE.PointsMaterial({
        color: 0xff9a3d, size: 0.05, sizeAttenuation: true,
        transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );
    this.scene.add(this.sparks);

    // Shadow maps freeze unless the reveal is active — static shadows
    // cannot shimmer. The loop toggles needsUpdate (see below).
    this.renderer.shadowMap.autoUpdate = false;

    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  setProgress(p: number) {
    this.target = THREE.MathUtils.clamp(p, 0, 1);
  }

  /** Instant jump — use under cover of opaque sections (cold open, cards). */
  snapTo(p: number) {
    this.progress = this.target = THREE.MathUtils.clamp(p, 0, 1);
    this.forceShadow = true;
  }

  private onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const elapsed = this.clock.getElapsedTime();

    this.progress += (this.target - this.progress) * (1 - Math.exp(-delta * 4));
    // Snap when settled: a truly static camera can't shimmer.
    if (Math.abs(this.target - this.progress) < 1e-4) this.progress = this.target;
    const s = samplePath(this.progress);
    const p = this.progress;

    this.camera.position.copy(s.pos);
    this.camera.lookAt(s.look);

    (this.scene.fog as THREE.FogExp2).color.copy(s.fogColor);
    (this.scene.fog as THREE.FogExp2).density = s.fogDensity;
    (this.scene.background as THREE.Color).copy(s.fogColor);

    if (p < 0.36) {
      // --- Act 1: bright studio. Static lights only — nothing modulated. ---
      const rt = revealT(p);
      this.miniature.visible = true;
      this.miniature.scale.setScalar(Math.max(s.scale, 0.001));
      this.miniature.position.y = DESK_Y * (1 - rt);
      // Desk shrinks away smoothly by rt 0.6 — a group transform, so no
      // material pop and nothing winks out in a single frame.
      const sink = THREE.MathUtils.smoothstep(Math.min(rt / 0.6, 1), 0, 1);
      this.deskSet.visible = sink < 1;
      this.deskSet.scale.setScalar(Math.max(1 - sink, 0.001));
      this.deskSet.position.y = -sink * 3.4;

      this.deskLamp.visible = true;

      // Sun frozen for Act 1 (set once below on first entry, never per frame).
      this.sun.visible = true;
      this.sun.color.setHex(0xffc98a);
      this.sun.intensity = 1.0;
      if (!this.sunSet1) {
        this.sun.position.set(-13, 6.5, 1);
        this.sun.target.position.set(0, 1.2, -1);
        this.sunSet1 = true;
        this.sunSet3 = false;
      }

      this.ambient.intensity = 0.3;
      this.hemi.intensity = 0.42;
      this.emberSpot.visible = false;
      this.factoryFill.visible = false;
      this.factoryCool.visible = false;
      this.homeSpot.visible = false;
      this.factory.visible = p > 0.3;
      this.home.visible = false;
    } else if (p < 0.72) {
      // --- Act 2: factory, lifted out of the cave ---
      this.miniature.visible = false;
      this.deskSet.visible = false;
      this.deskLamp.visible = false;
      this.sun.visible = false;
      this.factory.visible = true;
      this.home.visible = false;
      this.emberSpot.visible = true;
      this.factoryFill.visible = true;
      this.factoryCool.visible = true;
      this.homeSpot.visible = false;

      this.emberSpot.position.set(0, 6.6, s.look.z + 1);
      this.emberSpot.target.position.set(0, 0.6, s.look.z);
      this.ambient.intensity = 0.35;
      this.hemi.intensity = 0.3;
    } else {
      // --- Act 3: home ---
      this.miniature.visible = false;
      this.deskSet.visible = false;
      this.deskLamp.visible = false;
      this.factory.visible = true;
      this.home.visible = true;
      this.factoryFill.visible = false;
      this.factoryCool.visible = false;
      this.emberSpot.visible = false;

      // Sun frozen for Act 3 (set once on entry, never per frame).
      this.sun.visible = true;
      this.sun.color.setHex(0xffb45e);
      this.sun.intensity = 0.9;
      if (!this.sunSet3) {
        this.sun.position.set(-9, 7, -97);
        this.sun.target.position.set(1.5, 0.8, -101);
        this.sunSet3 = true;
        this.sunSet1 = false;
      }

      this.homeSpot.visible = true;
      this.homeSpot.position.set(-2.5, 6.5, s.look.z + 4.5);
      this.homeSpot.target.position.set(1.5, 0.8, s.look.z - 1);
      this.homeSpot.intensity = 20;

      this.ambient.intensity = 0.2;
      this.hemi.intensity = 0.28;
    }

    (this.particles.material as THREE.PointsMaterial).opacity = 0.3 + s.warmth * 0.25;

    const arr = this.particles.geometry.attributes.position;
    for (let i = 0; i < arr.count; i += 4) {
      arr.setY(i, arr.getY(i) + Math.sin(elapsed * 0.8 + i) * delta * 0.1);
    }
    arr.needsUpdate = true;

    const sparkOn = p > 0.38 && p < 0.72;
    (this.sparks.material as THREE.PointsMaterial).opacity = sparkOn ? 0.35 : 0;
    if (sparkOn) {
      const sp = this.sparks.geometry.attributes.position;
      for (let i = 0; i < sp.count; i++) {
        let y = sp.getY(i) - this.sparkVel[i * 2] * delta;
        if (y < 1.3) y = 2.4 + Math.random() * 0.3;
        sp.setY(i, y);
        sp.setX(i, sp.getX(i) + Math.sin(elapsed * 3 + this.sparkVel[i * 2 + 1]) * delta * 0.22);
      }
      sp.needsUpdate = true;
    }

    const scanBar = this.factory?.userData.scanBar as THREE.Mesh | undefined;
    if (scanBar && this.factory.visible) {
      scanBar.position.y = 1.55 + (Math.sin(elapsed * 2) * 0.5 + 0.5) * 0.45;
    }
    const holo = this.factory?.userData.holo as THREE.Mesh | undefined;
    if (holo && this.factory.visible) {
      holo.position.y = 2.15 + Math.sin(elapsed * 1.2) * 0.05;
    }

    // Shadows re-render only while progress is actually changing (or right
    // after a teleport). A settled frame keeps a frozen shadow map: static
    // shadows cannot shimmer.
    this.renderer.shadowMap.needsUpdate =
      Math.abs(this.target - this.progress) > 1e-4 || this.forceShadow;
    this.forceShadow = false;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry?.dispose();
      const pts = o as THREE.Points;
      if (pts.isPoints) pts.geometry.dispose();
    });
    disposeAll();
    this.renderer.dispose();
  }
}
