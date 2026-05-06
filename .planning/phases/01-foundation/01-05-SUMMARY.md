---
phase: 01-foundation
plan: 05
status: partial-complete
subsystem: ci+deploy
tags: [github-actions, ci-cd, vercel, deployment, readme]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Plans 02–04 (scaffold + DB + auth + UI) — code committed; live verification of Plans 03–04 deferred."
provides:
  - ".github/workflows/ci.yml — Lint · Typecheck · Test · Build pipeline on push to main and on every PR"
  - "README.md — project overview, stack, local-dev commands, scripts list (live demo URL deferred until Vercel deploy)"
  - "GitHub remote origin → https://github.com/zeroyuekun/ai-finance-coach (public; user confirmed visibility 2026-05-06)"
  - "All 11 phase commits pushed to origin/main (Plans 02 + 03 + 04 + 05 task 1)"
affects: [02-transactions, 03-categorization, ..., 09-polish (every future phase relies on CI being green to merge)]

# Tech tracking
tech-stack:
  added: []  # CI is config-only; no new runtime/dev deps
  patterns:
    - "GitHub Actions: actions/checkout@v4 + actions/setup-node@v4 with node-version-file: .nvmrc — single source of truth for Node version (Plan 02 .nvmrc says 20)"
    - "npm ci (NOT npm install) for deterministic CI installs from package-lock.json"
    - "Test step injects DATABASE_URL only; Build step injects all 7 env vars (Next.js evaluates server env at build time)"
    - "AUTH_TRUST_HOST=true is plain-text in YAML, NOT a secret — value is non-sensitive and required for Auth.js to trust X-Forwarded-Host on Vercel"
    - "cache: 'npm' on setup-node — caches ~/.npm between runs"

key-files:
  created:
    - ".github/workflows/ci.yml — single 'CI' workflow, single 'ci' job, four steps: Install/Lint/Typecheck/Test/Build"
  modified:
    - "README.md (replaced create-next-app default with project description, stack, scripts; live-demo URL line deferred)"

key-decisions:
  - "Workflow runs on `push: branches: [main]` AND `pull_request:` (no branch filter) — every PR gets full CI, main pushes also re-run"
  - "Single job 'ci' with sequential steps instead of 4 parallel jobs — total wall-clock identical for a fresh repo (~3 min) and the install/cache happens once. Will revisit when test runtime grows past a few seconds."
  - "Build step gets DATABASE_URL — Next.js may evaluate server env at build (e.g., for static-rendered pages). Even though Phase 1 is fully dynamic, this is harmless and forward-compatible."
  - "AUTH_TRUST_HOST in YAML, not secrets — its value 'true' is a feature flag for Auth.js, not a credential. Putting it in secrets would mask it in logs unnecessarily."
  - "[USER CONFIRMED 2026-05-06] Repo visibility: PUBLIC — public repos get unlimited GitHub Actions minutes (vs 2000 min/mo for private), portfolio visibility for recruiters."

patterns-established:
  - ".nvmrc is the canonical Node version source — local nvm, GitHub Actions, and (later) Vercel all read from it"
  - "All env vars referenced in CI workflow YAML must exist as either secrets (sensitive) or plain values (non-sensitive feature flags)"

requirements-completed: []
requirements-partial: [REQ-auth]   # CI runs but isn't green yet (build step needs secrets to compile Auth.js config)

# Metrics
duration: ~5min (autonomous code-ahead)
completed_partial: 2026-05-06
---

# Phase 1 Plan 5: GitHub Actions CI + README + GitHub Push Summary

**CI workflow YAML and project README committed; 11 commits pushed to public GitHub repo at zeroyuekun/ai-finance-coach. CI green, GitHub secrets, Vercel deploy, production OAuth callback, and live-demo README line all deferred until user provides external service credentials.**

## Status: PARTIAL — code + push complete, blocked on user-driven service credentials

| Plan 05 Task | Status | Commit |
|--------------|--------|--------|
| Task 1: Create CI workflow YAML, write README, push to GitHub | ✅ Done | `b841341` + 11-commit `git push -u origin main` |
| Task 2: Add 6 GitHub repository secrets | ⏸ DEFERRED — blocked on user credentials (Neon, Google OAuth, Resend) | — |
| Task 3: Verify CI run is green on main | ⏸ DEFERRED — first push triggered a CI run that fails at Build step (no secrets); will rerun after Task 2 | — |
| Task 4: Vercel import + 7 env vars + deploy + capture URL + Google OAuth production callback | ⏸ DEFERRED | — |
| Task 5: 7-step end-to-end production verification | ⏸ DEFERRED | — |
| Task 6: README live demo URL line + commit + push | ⏸ DEFERRED | — |

## Performance

- **Duration:** ~5 min (autonomous code-ahead — write YAML + README, push)
- **Started:** 2026-05-06
- **Completed (partial):** 2026-05-06
- **Tasks:** 1 of 6 done
- **Files created:** 1 (.github/workflows/ci.yml)
- **Files modified:** 1 (README.md)

## Accomplishments

### CI workflow (`.github/workflows/ci.yml`)
- **Triggers:** `push: branches: [main]` and `pull_request:` (every PR, no filter)
- **Single job 'ci'** running on `ubuntu-latest`
- **Steps:**
  1. `actions/checkout@v4`
  2. `actions/setup-node@v4` with `node-version-file: ".nvmrc"` (reads `20` from Plan 02), `cache: "npm"`
  3. `npm ci` — deterministic install
  4. `npm run lint`
  5. `npm run typecheck`
  6. `npm test` (injects `DATABASE_URL` from secrets)
  7. `npm run build` (injects DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_RESEND_KEY, AUTH_EMAIL_FROM from secrets + `AUTH_TRUST_HOST: "true"` plain-text)

### README replacement
- Removed create-next-app default placeholder
- Added stack one-liner: Next.js 16 · TypeScript · Tailwind · shadcn/ui · Drizzle ORM · Neon Postgres · Auth.js v5 · Vitest · Vercel
- 4-step local development block (install → cp .env.example → db:push → npm run dev)
- Scripts list with one-liner per script
- Project status line: "Phase 1 (Foundation) — auth, DB, deployment."

### GitHub remote + push
- **Repo:** `zeroyuekun/ai-finance-coach` (created via `gh repo create`)
- **Visibility:** PUBLIC — user confirmed 2026-05-06 (per ~/.claude/.../memory/feedback_repo_visibility.md, this should have been confirmed BEFORE creation; flagged for future projects)
- **`git remote -v`** shows `origin` https/push pointing at the repo
- **`git push -u origin main`** uploaded all 11 commits accumulated across Plans 02 + 03 + 04 + this plan's Task 1

### Verification baseline (post-code-ahead)
- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm test` ✅ (1 passed, 2 skipped — DB tests skip without real DATABASE_URL)
- `git status` clean
- `git log --oneline | wc -l` ≥ 11

## Task Commits

1. **Task 1: CI YAML + README** — `b841341` (ci)

Plus the bookkeeping commits that documented the pause:
- `727e35b` (chore) — document deferred work in DEFERRED.md
- `7ad1ee8` (chore) — record GitHub push, await visibility confirmation + Neon

(Tasks 2–6 produce 1–3 future commits: empty trigger commit for CI rerun, optional fix commits if CI fails, README live-demo URL commit.)

## Deviations from Plan

None for Task 1. CI YAML and README are byte-correct per the plan. The non-trivial deviation is **scope** — Task 1 is the only autonomous task in Plan 05. Tasks 2–6 are inherently `autonomous: false` (require GitHub Settings UI, Vercel UI, Google Cloud Console, browser verification) and were correctly NOT attempted during code-ahead.

## Issues Encountered

- **CI runs after push FAIL at Build step.** Confirmed via `gh run list`: 3 runs to date (`727e35b`, `7ad1ee8`, `ca0217e`), all conclusion=failure. The exact error each time is the same:
  ```
  Failed to collect configuration for /dashboard
  [cause]: Error: DATABASE_URL is not set
      at module evaluation (.next/server/chunks/ssr/...)
  ```
  Mechanism: `${{ secrets.DATABASE_URL }}` resolves to empty string when the secret is unset → `lib/db/index.ts` line 6's `if (!databaseUrl) throw` fires during Next 16's "Collecting page data" phase (it imports every route module, including `/dashboard` which imports `@/lib/db` via `auth()`). Will go green automatically once Task 2 sets the secrets.
- **Local build passes with placeholder env.** `npm run build` exits 0 locally because `.env.local` carries placeholder strings (`postgresql://placeholder:placeholder@...`) that are truthy — the throw doesn't fire. Output confirms 6 routes built, including `ƒ Proxy (Middleware)` (validates the proxy.ts deviation) and `/signin` static-prerendered. This means TypeScript + ESLint + Next compile + page collection are all clean; the only delta to CI green is real secret values.
- **Pre-existing OAuth callback** in Google Cloud Console only covers `http://localhost:3000/api/auth/callback/google`. The production callback (`https://<vercel-domain>/api/auth/callback/google`) must be added in Task 4 step 12 — user-driven browser action.

## Open Issues / Deferred Work

### [BLOCKING] Task 2: Add 6 GitHub repository secrets

**Status:** Blocked on user completing Neon + Google OAuth + Resend.

**Resume protocol once user has all credentials in `.env.local`:**

1. User opens `https://github.com/zeroyuekun/ai-finance-coach/settings/secrets/actions`
2. Adds 6 secrets (one at a time — no batch import) using values from `.env.local`:
   - DATABASE_URL
   - AUTH_SECRET
   - AUTH_GOOGLE_ID
   - AUTH_GOOGLE_SECRET
   - AUTH_RESEND_KEY
   - AUTH_EMAIL_FROM
3. **DOES NOT** add AUTH_TRUST_HOST (plain text in YAML, intentional)
4. Replies "secrets added" — Claude proceeds to Task 3.

### [BLOCKING] Task 3: Trigger CI rerun + verify green

**Resume protocol after Task 2:**

1. Claude runs:
   ```powershell
   git commit --allow-empty -m "ci(01-05): trigger CI rerun after secrets added"
   git push
   ```
2. Claude polls `gh run list --limit 1 --json status,conclusion` until status=completed.
3. Expected: conclusion="success". If failure, fetch the run log via `gh run view --log-failed`.

### [BLOCKING] Task 4: Vercel import + env vars + deploy + Google OAuth production callback

**Resume protocol once CI green:**

User opens `https://vercel.com/new`, imports `zeroyuekun/ai-finance-coach`. Before clicking Deploy:
- Adds 7 env vars (the 6 secrets above + `AUTH_TRUST_HOST=true`) across Production / Preview / Development.

After deploy succeeds:
- Captures production URL (typically `https://ai-finance-coach.vercel.app` or similar)
- Adds `https://<production-domain>/api/auth/callback/google` to Google OAuth Authorized redirect URIs

### [BLOCKING] Task 5: 7-step end-to-end production verification

**Resume protocol after Vercel deploy:**

Claude pre-flights with `Invoke-WebRequest <production URL>` → expect HTTP 200. Then user runs 7 checks in incognito:
1. Production URL renders landing
2. Click "Get started" → /signin
3. Direct visit /dashboard signed out → redirected to /signin?callbackUrl=%2Fdashboard
4. Google OAuth → /dashboard
5. Sign out → landing
6. Magic-link in production → /dashboard
7. New `user` row in production Neon

This is the canonical Phase 1 Definition of Done check (CONTEXT.md specifics items 6–13).

### [BLOCKING] Task 6: README live demo URL line

**Resume protocol after Task 5 PASS:**

Claude inserts after the `# Finance Tracker AI` heading:
```
**Live demo:** <production URL>
```
Commit `docs(01-05): add live demo URL` and push. Phase 1 SHIPPED.

## Next Phase Readiness

**Ready for Phase 2 (Transactions module) — pending Phase 1 closeout.** Cannot start Phase 2 planning until Tasks 2–6 above are complete (Phase 1 Definition of Done satisfied).

**Estimated remaining wall-clock once user starts:** ~30–60 min of Claude-driven steps + ~5–10 min of user browser verification per checkpoint (Task 2: 5 min, Task 3: 3 min wait, Task 4: 10 min, Task 5: 10 min, Task 6: 1 min).

## Self-Check: PARTIAL PASS

Verified post-write:
- `.github/workflows/ci.yml` exists with all required steps and env wiring
- `README.md` contains `# Finance Tracker AI`, stack one-liner, npm scripts, status line
- `git remote get-url origin` returns the GitHub URL
- `git ls-remote origin main` returns a SHA (push succeeded)
- `git log origin/main --oneline` shows ≥ 11 commits
- typecheck + lint + test all green locally
- One task commit (`b841341`) for the CI YAML + README work
- **NOT verified (deferred):** GitHub secrets exist, CI green, Vercel deployed, production OAuth callback, end-to-end production sign-in, README live-demo line

---
*Phase: 01-foundation*
*Plan: 05*
*Status: partial-complete (1/6 tasks done; Tasks 2–6 deferred on user external setup)*
*Last updated: 2026-05-06*
