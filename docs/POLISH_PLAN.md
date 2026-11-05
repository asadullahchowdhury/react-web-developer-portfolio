# Polish plan — after the full build

Found by reviewing the built site (`dist/`) at 1440 × 900 and 390 × 844 on branch `theme/v2-redesign`.
Work through it in order: **P0 → P1 → P2**. Same rules as `docs/BUILD_PLAN.md` (verify, update `BUILD_PROGRESS.md`, one commit per item or small group, message `polish: <what>`).

---

## P0 — must fix before the site goes public

### 1. Work: cards slide underneath the heading
During the horizontal pin, the cards pass behind the left column and the heading/lead text sits on top of the screenshots (unreadable, looks broken).
- Clip the track so cards disappear **at the left column's right edge**: the track's container gets `overflow: hidden` and starts after the 360 px column + gap, or the left column gets a solid `--bg-void` backdrop with a 64 px soft fade on its right edge so cards slide *under* it.
- Keep the §3.5 rule "cards that pass the column fade to 40%" — apply it as they approach the edge.
- **Done when:** at every scroll position of the pin, no card overlaps the heading, lead or counter.

### 2. Work: counter shows the wrong project
At the Barberly position the counter already shows `03`. The counter must match the card that is most in view (largest visible width inside the track window). Also fade out the "Scroll →" hint once the last card is active.

### 3. Don't ship placeholders
Project 03 shows `[PLACEHOLDER]` on the live page. Render only projects that have real data (title + description + image). Keep the data shape so adding it later is one entry in `src/data/projects.ts`. The counter and pin length follow the number of real cards (2 for now).

### 4. CAFM screenshot leaks client data
`cafm-platform.webp` shows a customer name ("Omeda FZC, Marina Tow…") in the Action Center and test data ("asdas", "casdasdas", "test", "a", "b").
- Crop out the right-hand Action Center column and blur/redact any remaining names.
- Better: Rahat supplies a clean screenshot with realistic demo data → log in Open items.
- Until then, also apply the screenshot treatment from P1-7 so the white dashboard doesn't glare on the dark page.

### 5. Unconfirmed years shown as facts
Experience shows "2022 — 2024" and "2021 — 2022" for Redishketch without any marker, but they're unconfirmed. Keep them, but keep the `// TODO confirm` and the Open items entry; don't remove it until Rahat confirms.

---

## P1 — makes it feel finished

### 6. Hero → Work hand-off has a dead frame
Around 70–90% of the hero pin the screen is mostly empty: a dimmed hologram, the `02 / 04` HUD floating mid-screen, and the cards only at the bottom.
- Bring the Work heading in **with** the cards (it should rise together with the track, not after).
- Hide the hero HUD before the Work HUD appears (no two HUD lines at once).
- If time allows, do spec §11.1 v2: the two glass panels FLIP into the first two card positions.

### 7. One consistent screenshot treatment
Project screenshots are bright light-mode UIs on a near-black page.
- Default: `filter: saturate(0.85) brightness(0.88)` plus an inner top shadow inside the 34 px browser bar frame.
- Hover/focus: full colour and brightness, image scale 1.03 (already in spec), 300 ms `ease-lab`.
- Add a 1 px inner border `rgba(255,255,255,0.06)` on the image so white edges don't bleed into the card.

### 8. About portrait doesn't match the page
The About photo has a light grey studio background, which is the brightest block on the site. Options (pick one, log it):
- Use the black-background photo (same as the hologram source), cropped 4:5, **or**
- Grade the current one: darken the background with a radial vignette to `#07090D` at the edges.
Keep the signal-blue border and scanline reveal.

### 9. Stack labels are too faint
Inactive layer labels at 35% are hard to read, and inactive slabs almost disappear. Raise inactive labels to 55%, slab edges to 18% white, and give the final "assembled" state a brief glow pulse on all four layers (400 ms) so the end of the pin feels like a payoff.

### 10. Section entrances fire late
Some sections show their eyebrow while the heading is still hidden, leaving an empty block for a moment (About, Experience). Start reveals at 85% of the viewport instead of 80%, and never hide the eyebrow and heading separately — they reveal as one group.

---

## P2 — extra delight (do after P0/P1; each is small)

11. **Magnetic primary buttons** ("Enter the lab", "Let's talk", "Send request"): move up to 6 px toward the pointer within a 60 px radius, spring back. Desktop pointer only.
12. **Pointer spotlight on cards and glass panels:** a soft radial highlight (signal at 6%) on the border following the pointer. Work cards, About principle cards, Experience role cards, contact form.
13. **HUD chapter ticker:** when the chapter changes (`01 → 02`), the digits roll vertically (200 ms) instead of swapping.
14. **Link underline draw:** text links (email, Codevioso, GitHub rows) draw their underline left → right on hover.
15. **Footer wordmark reveal:** letters of "Rahat Chowdhury" rise into place with a 30 ms stagger when the footer enters view; the wordmark brightens slightly near the pointer.
16. **Mobile life:** the hero poster on mobile is static until first touch — add a slow CSS float (±4 px, 6 s) and a gentle pulse on the platform glow so it doesn't look frozen. Work cards on mobile scale in from 0.96 as they enter.
17. **Back to top:** "Back to top" scrolls with Lenis (1.2 s, `ease-lab`) and the hero replays a short version of the intro (rings + hologram scan, 800 ms).
18. **Experience highlights:** when Rahat supplies real highlights, show them as small "commit message" lines under each role (mono 13 px, `→` prefix). No invented content.

---

## Not code — needs Rahat
- Clean CAFM screenshot with demo data (P0-4).
- Project 03 (P0-3) — or decide to launch with two projects.
- Confirm Redishketch years (P0-5) and any real highlights (P2-18).
- Dark-background About photo, if preferred (P1-8).
- Production domain for absolute OG image URLs.
- Test one real contact-form submission.
