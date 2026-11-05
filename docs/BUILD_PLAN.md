# Portfolio Redesign — Build Plan (for Claude Code)

This file tells you **what to build, in what order, and how to know each part is done**.
The design details live in `docs/hero-redesign-spec.md` (the "spec"). This plan points to its sections (§).

Progress is tracked in `docs/BUILD_PROGRESS.md`. Create it in Phase 0 and keep it updated after every phase.

---

## Ground rules (apply to every phase)

1. **Spec is the source of truth.** If code and spec disagree, follow the spec. If the spec is unclear, choose the simplest option that matches the design, and log the decision in `BUILD_PROGRESS.md` → "Decisions".
2. **One phase at a time, in order.** Finish a phase, verify it, commit it, update progress, then start the next one.
3. **Never invent content.** No made-up metrics, clients, dates or project facts. Use `[PLACEHOLDER]` and add the item to "Open items" in `BUILD_PROGRESS.md`.
4. **Confidentiality:** the word "Equidesk" must never appear in code, copy, alt text, file names or images. The project is "CAFM Platform".
5. **Job title is "Full-Stack Developer"** at Codevioso (spelling: Codevioso). Not "Senior".
6. **Don't break what works.** Keep the EmailJS contact sending logic, the résumé link and existing social URLs.
7. **Code style:** TypeScript, React 18 function components, Tailwind with the CSS-variable tokens from §5, small reusable components, data in typed files (not hard-coded in JSX). No new UI libraries beyond those already added for the hero (R3F, drei, postprocessing, GSAP, Lenis).
8. **Motion:** GSAP + ScrollTrigger only (no AOS in redesigned sections). Every animation has a `prefers-reduced-motion` fallback. Use the shared `ease-lab` curve `cubic-bezier(0.2, 0.7, 0, 1)`.
9. **Accessibility:** real `<a>`/`<button>`/`<label>`, 44 px targets, visible focus rings (§5), decorative SVG `aria-hidden`, text contrast ≥ 4.5:1.
10. **Git:** work on the current branch `theme/v2-redesign` (do not create a new one). One commit per phase (or per sub-step if large), message format `redesign(phase-N): <what>`. Never push, never force, never rewrite history.
11. **When blocked:** if something can't be done without the owner's input, log it under "Blocked / questions", use a placeholder, and **continue with the next phase**. Stop entirely only if the build is broken and you can't fix it.

---

## Resuming (you may be restarted many times)

This build may run across several sessions (usage limits, restarts). Every session must:

1. Read this file, then `docs/BUILD_PROGRESS.md`.
2. Run `git status`. If there are uncommitted changes from an interrupted phase, inspect them: finish and verify that phase if the work is sound, otherwise `git stash` them (message `interrupted phase-N`) and redo the phase cleanly. Log what you did under "Decisions".
3. Continue from the **first phase not marked ☑**. Never redo a completed phase.
4. Mark a phase ☑ in the progress table **only after** its verification passed and its commit exists; put the short commit hash in the table.
5. Keep sessions productive but short: aim to finish **one phase per session**, then commit and update progress before doing more.
6. When Phase 8 is complete, add this exact line at the very end of `BUILD_PROGRESS.md`:
   `STATUS: ALL PHASES COMPLETE`
   (the auto-runner script stops when it sees this line). Never write that line earlier.

---

## Standard verification (run at the end of EVERY phase)

1. `npx tsc --noEmit` — no type errors.
2. `npm run lint` — no new errors.
3. `npm run build` — succeeds. Note the JS bundle sizes in progress.
4. `grep -ri "equidesk" src public index.html` — no results.
5. Visual check: run the dev server and take screenshots with Playwright (if available) at **390 × 844** and **1440 × 900**, plus **1440** with `reducedMotion: 'reduce'`. Save to `docs/screens/phase-N-*.png` and compare with the canvas artboards / reference images in `docs/` if present. Fix obvious mismatches (spacing, sizes, colours, overflow, horizontal scroll on mobile).
6. Keyboard check: Tab through the new section — every interactive element reachable, focus visible, nothing trapped.
7. Update `BUILD_PROGRESS.md`, then commit.

---

## Phases

### Phase 0 — Preflight
- Read the whole spec and this plan.
- Check `git status` (must be clean; if not, verify the pending work builds and commit it as `wip: before redesign phases`). Stay on branch `theme/v2-redesign`.
- Inventory what's already built (hero, header) vs. spec. Note gaps in progress.
- Create `docs/BUILD_PROGRESS.md` with the template at the bottom of this file.
- **Done when:** progress file exists, build passes, inventory written.

### Phase 1 — Foundation
Spec: §4, §5, §13, §18.
- Confirm tokens (§5) and fonts (§4) are global; remove old indigo tokens if still used.
- Section order in `App.tsx`: Hero → Work (`#projects`) → About → Stack (`#skills`) → Experience → Contact → Footer.
- Shared utilities (create only if they don't exist yet): Lenis + ScrollTrigger integration (single instance), `useReducedMotion`, `useInView`/entrance helper (masked line reveal + fade-up from §18), `SectionHeader` component (HUD line → eyebrow → H2 with tertiary clause → lead), chapter counter helper.
- Data files: `src/data/projects.ts`, `src/data/experience.ts`, `src/data/stack.ts`, `src/data/site.ts` (email, socials, location, status) — typed.
- Remove `Preloader`, `AnimatedBackground`, `TypewriterCode`, `CursorDot` if still present. Keep AOS only for sections not yet redesigned; remove it fully in Phase 7.
- **Done when:** app runs with the new order, shared helpers exist, no visual regressions in hero/header.

### Phase 2 — Selected Work
Spec: §3.5, §11.1 (hand-off), §11.2, §12, §15. Artboards 06, 07, 08.
- Replace `Projects.tsx` with the pinned horizontal Work section (desktop), stacked cards (mobile / reduced motion).
- Cards from `projects.ts`: CAFM Platform, Barberly, `[PLACEHOLDER]` project 03. Remove the three "concept" projects and the stock images. Delete `equidesk*.png` from `public/`.
- Pin length driven by card count; counter, progress line, card hover/focus states (§3.5 "Card states").
- Connect the hero hand-off (v1 crossfade from §11.1) so "Enter the lab" lands at the start of Work.
- Header: active section updates correctly during the pin; header never hides during the pin.
- **Done when:** scrolling down moves cards sideways and fully reverses; mobile stacks; keyboard focus scrolls cards into view.

### Phase 3 — About
Spec: §17. Artboards 09, 10.
- Replace `About.tsx`: statement H2, body, portrait figure (placeholder outline until the real photo exists), 4 facts, 3 "How I work" cards.
- Entrance: line reveal + portrait scanline sweep (one-time).
- **Done when:** matches artboards at 1440 and 390; copy exactly as spec.

### Phase 4 — Stack
Spec: §19. Artboards 11, 12.
- Replace `Skills.tsx`. Remove all percentage levels.
- Desktop: pinned (160vh) exploded isometric layer diagram (SVG), layer index, scrubbed activation 01→04, final compression. Hover highlights.
- Mobile: static mini diagram + 4 layer cards with chips.
- **Done when:** scroll sequence works both directions; mobile has no pin.

### Phase 5 — Experience
Spec: §20. Artboards 13, 14.
- Replace `Experience.tsx`. Remove all unverified metrics.
- Commit-graph SVG (two lanes, merge into HEAD), cards from `experience.ts`, sticky left column, line draws on scroll, nodes pop.
- Years marked `[ ]` in the spec stay as-is in data with a `// TODO confirm` and an entry in Open items.
- **Done when:** graph nodes align with cards at 1280–1920 widths; mobile timeline works.

### Phase 6 — Contact + Footer
Spec: §21. Artboards 15, 16.
- Replace `Contact.tsx` and `Footer.tsx` UI. **Reuse the existing EmailJS logic** and env keys; add project type to the payload.
- Glass form with labels, pill single-select (`aria-pressed`), validation messages, sending / success (`200 OK · message delivered`) / error states.
- Send animation: packet into the platform ellipse (skip on reduced motion).
- Footer: © row + nav + giant decorative wordmark.
- **Done when:** a real test submission succeeds (or, if keys are missing locally, the success/error UI is verified with a mocked send and this is logged).

### Phase 7 — Integration & polish
- Chapter counters (`NN / 04`) correct everywhere; header active states correct for every section.
- Remove AOS and any now-unused dependencies, components, CSS and assets. No dead code.
- `index.html`: title "Rahat Chowdhury — Full-Stack Developer", meta description from the hero lead, OG/Twitter tags, favicon set, theme-color `#07090D`.
- `ScrollTrigger.refresh()` after fonts/images load; test refresh mid-page and browser back/forward.
- **Done when:** a full scroll from top to bottom and back is smooth, with no jumps or overlaps.

### Phase 8 — QA & report
- Responsive matrix screenshots: 390, 768, 1024, 1280, 1440, 1920 — every section. No horizontal page scroll anywhere.
- Reduced motion pass (no pins, everything visible).
- No-WebGL pass (poster shows, site usable).
- Lighthouse desktop + mobile: targets in §13. Fix the top issues.
- Run every acceptance checklist: §16 plus each section's "Done when".
- Final `BUILD_PROGRESS.md`: all phases ticked, bundle sizes, Lighthouse scores, decisions, open items, and a short "What the owner needs to provide" list.
- **Done when:** report is written and the final commit is made.

---

## `docs/BUILD_PROGRESS.md` template

```markdown
# Build progress

| Phase | Status | Commit | Notes |
|---|---|---|---|
| 0 Preflight | ☐ | | |
| 1 Foundation | ☐ | | |
| 2 Work | ☐ | | |
| 3 About | ☐ | | |
| 4 Stack | ☐ | | |
| 5 Experience | ☐ | | |
| 6 Contact + Footer | ☐ | | |
| 7 Integration & polish | ☐ | | |
| 8 QA & report | ☐ | | |

## Decisions
- 

## Open items (content needed from Rahat)
- Project 03 details + screenshot
- CAFM anonymised screenshot
- Portrait (hologram + About)
- Redishketch years; provable highlights per role

## Blocked / questions
- 

## Metrics
- Bundle sizes:
- Lighthouse desktop / mobile:
```
