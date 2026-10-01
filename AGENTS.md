## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Journey page (`/journey`) — anti-flicker methodology

Hard-won rules from debugging this page. Follow them when touching `src/lib/journey/` or `src/pages/journey.astro`, or the shimmer comes back.

### Architecture

- Procedural Three.js rooms (studio → factory → home) on a fixed full-viewport canvas; HTML sections scroll above it. Camera pose is driven per scroll segment via `exp.setProgress()` (see page script). Fog color/density lerps ARE the act transitions.
- The scroll track must be **transparent** wherever the canvas should show. Solid `bg-ink` belongs only on intro/cards/lineup/finale sections. An opaque track buries the canvas completely (this happened once — "just text" bug).

### Exposure discipline (no blowouts)

- `toneMappingExposure` fixed at `1.0`. Never lerp it.
- Caps: ambient ≤ 0.35, hemi ≤ 0.42, key dir ≤ 1.0, accent spots single-digit with real falloff.
- All emissives ≤ 1.2 and tone-mapped. Never use `toneMapped={false}` on emissive planes (they bloom into white smears under ACES).
- No UnrealBloom pass. Vignette + grain live in CSS.

### Flicker: the coplanar rule (the big one)

- Only **front-facing vs front-facing** coplanar surfaces shimmer. Box bottom faces are backface-culled from above, so legs/pots/books/panels sitting on floors are inherently safe — don't "fix" them.
- Real case: the miniature room floor and the desk top both sat at exactly `y=1.06` over a 1.92²-unit overlap, center of the macro frame. Fix was dropping the desk top 0.04, not touching lights.
- Keep ≥0.02–0.04 separation between any two front-facing planes (art vs frames, glow vs walls, model floor vs desk). Adjacent floors must **edge-touch** (zero overlap area), never overlap — overlapping floor planes shimmer across the whole strip.

### Flicker: motion discipline

- No per-frame light modulation. Set intensities on act entry; static values only.
- Sun position/target is set **once per act** (see `sunSet1`/`sunSet3` flags). A shadow frustum that follows the camera crawls texels across flat walls.
- Shadow maps frozen unless progress is actually changing (`needsUpdate` gated on progress delta + a `forceShadow` flag consumed on snap/teleport). Static shadows cannot shimmer.
- Camera snaps to target within epsilon (`1e-4`) — damped follow never truly settles otherwise, and eternal micro-drift keeps shadows and mipmaps crawling.
- `normalBias` 0.05 (grazing-angle acne on floors), camera `near` 0.12 (0.05 destroys depth precision at room distances).
- No Bokeh/bloom passes — Bokeh's depth pre-pass doesn't respect transparency, so drifting dust punches moving holes in it. Deleted, not gated.
- Nothing that casts shadows may move per frame (pendant sway was deleted for this reason). Dust/sparks may drift — they're shadowless Points.
- Never `visible`-toggle or move large meshes mid-flight; shrink groups via transform if something must leave, and delete meshes near the camera corridor instead of relocating them.

### Flicker: voids kill transitions too

- Every camera path segment must contain geometry. A 29-unit gap with only fog reads as a "random white room"; a flight ending 1 unit short of a wall reads as staring at black.
- Fixes that worked: corridor tunnel bridging studio doorway → factory floor, home floor edge-touching factory floor, doorways cut in every wall the flight passes through, hold poses aimed at content (the table), never at walls.

### Verification

- `tsc --noEmit`, `npm run build`, then curl `?beat=model|room|lineup|factory|home` (all must 200).
- Judge motion with eyes, not code: hold still on `?beat=model` (settled frame must be byte-identical — any crawl is a live bug), then scroll each flight. Hard-refresh first (`Cmd+Shift+R`) — a stale tab mimics every fixed bug.
