# Cloud build — Claude Code on the web

Use this when the owner's PC is off. The build runs in a cloud session on the GitHub repo
`asadullahchowdhury/react-web-developer-portfolio`, branch **`theme/v2-redesign`**.

Everything in `docs/BUILD_PLAN.md` applies, with these cloud differences:

1. **Push after every phase.** The cloud machine is temporary. After each phase's commit, run
   `git push origin theme/v2-redesign`. Work that isn't pushed is lost when the session ends.
2. **Never push to `main`/`master`.** Never force-push. Never open or merge pull requests unless asked.
3. **Install first:** `npm ci` (or `npm install` if there is no lockfile match) before Phase 0's checks.
4. **No secrets in the repo.** EmailJS keys come from `.env`, which is not in GitHub. In Phase 6, test the
   form UI with a mocked send and log "real send untested in cloud" under Open items. Do not create or
   commit a `.env` file.
5. **Screenshots:** Playwright and Chromium are usually available in the cloud machine; use them for the
   Standard verification screenshots. If not, run `npx playwright install chromium` once.
6. **The `dist/` folder** is committed in this repo. Rebuild it (`npm run build`) and include it in the
   phase commit, as previous commits did.
7. **Usage limits:** if the session stops, nothing is lost as long as each phase was pushed. The next
   session starts by reading `docs/BUILD_PLAN.md` → "Resuming" and continues from `docs/BUILD_PROGRESS.md`.

## Prompt to start (and to resume after a limit reset)

```
Read docs/CLOUD_BUILD.md, docs/BUILD_PLAN.md and docs/BUILD_PROGRESS.md (if it exists).
Design source of truth: docs/hero-redesign-spec.md.

Work on branch theme/v2-redesign. Follow the "Resuming" section: continue from the first
phase not marked done. For each phase: build it, run the Standard verification, fix failures,
update docs/BUILD_PROGRESS.md, commit, and push to origin theme/v2-redesign.
Then go straight to the next phase. Don't stop for approval between phases.

Never invent facts or numbers. Never use the word "Equidesk". Use [PLACEHOLDER] for missing
content and log it. Never push to main. At the end, give me a short report.
```
