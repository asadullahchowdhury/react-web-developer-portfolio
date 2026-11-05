# Build progress

| Phase | Status | Commit | Notes |
|---|---|---|---|
| 0 Preflight | ☑ | 0eac261 | Inventory below; build passes |
| 1 Foundation | ☑ | 6331d49 | Data files, useReducedMotion, useReveal, SectionHeader, chapter helper |
| 2 Work | ☑ | fdb8eb7 | Pinned horizontal track, stacked mobile, native-scroll fallback |
| 3 About | ☑ | d16afaa | Statement, portrait placeholder + scanline sweep, facts, principles |
| 4 Stack | ☑ | 0010aa4 | Exploded isometric diagram, 160vh pin, mini diagram + cards on mobile |
| 5 Experience | ☑ | 3833f96 | Commit graph aligned to cards (1280–1920), top-down draw, mobile timeline |
| 6 Contact + Footer | ☑ | 7850a44 | Glass form + packet send, mocked send verified, footer wordmark |
| 7 Integration & polish | ☑ | 798e973 | AOS + legacy tokens removed, real portraits, meta/OG, scroll restoration |
| 8 QA & report | ☑ | (this commit) | Lighthouse runs, performance and contrast fixes, fallback checks, final report |

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
- Phase 5: roles live in `src/data/experience.ts`: title "Full-Stack Developer" at Codevioso (codevioso.com link), Redishketch Frontend Lead and Frontend Developer. All old metrics (100k+ users, 40%, 60%, 15+, 25+, 100% satisfaction, 95% coverage) are gone. Redishketch years are shown as written in the spec and flagged `periodConfirmed: false` with `// TODO confirm`. No highlights until real ones are supplied.
- Phase 5: graph nodes are positioned from each card's measured date line (ResizeObserver), so they align at any width — verified 0 px offset at 1280, 1440 and 1920.
- Phase 5: the graph line draws top → bottom (newest first), scrubbed from the list's top at 60% of the viewport to its bottom at 60%; each node pops (0.6 → 1) and its card fades up when its date line reaches the same 60% line (reverses on scroll-up). The Codevioso lane below the merge is drawn faint, since the spec only describes it from the merge to HEAD.
- Phase 5: mobile cards use the full descriptions — §20 asks for "short descriptions" but gives none.
- Phase 6: EmailJS sending is unchanged (same service, template and public key, moved to `src/data/contact.ts`). The payload adds `project_type`; `subject` is kept for the existing template and filled as "New request: <type>".
- Phase 6: no real email was sent during the build (that would message the owner). Success and error states were verified with a dev-only `?mockSend=ok|fail` switch (stripped from production). Real send is untested — see Open items.
- Phase 6: copy not given by the spec — the success line reuses the old form's "Message sent successfully."; validation messages are "Please enter your name." / "Please enter a valid email address." / "Please add a short message.".
- Phase 6: the send animation draws a line from the button to the platform ellipse, moves a glowing packet along it (~900 ms) and pulses the inner ellipse once; reduced motion skips it. Footer © row uses the current year (2026 now, per spec).
- Phase 7: the owner added two portraits to `public/assets/images/` during the build. `portrait-about.webp` was really a 2 MB PNG; it is re-encoded to a 960 × 1200 WebP (41 KB) and used in About. `potrait-hologram.png` (447 × 558, transparent) is now the hologram mask at `public/assets/lab/portrait-hologram.png`; the hologram plane follows its aspect ratio, and the scanline brightness has a 35% floor so the dark shirt still reads. Both originals are kept, untouched, in `docs/source-assets/` (not shipped). Scene posters were re-rendered with the new hologram.
- Phase 7: removed AOS (package, init, CSS), the legacy colour aliases (`background-*`, `foreground-*`, `accent`, `--bg-primary`, `--card-bg`, shadows), `ui-card`/`ui-chip`, the old Contact contrast patch, the placeholder hologram mask, `getSceneCapabilities`, and unused images (`barberly-tab.png`, `me.jpg`, `me 1.jpg` 6.8 MB, `meta-logo-rahat.webp`).
- Phase 7: `index.html` — title "Rahat Chowdhury — Full-Stack Developer", description from the hero lead, Open Graph + Twitter tags, `og-image.png` 1200 × 630 rendered from the hero (label, name, spec headline, lab scene with the hologram). OG image URLs are relative until the production domain is known (Open items).
- Phase 7: manual scroll restoration — the browser restored reloads too high because pins and the hero runway add height after load (5416 → 4152). The position is now saved on `pagehide` and restored after ScrollTrigger's post-fonts/images refresh, on reload and back/forward only. Verified: reload at 5416 returns to 5416.
- Phase 7: pin sequence verified with no overlap — hero 822→1588, Work 1588→2284 (starts exactly at the hero pin end), Stack 4081→4638 (starts at its section top). Chapter counters: 01 hero, 02 Work, 03 About/Stack/Experience, 04 Contact.
- Phase 8: Lighthouse run 1 found a footer-wordmark contrast failure, no `robots.txt`, a ~500 ms startup long task and heavy images. Fixes: the decorative wordmark is drawn as CSS generated content (out of the text tree, still `aria-hidden`); `public/robots.txt` added; section reveals (SplitText + ScrollTrigger) are now set up only when a section comes within half a viewport, instead of all on load; project screenshots and the hologram mask converted from PNG to WebP (barberly 41 KB, cafm-platform 46 KB, portrait-hologram 22 KB).
- Phase 8: WebGL on software renderers (SwiftShader, llvmpipe, "Microsoft Basic Render") is now treated as unsupported, so machines without a usable GPU keep the static poster instead of stalling for ~1 s. GPU devices are unaffected (checked: the scene still loads on Intel UHD / D3D11).
- Phase 8: mobile Performance was 75–77 (target 80) because of the 3D scene's startup (~1 s main-thread task under Lighthouse's 4× CPU throttle). Owner decision: on mobile the scene now starts on the first touch, scroll, wheel or key press (then waits for load + idle); the poster is shown until then. Desktop is unchanged (load + idle). Verified both paths in the browser.
- Phase 8: fallback pass — `?webgl=0&motion=reduce`: no canvas, no pins, poster shown, all content visible, no console errors, no horizontal overflow. No "Equidesk" anywhere in `src/`, `public/`, `dist/` or `index.html`. `.lighthouse/` and `*.tsbuildinfo` added to `.gitignore`.
- Phase 8: environment — the C: drive is full (0 bytes free), so `npx lighthouse` was run with its npm cache, temp folder and Chrome profile on D:. Nothing on C: was touched.
- Not done: responsive `srcset` for project/portrait images (Lighthouse estimates ~100 KB savings on mobile). Worth doing once the final screenshots arrive.
- Verification note: the Claude browser pane often runs this tab at 0–2 frames per second, so time-based animations (entrances, scrubs) were checked by state (start state applied, trigger fires, end values after settling) rather than watched live.

## Polish (docs/POLISH_PLAN.md)
| Item | Status | Notes |
|---|---|---|
| P0-1 Work cards under heading | ☑ | Track window clips at the left column's edge (`overflow-x: clip`), 64 px void fade appears once the track moves; cards fade to 40% as half of them leaves. Checked at 5 pin positions (1440): card left edges never cross the column (column ends 424, window starts 488). |
| P0-2 Work counter | ☑ | Current card = most visible width inside the window; "Scroll →" fades out at the last card. Same logic in the native-scroll mode. |
| P0-3 No placeholders | ☑ | `PUBLISHED_PROJECTS` renders only projects with title, description, category, path label and image; counter shows `/ 02`, pin is 1 × 100vh. Also hid the hero's screen-reader scene description while it is `[PLACEHOLDER]`. No `[PLACEHOLDER]` text left in the DOM (390 and 1440). |
| P0-4 CAFM screenshot | ☑ (interim) | Re-cut from the original 1919 × 927 capture: cropped to the left 1272 × 727 (drops the Action Center with the customer name, the to-do list with test entries and the user menu), then blurred the client logo, the company name and the remaining test titles ("asdas"). 37 KB WebP. A clean capture with demo data is still wanted (Open items). |
| P0-5 Unconfirmed years | ☑ (no change) | Kept "2022 — 2024" / "2021 — 2022" with `// TODO confirm` and `periodConfirmed: false`; Open items entry kept. |
| Owner report: Experience line popped in | ☑ | The graph line used `pathLength=1`; GSAP rounds px while tweening `stroke-dashoffset`, so it jumped from hidden to drawn at 50%. Now `pathLength=1000`: offset goes 989 → 788 → 586 → 384 → 183 → 0 across the scroll (checked at 1440). |
| Contact send line | ☑ | Same rounding bug as the Experience line (`pathLength=1` tweened by GSAP); now 100. |
| P1-6 Hero → Work hand-off | ☑ (v1) | Hero HUD counter fades at p 0.35–0.45 (the `02 / 04` swap is removed), so it is gone before Work and its own `02 / 04` line start rising at p ≈ 0.55. In pin mode the Work heading, eyebrow, lead and counter no longer use delayed reveals: they rise with the track as one block (opacity 1 throughout; checked at p 0.3–1 at 1440). Spec §11.1 v2 (glass panels FLIP into the card positions) not done. |
| P1-8 About portrait | ☑ | Chose grading over swapping photos: the black-background source is only 447 × 558 and waist-length, too small for the 4:5 slot. Image at brightness 0.92 under a radial vignette (clear centre on the face, 72% void at 78%, `#07090D` at the edges). Signal-blue border and scanline reveal unchanged. A dark-background About photo is still welcome (Open items). |
| P1-9 Stack contrast + payoff | ☑ | Inactive labels 55% (was 35%), slab edges and inactive top strokes 18% white. When the stack is fully assembled all four slabs pulse a signal glow once (200 ms up, 200 ms down), re-armed after scrolling back out. Also fixed: React re-renders reset an inactive label's opacity, so after assembly one label stayed dim; the scroll hook now owns label opacity (checked: 0.55/1/0.55/0.55 at p 0.3, all 1.00 at the end). |
| P1-10 Section entrances | ☑ | Reveals start at `top 85%`. A heading's `fade` siblings directly above it (HUD line, eyebrow) now join its timeline and fade in with it, triggered by the first visible one; they're excluded from the generic batch. Checked: About eyebrow + heading hidden together at 88% and both shown at 80% (1440); a full scroll at 390 leaves no hidden reveal elements, no horizontal overflow, no `[PLACEHOLDER]`. |
| P2-11 Magnetic buttons | ☑ | `src/lib/pointerFx.ts` (one delegated, rAF-throttled `pointermove`): "Enter the lab", both header "Let's talk", "Send request" pull up to 6 px toward the pointer within 60 px of their edge and spring back (420 ms overshoot curve). Uses the CSS `translate` property; the hero CTA's intro animation moved to a wrapper so GSAP doesn't reset it. Mouse + fine pointer only, off with reduced motion. Checked: 3.5 px pull at 20 px away, reset when the pointer leaves. |
| P2-12 Pointer spotlight | ☑ | `[data-spotlight]` on Work cards, About principle cards, Experience role cards and the contact form panel: signal radial fill at 6% plus a brighter 1 px border arc that follows the pointer (`--mx/--my`). Hover-capable fine pointers only; hidden with reduced motion. |
| P1-7 Screenshot treatment | ☑ | Done with P0-4: images at saturate 0.85 / brightness 0.88, full colour + scale 1.03 on hover or keyboard focus (300 ms ease-lab, no scale with reduced motion), inner top shadow under the 34 px bar and a 1 px `rgba(255,255,255,0.06)` inner border. |

## Open items (content needed from Rahat)
- Project 03 details + screenshot
- CAFM anonymised screenshot (the current image shows the client logo and a customer name)
- Portrait: supplied and in use. For a sharper hologram, a larger head-and-shoulders cut-out (≥ 1600 px tall, spec §14) would help; the current one is 447 × 558 and waist-length.
- Production domain, so `og:image` / `twitter:image` can be absolute URLs
- Redishketch years; provable highlights per role
- Hero scene description for screen readers (currently `[PLACEHOLDER]`)
- Résumé PDF: check it never mentions the client name (its text can't be scanned automatically)
- Contact form: send one real test message after deploying (only mocked sends were tested), and check the EmailJS template shows `project_type`
- Experience: provable highlights per role (none shown until supplied)

## Blocked / questions
- The C: drive is full; free some space there (npm, Chrome and temp files default to it).

## Metrics
- Bundle sizes (gzip, Phase 0): main 105.3 KB · 3D chunk 230.2 KB · ScrollTrigger 18.1 KB · Lenis 5.7 KB · CSS 9.6 KB
- Bundle sizes (gzip, Phase 8): main 104.8 KB · 3D chunk 224.9 KB · ScrollTrigger 17.7 KB · Lenis 5.6 KB · CSS 7.6 KB
- Lighthouse (production preview, Lighthouse 12), Performance / Accessibility / Best practices / SEO:
  - Run 1 (before Phase 8 fixes): desktop 83 / 96 / 100 / 92 · mobile 77 / 96 / 100 / 92
  - Before the mobile first-touch change: desktop 94 / 100 / 100 / 100 · mobile 77 / 100 / 100 / 100
  - Final: desktop 98 / 100 / 100 / 100 (FCP 0.5 s, LCP 0.9 s, TBT 90 ms, CLS 0) · mobile 92 / 100 / 100 / 100 (FCP 1.8 s, LCP 3.2 s, TBT 50 ms, CLS 0)

STATUS: ALL PHASES COMPLETE
