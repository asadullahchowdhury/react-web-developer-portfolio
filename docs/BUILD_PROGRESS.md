# Build progress

| Phase | Status | Commit | Notes |
|---|---|---|---|
| 0 Preflight | ☑ | 0eac261 | Inventory below; build passes |
| 1 Foundation | ☑ | 6331d49 | Data files, useReducedMotion, useReveal, SectionHeader, chapter helper |
| 2 Work | ☑ | fdb8eb7 | Pinned horizontal track, stacked mobile, native-scroll fallback |
| 3 About | ☑ | d16afaa | Statement, portrait placeholder + scanline sweep, facts, principles |
| 4 Stack | ☑ | (this commit) | Exploded isometric diagram, 160vh pin, mini diagram + cards on mobile |
| 5 Experience | ☐ | | |
| 6 Contact + Footer | ☐ | | |
| 7 Integration & polish | ☐ | | |
| 8 QA & report | ☐ | | |

## Inventory (Phase 0)

**Built and matching the spec**
- Hero (§2–13): layout, 3D lab scene, intro, parallax, 220vh pin with camera dolly and v1 hand-off, posters, no-WebGL and reduced-motion fallbacks.
- Header + mobile menu, RC logo, favicon set, web manifest.
- Graphite Lab tokens (§5) and Geist / Geist Mono (§4) are global; `ease-lab` exists as a CSS variable, Tailwind `ease-lab` class and GSAP `CustomEase`.
- Lenis + ScrollTrigger as a single instance (`src/lib/scroll.ts`), lazy-loaded after first paint; `ScrollTrigger.refresh()` after fonts / load.
- Section order in `App.tsx` already Hero → Projects → About → Skills → Experience → Contact → Footer.
- Removed earlier: Preloader, AnimatedBackground, TypewriterCode, CursorDot.

**Gaps (old UI still in place)**
- `Projects.tsx`: old 2-column grid with three "concept" projects using remote Pexels images; no horizontal pin (§3.5, §11.2).
- `About.tsx`, `Skills.tsx` (percentage bars), `Experience.tsx` (unverified metrics, "Senior Full-Stack Developer, CodeVioso"), `Contact.tsx`, `Footer.tsx`: old indigo-era UI.
- AOS still used by all of the above and initialised in `App.tsx`.
- `index.html`: old title "Rahat Chowdhury | Web Developer Portfolio", no meta description, no OG image.
- Unused assets: `public/assets/images/project-placeholder.svg`, `meta-logo-rahat.webp`, `me 1.jpg` (6.8 MB, unused).
- No `useReducedMotion` hook, entrance helper, `SectionHeader` or `src/data/*` files yet.

## Decisions
- Phase 0: the owner's uncommitted docs edits (`BUILD_PLAN.md` branch wording, new `CLOUD_BUILD.md`) were committed as `wip: before redesign phases` (cde6a46) after the build passed.
- `dist/` is tracked in this repo, so each phase commit includes a fresh `npm run build` (as `CLOUD_BUILD.md` asks).
- No artboard images exist in `docs/`; visual checks compare against the spec's measurements.
- Playwright and Lighthouse are not installed. Visual checks use the Claude browser pane (screenshots are inspected but cannot be saved to `docs/screens/`); Lighthouse is run with `npx lighthouse` in Phase 8.
- `public/assets/images/cafm-platform.png` is the original CAFM dashboard screenshot, kept on the owner's explicit instruction until an anonymised one is supplied. It still shows the client logo and a customer name (see Open items).

- Phase 1: tokens, fonts, section order, Lenis/ScrollTrigger (single lazy instance) and the removed hero-era components were already in place from the hero work. Added `src/data/{site,projects,experience,stack}.ts`, `useReducedMotion`, `useReveal` (masked line rise + 12 px fade-up, once at 20% into view, nothing hidden with reduced motion), `SectionHeader` and `chapterLabel()` (§2.3 mapping). Header socials/status now read from `data/site.ts`.
- Phase 1: AOS stays for the not-yet-redesigned sections and is removed in Phase 7.
- Phase 2: the hero hand-off keeps the Work section sliding up over the pinned hero (built with the hero) instead of crossfading cards in from the panel positions. The Work pin starts exactly where the hero pin ends, so "Enter the lab" and nav Work land on the start of Work.
- Phase 2: at desktop widths with reduced motion or a coarse pointer, the Work track becomes a native horizontal scroller (role=region, focusable), per spec §13 "scroll natively". Below 768 px the cards stack.
- Phase 2: §11.2 advances the counter when a card's centre passes the track's left third, but the last card never gets there. The line now slides from the left third (start of the pin) to the right edge (end), so the counter reaches 03.
- Phase 2: card image height is min(360 px, 38vh) so the pinned section fits shorter laptop screens (342 px at 900 tall).
- Phase 2: cards without a public link (CAFM, Project 03) are focusable articles so keyboard users can bring them into view; focusing any card scrolls the pin to it.
- Phase 2: no snap (optional in §11.2).
- Phase 2: the "never hide the header" rule now covers every pinned section (shared pin registry in lib/scroll).
- Phase 2: removed the old Projects.tsx (three "concept" projects with Pexels images) and the unused project-placeholder.svg.
- Phase 3: About copy lives in `src/data/about.ts`, verbatim from §17. The statement scales 28 px (mobile) → 36 px (768–1023) → 46 px (≥ 1024) so it fits the 1.5fr column on tablets.
- Phase 3: the portrait shows the outlined placeholder (§17): the hologram's head-and-shoulders mask drawn as faint signal-blue scanlines, so the "hologram becomes the person" idea already reads. `public/assets/images/me.jpg` (the old About photo) exists but the spec asks for the new portrait (§14), so it isn't used.
- Phase 3: §17 asks for "shortened text per artboard 10" on mobile principle cards; artboard 10 isn't available and no short copy is given, so mobile uses the full texts rather than invented ones.
- Phase 3: portrait entrance is a one-time GSAP clip reveal with a glowing scanline sweeping top → bottom ([impl choice] in §17). Removed the old About blob CSS.
- Phase 4: the diagram is a single SVG component in two geometries (820 × 720 desktop, 350 × 220 mini). During the pin, slab positions, the packet, leader lines and label opacity are written directly to the SVG; React re-renders only when the active layer changes.
- Phase 4: labels stay at their spread positions while the slabs compress; leader lines bend from each slab corner to its label, so all four labels stay readable once the stack assembles. Tool lists wrap at ~30 characters (Interface has 9 tools).
- Phase 4: scroll mapping — layers activate per quarter (0–0.25 → 01 … 0.75–1 → 04); the packet glides to each slab over 0–0.75; slabs compress over 0.8–1. Inactive labels sit at 35% until the stack assembles.
- Phase 4: reduced motion or touch at desktop width shows the full diagram static (layer 01 active, all labels visible); hover still highlights layers. Below 768 px: mini diagram + layer cards with chips (Interface card has the 35% signal border). Mobile omits the lead, as §19 lists only HUD, H2, diagram and cards.
- Phase 4: the H2 is 44 px between 768 and 1279 px so "One product, four layers." fits the 0.85fr column; 52 px from 1280.
- Phase 4: the diagram is aria-hidden; a visually hidden list gives screen readers every layer and tool on desktop. Removed the old Skills.tsx (percentage bars).
- Verification note: the Claude browser pane often runs this tab at 0–2 frames per second, so time-based animations (entrances, scrubs) were checked by state (start state applied, trigger fires, end values after settling) rather than watched live.

## Open items (content needed from Rahat)
- Project 03 details + screenshot
- CAFM anonymised screenshot (the current image shows the client logo and a customer name)
- Portrait (hologram + About)
- Redishketch years; provable highlights per role
- Hero scene description for screen readers (currently `[PLACEHOLDER]`)
- Résumé PDF: check it never mentions the client name (its text can't be scanned automatically)

## Blocked / questions
- 

## Metrics
- Bundle sizes (gzip, Phase 0): main 105.3 KB · 3D chunk 230.2 KB · ScrollTrigger 18.1 KB · Lenis 5.7 KB · CSS 9.6 KB
- Lighthouse desktop / mobile:
