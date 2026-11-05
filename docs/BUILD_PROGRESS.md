# Build progress

| Phase | Status | Commit | Notes |
|---|---|---|---|
| 0 Preflight | ☑ | 0eac261 | Inventory below; build passes |
| 1 Foundation | ☑ | 6331d49 | Data files, useReducedMotion, useReveal, SectionHeader, chapter helper |
| 2 Work | ☑ | (this commit) | Pinned horizontal track, stacked mobile, native-scroll fallback |
| 3 About | ☐ | | |
| 4 Stack | ☐ | | |
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
