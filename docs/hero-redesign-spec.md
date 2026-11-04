# Portfolio Redesign — Technical Design Specification

**Project:** `rahat-portfolio` (Vite · React 18 · TypeScript · Tailwind 3 · GSAP 3)
**Scope:** The full one-page site — Hero + 3D scene (§1–16), Work (§3.5, §11.2, §15), About (§17), page-wide rules (§18), Stack (§19), Experience (§20), Contact + Footer (§21). Build in that order, one section at a time.
**Status:** Design approved — ready for implementation
**Design source:** Design canvas "Rahat's Digital Lab — Hero Concept" (artboards 01 Desktop hero, 02 Mobile hero, 04 Visual direction, 05 Interaction & scroll journey, 06 Selected work desktop, 07 Selected work mobile, 08 Selected work scroll states, 09–10 About, 11–12 Stack, 13–14 Experience, 15–16 Contact + footer)

> Note for the implementer: this is a specification, not code. Where a value is given, treat it as the target. Where a choice is left to you, it is marked **[impl choice]**. Do not invent copy, stats or project facts — anything unknown is marked `[PLACEHOLDER]`.

---

## 0. Summary of changes to the existing codebase

| Area | Today | After |
|---|---|---|
| `Hero.tsx` | Centered name, char-flip animation, typewriter card, social icons | Two-column hero: copy left, real-time 3D scene right |
| `AnimatedBackground.tsx` | 3 blurred blobs + 12 CSS particles | **Remove.** Replaced by the 3D scene and one soft key-light glow |
| `TypewriterCode.tsx` | Console card | **Remove** |
| `CursorDot.tsx` | Custom cursor | **Remove** (native cursor) |
| `Preloader.tsx` | Blocks the page until done | **Remove.** The hero's own intro sequence replaces it |
| `Projects.tsx` | 2-column grid, 5 projects (3 "concept" with stock photos) | Pinned horizontal-scroll section, 3 cards (CAFM Platform, Barberly, `[PLACEHOLDER]` project 03) |
| `index.css` tokens | Indigo `#6366F1` accent, `#0B0F19` background | New "Graphite Lab" tokens (section 5) |
| Font | System sans | Geist + Geist Mono |
| Section order in `App.tsx` | Hero → About → Skills → Projects → Experience → Contact | Hero → **Projects (Work)** → About → Skills → Experience → Contact |
| AOS | Used across sections | Do not use AOS inside Hero or Work. Other sections may keep it **[impl choice]** |

**Confidentiality rule:** the client name "Equidesk" must not appear anywhere on the site (copy, alt text, file names, image content). The project is always called **"CAFM Platform"**.

---

## 1. Overall experience goal

The site should feel like stepping into Rahat's working system, not like reading a CV.

- **Message in the first 3 seconds:** *Rahat is a full-stack developer who builds complete business platforms — from the interface to the system behind it.*
- **The 3D scene is the résumé.** A holographic placeholder of Rahat stands at the centre of a working product: the Interface, API, Services and Database are connected around him by live data. It visualises "full stack" instead of listing it.
- **Scroll is a journey.** Scrolling moves the camera into the scene, the floating panels hand over to real project cards, and the work section scrolls sideways.
- **Tone:** Apple product reveal pacing, Linear's restraint, Vercel's black-and-white confidence. Calm, precise, premium.
- **Must avoid:** rotating cubes, tech-logo clouds, neon, cyberpunk/gaming HUDs, glitch text, purple-to-blue gradient washes, typewriter effects.

**Success criteria**
1. The headline is readable and the primary CTA is clickable within 1.5 s on a mid-range laptop, regardless of 3D load state.
2. The 3D scene never blocks content — it loads progressively behind a matching static poster.
3. 60 fps on a 2020+ laptop with integrated graphics; no jank during scroll.
4. Fully usable with `prefers-reduced-motion`, keyboard only, and on WebGL-less devices.

---

## 2. Hero section structure

### 2.1 Component tree **[names are suggestions]**

```
<HeroSection id="hero">               — pinned scroll container (desktop)
  <HeroBackdrop />                    — key-light glow (DOM, CSS radial)
  <SiteHeader />                      — logo + nav (existing Header.tsx, restyled)
  <HeroGrid>
    <HeroCopy />                      — label, H1, lead, CTAs, proof line
    <HeroStage>                       — square box holding the scene
      <ScenePoster />                 — static image, same composition, shown until canvas is ready
      <LabCanvas />                   — React Three Fiber canvas (lazy)
      <GlassPanel variant="deploy" /> — DOM overlay
      <GlassPanel variant="schema" /> — DOM overlay
  <HeroHUD />                         — chapter counter, location/status, scroll cue
<WorkSection id="projects">           — pinned horizontal track (desktop)
```

### 2.2 Content (exact copy)

| Element | Copy |
|---|---|
| Logo mark | `RC` (monospace, in 32×32 outlined square) + "Rahat Chowdhury" |
| Nav | Work → `#projects` · Stack → `#skills` · Experience → `#experience` · Contact → `#contact` |
| Label | `FULL-STACK DEVELOPER` |
| H1 | "I build business platforms, **from the interface to the system behind it.**" — second clause in tertiary grey |
| Lead | "5+ years building full-stack SaaS end to end: dashboards, booking and facilities management, with clear UX and code that stays maintainable after launch." |
| Primary CTA | "Enter the lab" → scrolls to `#projects` (via the scroll timeline, see §11) |
| Secondary CTA | "Download résumé" → `/assets/resume.pdf` (new tab) |
| Proof line | "Recently shipped — CAFM platform · Barberly" |
| HUD left | "01 / 04 — Jashore, BD · Open to product work & freelance" |
| HUD right | "Scroll" + vertical progress tick |
| Panel A (deploy) | title `deploy / main`; rows `test — passed`, `build — passed`, `release — live` |
| Panel B (schema) | title `work_orders`; rows `id uuid`, `asset_id → assets`, `status enum` |
| Node labels | `INTERFACE`, `API`, `SERVICES`, `DATABASE` |

Social links (GitHub, LinkedIn, Email) move out of the hero into the footer/contact. Keep the existing URLs.

### 2.3 Chapter counter mapping

The HUD shows `NN / 04`:

| Chapter | Sections |
|---|---|
| 01 | Hero |
| 02 | Selected work (`#projects`) |
| 03 | About + Skills + Experience |
| 04 | Contact |

---

## 3. Exact layout measurements

Reference frame: **1440 × 900** desktop. All values in CSS px unless noted. The page is fluid; measurements are at 1440 wide.

### 3.1 Desktop (≥ 1280 px)

| Element | Spec |
|---|---|
| Hero section | `min-height: 100svh` (min 760 px); flex column: header / grid (flex 1) / HUD |
| Content container | `max-width: 1440px`, centred, horizontal padding **64** |
| Header | padding **28** top/bottom; logo left, nav right; nav links padding 12×14, gap 4; min hit area 44 px |
| Hero grid | 2 columns `1fr 1fr`, gap **48**, `align-items: center` |
| Copy column | max-width **560**; vertical gap **32** between label / H1 / lead / CTAs / proof line |
| Lead paragraph | max-width **490** |
| CTA row | gap **12**; buttons height **50**, horizontal padding 24 (primary) / 22 (secondary), radius 999 |
| Stage (scene box) | width 100% of column, `aspect-ratio: 1/1`, **max-height 680**; reserve this box before any 3D loads (zero CLS) |
| Panel A (deploy) | width **184**; anchored `top: 6%`, `right: 0` of the stage |
| Panel B (schema) | width **200**; anchored `bottom: 4%`, `left: 0` of the stage |
| Panels inner | padding 14 × 16, row gap 6–7, radius **12** |
| HUD | padding 24 top / 32 bottom / 64 sides; space-between |
| Key-light glow | absolute; right −6%, top −10%; 62% × 80% of hero; see §6 |

### 3.2 Laptop (1024–1279 px)

- Side padding **48**, grid gap **32**
- H1 **56 px**; lead 17 px
- Stage max-height 560
- Panel widths × 0.9

### 3.3 Tablet (768–1023 px)

- Single column. Stage first (max-width **520**, centred), copy below.
- H1 **48 px**; side padding 32.
- Panel B hidden; Panel A stays.
- No pinning — see §12.

### 3.4 Mobile (< 768 px) — reference 390 × 844

| Element | Spec |
|---|---|
| Side padding | **20** |
| Header | padding 16 × 20; logo mark 44×44; menu button 44×44 round, outlined |
| Scene | full width, height **330**, placed above copy, overlapping header area by −6 px |
| Copy gap | **18** |
| Label | 11 px |
| H1 | **34 px** / 1.05 |
| Lead | 16 px / 1.55 — shortened to: "5+ years building full-stack SaaS end to end." |
| CTAs | full width, stacked, height **52**, gap 10 |
| Proof line | hidden |
| HUD | absolute bottom 18, sides 20; "01 / Entrance" left, "Jashore, BD · Open to work" right; 10 px |
| Glass panels | hidden |

### 3.5 Work section (desktop)

| Element | Spec |
|---|---|
| Top bar | padding 32 × 64; `02 / 04 — Selected work` left; the right-hand text on the artboard (`Pinned · scroll down moves sideways`) is a design annotation — **do not ship it**; leave the right side empty |
| Grid | columns `360px 1fr`, gap **64**, left padding 64, right padding 0 (track bleeds off-screen) |
| Left column | gap 28: eyebrow `SELECTED WORK` (label token, signal); H2 52 px "Products I've built **end to end.**"; lead 16 px max-width 320 "From database schema to deployed interface. Each one shipped and used by real teams."; row: counter `01` (40 px mono) + `/ 03`, 1 px × 32 divider, "Scroll →" (12 px mono) |
| Track | flex row, gap **24**, right padding 64 |
| Card | width **600**, padding 16 / 16 / 24, radius **20**, bg `--surface-card`, 1 px border 8% white; vertical gap 24 |
| Card image | height **360**, radius 12, with a 34 px top bar showing a mono path label (e.g. `cafm / dashboard`, `barberly / bookings`) |
| Card text (padding 0 8) | category line mono 11 px uppercase tertiary (`01 · SaaS · Facilities management`); title 26 px; description 15 px, max-width 420 |
| Card tags | row of pill tags: mono 12 px, padding 6 × 10, 1 px border 8%, gap 8 |
| Card link button | 44 × 44 round outlined, top-right of text block, `aria-label` required |
| Progress bar | bottom, padding 36 × 64 × 40, gap 24; 1 px track 10% white, fill `--text-primary`; "More on GitHub" link right (→ github.com/asadullahchowdhury) |

**Card states (artboard 08)**
- Default: border 8%, image scale 1.
- Hover (pointer: fine): card lifts −4 px, border 16%, background `#0E131B`, image scales to 1.03 inside its mask, arrow button fills `--text-primary` with dark icon. 240 ms, `ease-lab`.
- Focus-visible: 2 px `--signal` outline, offset 3 px; focusing a card scrolls the track so it's fully in view.
- Passing behind the left column: cards whose right edge is left of the track's start fade to 40% opacity (scrubbed).

**Mobile (artboard 07, < 768 px):** no pin. Padding 40 / 20 / 48, gap 28. Header block: HUD line 10 px, H2 34 px, lead 15 px ("From database schema to deployed interface."). Cards full width, padding 12 / 12 / 20, radius 18, image height 220, title 22 px, description 14 px (shortened), tags 11 px. Arrow button sits beside the title. Ends with a full-width 52 px outlined "More on GitHub" button.

---

## 4. Typography hierarchy

**Families**
- **Geist** (sans) — the human voice: headings, body, buttons.
- **Geist Mono** — the machine voice: labels, HUD, node labels, panels, counters, meta lines. Always uppercase when used as a label.

Self-host via the `geist` npm package or Google Fonts **[impl choice]**. Preload the 400 and 500 woff2 for both. `font-display: swap`.

| Token | Family | Size / line-height | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| `display-xl` (Hero H1) | Geist | 64 / 1.02 | 500 | −0.045em | primary; 2nd clause tertiary |
| `display-lg` (Section H2) | Geist | 52 / 1.02 | 500 | −0.04em | primary; 2nd clause tertiary |
| `title` (card) | Geist | 24 / 1.2 | 500 | −0.02em | primary |
| `lead` | Geist | 18 / 1.6 | 400 | 0 | secondary |
| `body` | Geist | 15–16 / 1.55 | 400 | 0 | secondary |
| `button` | Geist | 15 / 1 | 500 | 0 | per button |
| `nav` | Geist | 14 / 1 | 400 | 0 | secondary; active/hover primary |
| `label` (eyebrow) | Geist Mono | 12 / 1 | 400 | +0.14em, uppercase | signal |
| `mono-sm` (proof, meta) | Geist Mono | 12 / 1.4 | 400 | +0.04em | tertiary; project names `--text-body` |
| `hud` | Geist Mono | 11 / 1 | 400 | +0.12em, uppercase | tertiary |
| `panel` | Geist Mono | 11.5 / 1.5 | 400 | 0 | body; keys signal |
| `node-label` (3D) | Geist Mono | 10.5 px equivalent | 400 | +0.08em, uppercase | tertiary |
| `counter` | Geist Mono | 40 / 1 | 400 | −0.03em | primary |

Responsive H1: 64 → 56 (laptop) → 48 (tablet) → 34 (mobile). Use `clamp()` **[impl choice]**.

---

## 5. Color system — "Graphite Lab"

Replace the current tokens in `index.css` and map Tailwind names to them.

| Token | Value | Use |
|---|---|---|
| `--bg-void` | `#07090D` | Page background, fog colour |
| `--bg-graphite` | `#11161F` | Raised surfaces, node fill, image placeholders |
| `--surface-card` | `#0C1017` | Project cards, storyboard frames |
| `--text-primary` | `#EDEFF3` | Headings, primary button fill |
| `--text-body` | `#C9CFDA` | Body inside cards/panels |
| `--text-secondary` | `#A3ACBC` | Lead, nav, secondary copy |
| `--text-tertiary` | `#7A8396` | HUD, labels, de-emphasised clause |
| `--signal` | `#9CC9FF` | The only light colour: hologram, data lines, eyebrow, panel keys |
| `--signal-soft` | `#CFE4FF` | Hologram outline / rim |
| `--ember` | `#F2B27A` | "Live / available" only — max 2–3 uses per screen |
| `--border-subtle` | `rgba(255,255,255,0.08)` | Card and panel borders |
| `--border-strong` | `rgba(255,255,255,0.14)` | Secondary button, icon buttons |
| `--glass-fill` | `rgba(255,255,255,0.03)` | Glass panel fill |

Mapping to existing variables: `--bg-primary → --bg-void`, `--bg-secondary → --bg-graphite`, `--text-primary` stays, `--text-secondary → #A3ACBC`, `--accent → --signal`, `--border-subtle` stays.

**Buttons**
- Primary: fill `--text-primary`, text `--bg-void`. Hover: fill `#FFFFFF`.
- Secondary: transparent, 1 px `--border-strong`, text `--text-primary`. Hover: border 28% white.
- Focus (all interactive): 2 px outline `--signal`, offset 3 px.

**Rules**
- No gradients as decoration. The only gradients allowed are light falloff (key-light glow, light cone, pad glow, hologram fade).
- No purple. No second accent hue.
- Contrast: all text ≥ 4.5:1 on `--bg-void` (tertiary `#7A8396` ≈ 5:1). Verify with a checker after implementation.

---

## 6. Lighting style

One cool key light, a quiet rim, and light-as-information. It should look like an architectural model photographed at night.

**DOM layer (behind the canvas)**
- Key-light glow: radial gradient, `rgba(156,201,255,0.08)` at centre → transparent at 70%, positioned upper-right of the hero (§3.1). Static.

**3D scene lighting**

| Light | Type | Position (world) | Colour | Intensity |
|---|---|---|---|---|
| Ambient | ambient / hemisphere | — | `#AFC4E0` sky / `#07090D` ground | 0.25 |
| Key | directional | (4, 6, 3) | `#DCEBFF` | 0.8 |
| Rim | directional | (−3, 2, −4) | `#9CC9FF` | 0.4 |
| Hologram | emissive (material) | — | `#9CC9FF` | — |

- **No real-time shadows.** If a contact shadow is wanted under the platform, bake it into a texture.
- **Tone mapping:** ACES Filmic; output sRGB.
- **Bloom:** selective, only on emissive items (hologram, packets, pad glow). Threshold ≈ 0.8, intensity ≈ 0.6, radius ≈ 0.4. Must stay subtle — if it looks "glowy", lower it.
- **Fog:** linear, colour `#07090D`, near 6, far 16 (world units).
- **Hologram behaviour:** gentle flicker under 3% opacity variance, never strobing.

---

## 7. 3D scene description

### 7.1 Composition (matches artboard 01)

- World: Y-up, metres-like units. The platform sits at y = 0, centred at the origin.
- The hologram stands on the platform, roughly 2.2 units tall (head top ≈ y 2.2).
- A light cone rises from the platform pad, wider at the top, fading to nothing above the head.
- One elliptical orbit circles the hologram at about chest height (y ≈ 0.9), radius x ≈ 3.2, z ≈ 1.6, tilted so the front of the ellipse is lower on screen than the back.
- Four nodes sit on that orbit; data packets travel along it.
- 300–600 dust particles fill the volume.
- Two glass panels float in front as DOM overlays (upper-right and lower-left of the stage).

### 7.2 Camera

| Property | Rest (scroll 0) | End of dolly (scroll 0.35) |
|---|---|---|
| Type | Perspective | — |
| FOV | 35° | 28° |
| Position | (0, 1.4, 7.5) | (0, 1.3, 4.2) |
| Look-at | (0, 1.1, 0) | (0, 1.2, 0) |

At rest, the composition must match artboard 01: hologram centred in the stage, platform ellipse in the lower third, `INTERFACE` node at the far left edge and `SERVICES` at the far right edge.

### 7.3 Node placement on the orbit

Angles measured on the orbit ellipse; 0° = right of screen, counter-clockwise viewed from above.

| Node | Angle | Screen position (approx., on 640-unit stage) |
|---|---|---|
| INTERFACE | 180° | far left, mid-height |
| API | ~125° (back-left) | upper-left |
| SERVICES | 0° | far right, mid-height |
| DATABASE | ~300° (front-right) | lower-right |

Data flows Interface → API → Services → Database.

---

## 8. 3D objects required

| # | Object | Geometry | Material / shader | Notes |
|---|---|---|---|---|
| 1 | **Platform outer ring** | thin line loop (or torus, tube 0.004), radius 3.1, flattened to the floor | unlit, white 7% opacity | draws in on load |
| 2 | **Platform inner ring** | line loop radius 1.5 | unlit, `--signal` 35% opacity | draws in on load |
| 3 | **Pad glow** | disk radius 1.2 on the floor | additive, radial alpha texture, `--signal` 35% → 0 | blooms |
| 4 | **Light cone** | open cone/cylinder, bottom radius ~0.9, top radius ~1.5, height ~3.2 | additive, vertical alpha 0.14 → 0, double-sided, no depth write | grows upward on load |
| 5 | **Hologram (placeholder)** | low-poly head-and-shoulders bust **or** a camera-facing plane with a silhouette alpha mask **[impl choice; plane is cheaper]** | custom shader: horizontal scanlines, fresnel rim (`--signal-soft`), vertical fade (15% at top → 100% at 35% down), base opacity 0.6, flicker, `uReveal` 0→1 for scan-in | see §8.1 |
| 6 | **Orbit line** | ellipse line, rx 3.2, rz 1.6, y 0.9 | unlit, `--signal` 22% | draws in on load |
| 7 | **Nodes ×4** | rounded box 0.24³ (radius 0.05) + small emissive dot on the front face | matte `--bg-graphite`, edges `--signal` 60% (edge lines or rim shader) | instanced; hover state +emissive |
| 8 | **Node labels ×4** | text sprites / drei `Text` (Geist Mono) | `--text-tertiary`; hover `--text-primary` | always face camera |
| 9 | **Data packets ×2–3** | spheres r 0.025 | emissive `#EDF4FF` | travel along orbit; bloom |
| 10 | **Dust particles** | `Points`, 300–600 (desktop) / 120 (mobile) | round sprite, size 1–1.5 px, opacity 0.3–0.5, `#C9D8EE` | slow upward drift |
| 11 | **Glass panels ×2** | **DOM**, not WebGL (crisp text, accessible) | fill 3% white, 1 px border 8%, radius 12, `backdrop-filter: blur(12px)` | parallax layers (§10) |

### 8.1 Hologram — now and later

- **Now (placeholder):** neutral, gender-neutral head-and-shoulders silhouette. No face detail. It should read as "a person is projected here", not as a character.
- **Later (real portrait):** swap the mask/texture for Rahat's transparent portrait PNG. The same shader applies: luminance → scanline intensity, alpha from the PNG, same rim, fade and flicker. Build the shader so the swap is changing **one texture input**, with no other code changes.
- Portrait asset requirements: see §14.

---

## 9. Animation timeline

### 9.1 Intro sequence (on first load)

There is no preloader. The DOM copy animates immediately. The 3D intro starts when the canvas is ready; until then the static poster is visible and crossfades out (300 ms) when the canvas starts.

Easing for all entrances: `cubic-bezier(0.2, 0.7, 0, 1)` (call it `ease-lab`).

**DOM (t = 0 is first paint)**

| t start | Element | Animation | Duration |
|---|---|---|---|
| 200 ms | Header | opacity 0 → 1 | 400 ms |
| 600 ms | Label | opacity 0→1, y 8→0 | 500 ms |
| 800 ms | H1 | per **line**, masked rise (y 100% → 0 inside an overflow-hidden line wrapper), stagger 80 ms | 700 ms |
| 1250 ms | Lead | opacity, y 12→0 | 600 ms |
| 1400 ms | CTAs | opacity, y 12→0, stagger 60 ms | 500 ms |
| 1550 ms | Proof line | opacity | 500 ms |
| 1700 ms | Glass panels | opacity, y 12→0, stagger 120 ms | 600 ms |
| 1900 ms | HUD | opacity | 500 ms |

The page must be fully interactive at 0 ms — animations never block clicks.

**3D (t = 0 is canvas ready)**

| t start | Object | Animation | Duration |
|---|---|---|---|
| 0 | Outer + inner platform rings | draw-on (dash offset / progress uniform) | 600 ms |
| 300 ms | Pad glow | opacity 0 → 1 | 600 ms |
| 600 ms | Light cone | scaleY 0 → 1 from the floor | 600 ms |
| 900 ms | Hologram | `uReveal` 0 → 1 (scan from top to bottom, bright scan line at the front edge) | 1200 ms |
| 1200 ms | Nodes | scale 0.6 → 1 + opacity, stagger 90 ms | 500 ms each |
| 1400 ms | Orbit line | draw-on | 800 ms |
| 2200 ms | Packets | start travelling | — |
| 0 | Particles | fade in | 1500 ms |

Total intro ≤ 2.4 s.

### 9.2 Idle loops (after intro)

| Object | Loop |
|---|---|
| Hologram | float y ± 0.03 units, period 6 s, sine; flicker < 3% opacity at random intervals (2–6 s) |
| Packets | move along orbit at ~0.08 revolutions/s, spaced evenly |
| Particles | drift upward 0.02 units/s with slight sideways noise; wrap at top |
| Glass panels | float y ± 4 px, periods 7 s and 9 s (out of phase) |
| Node dots | slow pulse 70–100% emissive, period 3 s, staggered |

All loops stop when `prefers-reduced-motion: reduce` is set.

---

## 10. Mouse interaction behavior

Desktop only (`pointer: fine` and `hover: hover`). Disabled on touch devices.

**Input:** pointer position normalised to −1…1 across the viewport (not just the stage), so the whole hero responds.

| Target | Response to pointer (x, y) | Limits |
|---|---|---|
| Scene root group | rotateY = x × 4°, rotateX = −y × 2.5° | ±4° / ±2.5° |
| Camera | position.x += x × 0.15 | — |
| Hologram (head or whole bust) | yaw toward pointer x × 6°, pitch y × 3° | ±6° / ±3° |
| Glass panel — near layer (Panel A) | translate x × 18 px, y × 12 px | — |
| Glass panel — far layer (Panel B) | translate x × 8 px, y × 5 px | — |
| Key-light glow | translate x × 10 px, y × 6 px | — |

**Smoothing:** frame-rate-independent damping (equivalent to a spring with stiffness ≈ 120, damping ≈ 20 — critically damped, **no overshoot**). Never set values directly from the pointer event.

**Pointer leaves the window:** ease everything back to 0 over ~800 ms.

**Node hover (raycast):**
- Node emissive +40%, label colour → `--text-primary`, its orbit segment brightens to 45% opacity.
- Cursor stays default (nodes are not links).
- No tooltips.

**Scroll interplay:** mouse influence fades from 100% to 0% between scroll progress 0 and 0.35, so the camera move isn't fighting the parallax.

---

## 11. Scroll transition behavior

Use GSAP **ScrollTrigger** (already a dependency through GSAP). Optional smooth scrolling with Lenis, integrated with ScrollTrigger **[impl choice]**. All scroll animations are **scrubbed** (tied to scroll position), so scrolling back reverses everything exactly.

### 11.1 Hero (pinned)

- Pin `#hero` for **220vh** of scroll. Scrub with ~0.6 s lag.
- Progress `p` runs 0 → 1 across the pin.

| p range | What happens |
|---|---|
| 0 → 0.35 | **Step inside.** Copy column: opacity 1 → 0, y 0 → −40 px. HUD fades. Camera dollies from rest to end values (§7.2). Nodes light up in sequence at p = 0.10 (Interface), 0.17 (API), 0.24 (Services), 0.31 (Database): emissive +40% and the packet path between consecutive nodes brightens. |
| 0.35 → 0.80 | **Panels become projects.** Panel A and Panel B move toward the camera (scale 1 → 1.15, translate toward centre) and fade out, while the first two Work cards fade/scale in from the same screen positions. Hologram opacity 0.6 → 0.25. |
| 0.80 → 1.00 | **Hand-off.** Canvas opacity → 0.15 (keep it alive at low cost or pause rendering at 1.0). Work section is now in view. HUD counter switches to `02 / 04`. |

**Implementation note (v1 vs v2):**
- **v1 (ship first):** the panel → card step is a crossfade with matching positions (panels fade/scale out, cards fade/scale in). Low risk.
- **v2 (polish):** true shared-element morph using GSAP Flip from each panel's rect to its card's rect.

### 11.2 Work section (pinned horizontal track)

- Pin `#projects`. Pin length = **(number of cards − 1) × 100vh** (3 cards → 200vh).
- Vertical scroll maps to `translateX` of the track, from 0 to `−(trackScrollWidth − visibleTrackWidth)`.
- Scrub lag ~0.4 s.
- Counter `01 / 03` updates when a card's centre passes the track's left third.
- Progress bar fill = progress (0 → 100%).
- Optional snap to each card **[impl choice]**, gentle (duration 0.3–0.5 s), never fighting the user.
- After the last card, the pin releases and normal vertical scroll continues to About.

### 11.3 Navigation

- "Enter the lab" and the nav "Work" link must land on the **start of the Work section** (i.e. the end of the hero pin), using ScrollTrigger-aware scroll positions — not the element's raw offset, which is wrong while pinned.
- Other nav links scroll to their sections normally.
- Browser back/forward and refreshing mid-page must restore correct pin state (`ScrollTrigger.refresh()` after fonts and images load).

---

## 12. Mobile behavior

Applies below 768 px **or** when `pointer: coarse`.

| Feature | Mobile behaviour |
|---|---|
| Layout | Per §3.4 and artboard 02: scene on top (330 px tall), copy below |
| 3D scene | Same objects, lighter: 4 nodes, orbit, hologram, cone, 120 particles, **no bloom** (or a cheap single-pass glow), DPR capped at 1.5 |
| Glass panels | Hidden |
| Mouse parallax | Off. Optional **[impl choice]**: very subtle device-orientation tilt (±2°), only after a user gesture, off by default |
| Intro sequence | Same order, durations × 0.8 |
| Hero pin | **No pin.** Hero scrolls normally. As it leaves the viewport, the scene fades and slows (rendering pauses when off-screen) |
| Work section | **No horizontal pin.** Cards stack vertically, full width (card width 100%, image height ~220), gap 16. Native horizontal swipe carousel with scroll-snap is an acceptable alternative **[impl choice]** |
| Menu | Header shows logo + 44×44 menu button; existing mobile menu restyled with new tokens |
| HUD | Simplified (§3.4) |

---

## 13. Performance considerations

**Loading**
- The hero's LCP element is the **H1 text**, never the canvas. Target LCP < 2.0 s on 4G mid-range mobile.
- Load the 3D bundle lazily (`React.lazy` + dynamic import) **after first paint**. Show `ScenePoster` (static WebP render of the scene, same framing) in the stage until the canvas has rendered its first frame, then crossfade.
- Remove `Preloader` entirely.
- Bundle budget: the 3D chunk ≤ 250 KB gzipped (three + R3F + drei pieces actually used + postprocessing). Import drei helpers individually.
- Fonts: preload Geist 400/500 and Geist Mono 400 woff2, latin subset only.

**Libraries [recommended]**
- `three`, `@react-three/fiber` **v8.x** (v9 requires React 19 — the project is on React 18), `@react-three/drei` (compatible v9.x), `@react-three/postprocessing` for selective bloom.
- `gsap` ScrollTrigger (+ Flip for v2). Optional `lenis`.

**Rendering**
- DPR clamp `[1, 1.75]` desktop, `[1, 1.5]` mobile. Adaptive DPR: drop resolution when FPS falls (drei `PerformanceMonitor` / `AdaptiveDpr`).
- Instanced meshes for nodes and particles. Share materials.
- No real-time shadows; no environment maps needed.
- Pause the render loop when the hero is out of view (IntersectionObserver) and when the tab is hidden.
- Avoid React state updates per frame — drive animation through refs / uniforms.
- `backdrop-filter` only on the 2 glass panels.

**Fallbacks**
- **No WebGL** or context lost: keep `ScenePoster` permanently; everything else works.
- **`prefers-reduced-motion: reduce`:** no intro animation (everything visible at once), no idle loops, no parallax, **no pinning** (hero and work scroll normally; work cards stack or scroll natively), crossfades ≤ 200 ms only.
- **Low-end detection** (FPS < 40 for 2 s): drop bloom, halve particles, cap DPR at 1.

**Targets**
- 60 fps desktop; ≥ 45 fps mid-range mobile.
- Lighthouse: Performance ≥ 90 desktop / ≥ 80 mobile; Accessibility ≥ 95; CLS < 0.05.

**Accessibility**
- Canvas is decorative: `aria-hidden="true"` on the canvas, plus a visually hidden description of the scene in the stage.
- Glass panel content is decorative — `aria-hidden="true"`.
- All CTAs are real `<a>`/`<button>` elements, ≥ 44 px targets, visible focus ring (§5).
- Pinned sections must not trap keyboard focus; tabbing into a Work card scrolls it into view.

---

## 14. Required assets

| Asset | Spec | Status |
|---|---|---|
| Geist (400, 500) & Geist Mono (400, 500) | woff2, latin subset | Get from the `geist` package or Google Fonts |
| Hologram placeholder | **Option A:** silhouette alpha mask PNG, 1024 × 1024, head-and-shoulders, centred, transparent background. **Option B:** low-poly bust GLB ≤ 60 KB (Draco), neutral, no face detail | To create |
| Real portrait (later) | Transparent PNG, ≥ 1600 px tall, head-and-shoulders, front-facing or slight 3/4, even soft lighting, no harsh shadows, shoulders cut horizontally at the bottom, ~10% headroom | `[PLACEHOLDER]` — Rahat to supply |
| Scene poster | Static render of the 3D scene at rest framing, WebP, 1360 × 1360 (desktop) and 780 × 660 (mobile), ≤ 120 KB / ≤ 60 KB | Render from the finished scene |
| Radial glow texture | 256 × 256 greyscale PNG (or generate procedurally) | To create |
| Particle sprite | 64 × 64 soft round PNG (or procedural) | To create |
| CAFM Platform screenshot | 1600 × 1000 WebP. **Anonymise:** no client name, logo, domain, or real customer data | `[PLACEHOLDER]` — Rahat to supply |
| Barberly screenshot | 1600 × 1000 WebP (existing `barberly.png` can be re-exported) | Exists, needs re-export |
| Project 03 | Title, one-line description, stack, link, 1600 × 1000 screenshot | `[PLACEHOLDER]` — candidates from GitHub: Signmein, Hotel Blue Castle, Farmasale, Saudagar |
| OG / social image | 1200 × 630, uses the new hero composition | To create |
| Résumé | `/assets/resume.pdf` | Exists — check it says "Full-stack developer" |
| Favicon | Monogram "RC" in the new style | Optional |
| Icons | Inline stroke SVG or existing `lucide-react` (arrow, arrow-up-right, menu) | Exists |

**Remove:** `equidesk.png`, `equidesk-with-laptop.png` (and any other file whose name or content shows the client), plus the three Pexels stock images used by the concept projects.

---

## 15. Project data (Work section)

| # | Title | Description | Meta line | Link |
|---|---|---|---|---|
| 01 | CAFM Platform (category: SaaS · Facilities management) | Computer-aided facilities management: assets, work orders and maintenance in one system. | Tags: Laravel · Vue.js · Angular · Full-stack | `[PLACEHOLDER]` case study or none (no public client URL) |
| 02 | Barberly (category: SaaS · Booking & management) | Cloud software that helps barbershops and salons run bookings, staff and payments. | Tags: Vue.js · Node.js · Laravel · Stripe | https://barberly.thethemeai.com |
| 03 | `[PLACEHOLDER]` | `[PLACEHOLDER]` | `[PLACEHOLDER]` | `[PLACEHOLDER]` |

Keep project data in one typed data file so the card count drives the pin length (§11.2) and the counter.

---

## 16. Acceptance checklist

- [ ] No "Equidesk" text or imagery anywhere in the build output.
- [ ] Hero matches artboard 01 at 1440 × 900 and artboard 02 at 390 × 844.
- [ ] H1 + CTAs visible and clickable before the 3D scene loads.
- [ ] Zero layout shift when the canvas replaces the poster.
- [ ] Intro sequence ≤ 2.4 s, in the order of §9.1.
- [ ] Parallax is smooth, damped, no overshoot; resets when the pointer leaves.
- [ ] Hero pin (220vh) and Work horizontal pin behave and fully reverse on scroll-up.
- [ ] "Enter the lab" lands exactly at the start of Work.
- [ ] Mobile: no pins, panels hidden, stacked work cards.
- [ ] Reduced motion: no pins, no loops, no parallax.
- [ ] No WebGL: poster stays, site fully usable.
- [ ] Render loop pauses when off-screen / tab hidden.
- [ ] Lighthouse targets in §13 met.
- [ ] All text passes 4.5:1 contrast; all targets ≥ 44 px; visible focus states.
- [ ] Removed: Preloader, AnimatedBackground, TypewriterCode, CursorDot, concept projects.

---

## 17. About section (artboards 09 desktop, 10 mobile)

Replaces the current `About.tsx` (blob-framed photo + "Clean Code / Innovation / Dedication" icon cards). Chapter `03 / 04`.

**Layout — desktop (max-width 1440, padding 32 / 64 / 96, vertical gap 72)**
1. HUD line: `03 / 04 — About` (hud token).
2. Grid `1.5fr 1fr`, gap 80, `align-items: end`:
   - Left (gap 32): eyebrow `ABOUT` (signal); statement H2 **46 / 1.12, weight 400**, −0.03em — first sentence primary, second sentence tertiary; body 17 / 1.65, max-width 600.
   - Right: portrait figure, aspect 4:5, radius 18, bg `--bg-graphite`, 1 px border `rgba(156,201,255,0.22)` (echoes the hologram); caption row mono 11 px uppercase: "Rahat Chowdhury" left, "Jashore, BD" right.
3. Facts row: 4 equal columns, gap 32; each has a 1 px top rule (12% white), padding-top 22, mono label 11 px + value 22 px / 500. The availability value has an 8 px `--ember` dot.
4. "How I work": mono label, then 3 equal cards (gap 20, padding 28, radius 18, `--surface-card`, border 8%): number mono 12 px signal, title 20 px / 500, text 15 / 1.6 secondary.

**Copy (exact)**
- Statement: "I'm Rahat, a full-stack developer from Jashore, Bangladesh. **I build business platforms end to end, from the database and APIs to the interface people use every day.**"
- Body: "I care about two things: interfaces that feel clear and reliable, and code the next person can read and extend. That's what keeps a product healthy long after launch."
- Facts: Experience — 5+ years · frontend lead → full-stack · Currently — Full-Stack Developer, Codevioso · Focus — SaaS, dashboards, business platforms · Availability — Product work & freelance
- Principles: 01 "The whole system, not one layer" — "Schema, API and interface designed together, so features don't fight each other later." · 02 "Clear for the people using it" — "Reliable, readable interfaces for the teams who live in these tools every day." · 03 "Built to be maintained" — "Readable code and steady collaboration, so the product stays healthy after launch."

**Mobile (< 768):** padding 40 / 20 / 56, gap 32. Order: HUD → statement (28 / 1.18) → portrait (full width, 400 tall) → body (15 px, first sentence only) → facts as a stacked list with rules → principles stacked (padding 20, title 18, shortened text per artboard 10).

**Motion:** no AOS. On entering the viewport: statement reveals by line (same masked rise as the hero H1, 80 ms stagger); portrait fades in with a one-time scanline sweep (reuse the hologram shader as a CSS mask or a short canvas effect **[impl choice]**) — the hologram "becomes" the person; facts and cards fade up 12 px, 60 ms stagger. Reduced motion: none of this.

**Portrait:** uses the same real portrait as the hologram (§14), here shown as a normal photo, cropped 4:5. Until supplied, show the outlined placeholder.

**Career facts (confirmed by Rahat) — use these in Experience too:** Redishketch — Frontend Developer, then Frontend Lead → Codevioso (codevioso.com, Jashore) — Full-Stack Developer, current. Company spelling: **Codevioso**. Job title everywhere: **Full-Stack Developer** (not "Senior"). The current `Experience.tsx` says "Senior Full-Stack Developer, CodeVioso" — change it.

**Note on the current Experience section:** it contains figures like "100k+ users", "100% client satisfaction rate" and "Improved code coverage from 60% to 95%". Keep only numbers Rahat can back up — confirm with him before carrying them into the redesign.

---

## 18. Page-wide rules for all sections

- **Order:** Hero → Work → About → Stack (`#skills`) → Experience → Contact → Footer.
- **Each section has one signature interaction** that reuses the hero's language (light = information, systems connected by lines). Never two big effects in one section.
  | Section | Signature |
  |---|---|
  | Hero | 3D lab, camera dolly |
  | Work | Pinned horizontal track |
  | About | Portrait scanline reveal (hologram → person) |
  | Stack | Pinned exploded layers that assemble |
  | Experience | Commit graph that draws itself |
  | Contact | Request "packet" sent into the platform |
- **Section header pattern:** HUD line (`NN / 04 — Name`, hud token) → eyebrow (signal) → H2 52 px with tertiary second clause → lead 16 px. Desktop padding 32 / 64 / 96; mobile 40 / 20 / 56.
- **No AOS** in redesigned sections. Entrances: lines of H2 masked rise (80 ms stagger), blocks fade up 12 px (60 ms stagger), `ease-lab`, triggered once at 20% into the viewport.
- **Reduced motion:** no pins, no scrubbing, no drawing; content static and visible.

---

## 19. Stack section (artboards 11 desktop, 12 mobile)

Replaces `Skills.tsx` (percentage skill bars). **Remove all percentage levels** — they're unverifiable and read as filler.

**Concept:** the stack as one product in four layers, drawn as an isometric exploded diagram.

**Desktop layout:** grid `0.85fr 1.15fr`, gap 48.
- Left (max-width 480): eyebrow `STACK`; H2 "One product, four layers. **I work across all of them.**"; lead "Tools picked to fit together, so the interface, the application and the data behave like one system."; then a 4-row layer index (each row: 1 px top rule, padding 16, mono number 12 px + name 17 px). The active row is primary with a 28 px signal dash on the right; inactive rows tertiary.
- Right: SVG diagram, aspect 820 : 720. Four isometric slabs (rhombus top + two side faces, ~420 wide × 160 tall, 16 px thick) stacked vertically 150 px apart, dashed vertical guides through the corners and centre. The active slab has a signal-blue edge, slightly lighter top (`#121A26`), cross-hatch and a white centre dot. A thin signal line runs through the centres with a packet dot travelling down. Leader lines from each slab's right corner to mono labels: layer name (11 px) + tools (12.5 px).
- Footer row: `Layer 01 of 04` left; "Scroll to assemble" + 120 px progress line right.

**Layers & tools (from Rahat's GitHub README — keep in sync):**
| # | Layer | Tools |
|---|---|---|
| 01 | Interface | Angular · React · Vue.js · Next.js · Nuxt.js · TypeScript · Tailwind · SCSS · GSAP |
| 02 | Application | PHP · Laravel · Node.js |
| 03 | Data | MySQL · MongoDB |
| 04 | Workflow | Git · Figma |

**Scroll behaviour (desktop):** pin the section for 160vh, scrubbed. At progress 0 the slabs are spread apart (gap 150 px, as drawn). Each quarter of progress activates the next layer (01 → 04): its slab lights up, its index row becomes active, and the packet moves down to it. In the last 20%, the slabs compress to a 24 px gap — one solid stack — and all four labels become fully visible. Hover a layer row (or a slab) to highlight it outside the scroll sequence.

**Mobile:** no pin. HUD, H2 34 px, a small 350 × 220 static diagram (4 slabs, top one active), then 4 layer cards (padding 20, radius 16) with tool chips (mono 12 px, pill, 1 px border 10%). Interface card has a signal border (35%).

---

## 20. Experience section (artboards 13 desktop, 14 mobile)

Replaces `Experience.tsx`. **Remove all current metrics** (100k+ users, 40%, 60%, 15+, 25+, 100% satisfaction, 95% coverage) unless Rahat confirms them.

**Concept:** career as a git commit graph — two branches (Redishketch, Codevioso) merging into `HEAD`.

**Desktop layout:** grid `400px 1fr`, gap 64, `align-items: start`.
- Left (sticky, top 96): eyebrow `EXPERIENCE`; H2 "From frontend **to the full stack.**"; lead "Started on interfaces, led a frontend team, then took ownership of the whole product: database, APIs and UI."; outlined "Download résumé" button (48 px).
- Right: 120 px left gutter holding the graph SVG; role cards stacked with gap 32.
  - Graph: two lanes — Codevioso at x 70, Redishketch at x 30. Redishketch lane (signal 45%, 1.5 px) runs up from the bottom through two commit nodes, then curves into the Codevioso lane and up to the HEAD node. A faint dashed continuation above HEAD (the future). The HEAD node is ember (ring + dot); others signal ring + dot. Vertical mono lane labels at the bottom (`codevioso`, `redishketch`).
  - Nodes align with each card's date line.
  - Card: padding 28 × 32, radius 18, `--surface-card`, min-height 220; date mono 12 px; title 26 px; company line 15 px (company as underlined link where public); description 15 / 1.6 max-width 640; optional highlights list 14 px. Current role card has an ember border (30%) and an ember `HEAD → current` pill.

**Roles (confirmed by Rahat; years marked [ ] need confirming):**
| Period | Title | Company | Description |
|---|---|---|---|
| 2025 — Present | Full-Stack Developer | Codevioso (codevioso.com), Jashore | Building custom web apps, SaaS products and business software end to end, from database design to the shipped interface. |
| [2022 — 2024] | Frontend Lead | Redishketch · promoted from Frontend Developer | Led frontend work on client projects and business platforms, working with design and product teams. |
| [2021 — 2022] | Frontend Developer | Redishketch | Built responsive websites and interfaces for clients, working closely with designers. |

Highlights: `[PLACEHOLDER]` — only real, provable ones.

**Scroll behaviour:** the graph line draws itself as you scroll (stroke-dashoffset scrubbed from the bottom card up — reading order is newest first, so draw from top to bottom **[impl choice — top-down recommended]**). Each node pops (scale 0.6 → 1) as the line reaches it, and its card fades up. No pin.

**Mobile:** single vertical line at left (9 px), 12 px dots, cards to the right (padding 18, radius 14, title 20 px, short descriptions). HEAD dot filled ember. Full-width "Download résumé" at the end.

---

## 21. Contact + Footer (artboards 15 desktop, 16 mobile)

Replaces `Contact.tsx` and `Footer.tsx`. **Keep the existing EmailJS sending logic** — only the UI changes.

**Concept:** the closing chapter. The hero's platform rings return faintly behind the section (bookend), and sending the form "transmits a request" into the platform.

**Desktop layout**
- HUD `04 / 04 — Contact`.
- H2 **104 px / 0.95**, −0.055em: "Let's build **the next one.**"
- Grid `0.9fr 1.1fr`, gap 80:
  - Left (gap 36): lead 18 px "Have a product to build or a platform that needs a steady hand? Tell me what you're working on."; email as a 30 px underlined link (`crahat4@gmail.com`); link list (GitHub, LinkedIn, Résumé) as 56 px rows with top rules and mono hints on the right; status (ember dot "Open to product work & freelance") and "Jashore, Bangladesh · GMT+6" in mono 12 px.
  - Right: glass form panel (padding 32, radius 20, glass fill, border 9%, large soft shadow, blur 14). Header row mono: `POST /contact` · `new_request`. Fields: Name + Email (2 columns), "What are you building?" single-select pill group (SaaS product · Dashboard / admin · Business platform · Website · Something else; selected = filled primary), Message (min 132 px). Footer row: "Replies by email" + primary "Send request →" button.
- Platform bookend: SVG ellipses centred behind the bottom of the section (outer 5% white, inner signal 18%, faint fill).

**Form fields:** real `<label>`s, 48 px inputs, radius 10, fill 2% white, border 12% white; focus border `--signal` + 3 px ring at 25%. Pills are `<button aria-pressed>` inside a `<fieldset>` with a `<legend>`. Include the project type in the EmailJS payload.

**Send interaction (signature):**
1. On submit, the button shows a small progress state (`Sending…`).
2. A glowing packet travels from the button down a thin line into the platform ellipse behind the section (≈ 900 ms).
3. The inner ellipse pulses once (signal, 400 ms), and the form panel header changes to `200 OK · message delivered` with a short thank-you line replacing the form.
4. Error: header shows `Couldn't send — try email instead` in ember, form stays filled.
Reduced motion: skip the packet; show the success state directly.

**Footer:** 1 px top rule. Row: `© 2026 Rahat Chowdhury · Full-stack developer` (mono 12) left; footer nav (Work, About, Experience, Back to top ↑) right. Below, a giant decorative wordmark "Rahat Chowdhury" (168 px, weight 500, −0.06em, colour `#10151D`, cropped by the page bottom, `aria-hidden`). Optional: the wordmark brightens slightly toward the pointer (subtle radial mask).

**Mobile:** HUD, H2 52 px, lead, email 22 px, then the form panel (single-column fields, pills wrap, full-width 52 px submit), link rows, status. Footer: © + "Back to top ↑" row, then wordmark "Rahat" at 76 px.

---

## 22. Open items for Rahat

1. Project 03 — which project, and its details.
2. CAFM Platform — anonymised screenshot and whether a case-study page is wanted.
3. Real portrait — when ready, supply per §14.
4. Confirm the chapter grouping in §2.3.
5. Confirm Redishketch years (Frontend Developer, Frontend Lead) and any provable highlights for each role.
6. Confirm the Stack list (§19) — add anything you use daily that's missing (e.g. PostgreSQL, Docker), remove anything you wouldn't want to be interviewed on.
