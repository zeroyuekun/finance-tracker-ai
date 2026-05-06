---
phase: 01-foundation
plan: 02
subsystem: infra
tags: [next.js, typescript, tailwindcss, vitest, shadcn, eslint, turbopack]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Plan 01-01 (PREREQS) deferred — user will complete API/account signups later. Plan 02 has no API dependencies and runs without prerequisites."
provides:
  - "Next.js 16.2.4 + React 19.2.4 App Router scaffold"
  - "Strict TypeScript config (strict + noUncheckedIndexedAccess + noImplicitOverride)"
  - "Tailwind CSS v4 wired through PostCSS"
  - "Vitest 4.1.5 test runner with @/ alias and Node environment"
  - "shadcn/ui v4.7.0 primitives in New York style: Button, Card, Input, Label"
  - "lib/utils.ts with cn helper (clsx + tailwind-merge)"
  - "Landing page rendering Finance Tracker AI heading + Get started Button"
  - "npm scripts: dev, build, start, lint, typecheck, test, test:watch"
  - ".nvmrc pinning Node 20 for CI parity"
  - ".gitignore protecting .env*.local"
affects: [01-foundation/01-03, 01-foundation/01-04, 01-foundation/01-05, 02-transactions, 03-categorization, 04-goals-dashboard, 05-onboarding, 06-finance-tools, 07-ai-advisor, 08-evals, 09-polish]

# Tech tracking
tech-stack:
  added:
    - "next@16.2.4 (App Router, Turbopack)"
    - "react@19.2.4 + react-dom@19.2.4"
    - "typescript@^5"
    - "tailwindcss@^4 + @tailwindcss/postcss@^4"
    - "tw-animate-css@^1.4.0"
    - "vitest@^4.1.5 + @vitest/ui + jsdom + @testing-library/react + @testing-library/jest-dom"
    - "shadcn@^4.7.0 (CLI + tailwind.css export)"
    - "class-variance-authority@^0.7.1, clsx@^2.1.1, tailwind-merge@^3.5.0"
    - "radix-ui@^1.4.3 (slot primitive used by Button asChild)"
    - "lucide-react@^1.14.0"
    - "eslint@^9 + eslint-config-next@16.2.4 + babel-plugin-react-compiler@1.0.0"
  patterns:
    - "App Router only (no pages/ directory)"
    - "TypeScript strict-with-uncheckedIndexedAccess for fail-loud index/key access"
    - "Vitest tests live under tests/ at the repo root, alias @/ === project root"
    - "shadcn primitives copied locally under components/ui/* and customized in place"
    - "lib/utils.ts is the single home for cross-cutting helpers (cn first occupant)"
    - "ESLint flat config (eslint.config.mjs) — Next 16 ships standalone ESLint, no `next lint`"

key-files:
  created:
    - "package.json (scripts + deps for the entire scaffold)"
    - "tsconfig.json (strict TypeScript)"
    - ".nvmrc (Node 20 pin)"
    - "next.config.ts"
    - "eslint.config.mjs"
    - "postcss.config.mjs"
    - "vitest.config.ts"
    - "components.json (shadcn config — New York / Neutral / CSS variables)"
    - "app/layout.tsx, app/page.tsx, app/globals.css"
    - "components/ui/button.tsx, card.tsx, input.tsx, label.tsx"
    - "lib/utils.ts (cn helper)"
    - "tests/sanity.test.ts (smoke test)"
  modified:
    - ".gitignore (added explicit .env*.local entry on top of inherited .env*)"

key-decisions:
  - "Kept `style: \"new-york\"` in components.json per locked CONTEXT.md decision; verified the shadcn 4.x CLI still resolves new-york → registry/new-york-v4 paths and re-installed all four primitives under that style."
  - "Removed the auto-emitted `@import \"shadcn/tailwind.css\"` line from app/globals.css because the shadcn npm package's dist does not actually ship that CSS file (broken upstream export). Rule 1 fix: dev server now compiles without missing-module errors."
  - "Kept `\"dev\": \"next dev --turbopack\"` per plan even though Next 16 defaults to Turbopack — explicit flag survives future default-flips and is harmless."
  - "Did NOT swap `lint` to `eslint .` — Next 16 already ships standalone ESLint as the default; create-next-app emitted `\"lint\": \"eslint\"` which works as-is."
  - "Did NOT modify .planning/STATE.md or .planning/ROADMAP.md — orchestrator owns those after wave completes."

patterns-established:
  - "shadcn primitives are vendored, not imported from a runtime package — future plans add components by re-running `npx shadcn@latest add <name>` and committing the generated file"
  - "Each feature task gets exactly one `feat(phase-plan): ...` commit with inline git identity flags (no global git config writes)"
  - "Dev-server smoke checks happen in background → curl localhost:3000 → kill pattern; never leave a dev server running across tasks"

requirements-completed: [REQ-auth]

# Metrics
duration: 15min
completed: 2026-05-06
---

# Phase 1 Plan 2: Next.js 16 + TypeScript + Tailwind v4 + Vitest + shadcn/ui Scaffold Summary

**Runnable Next.js 16 scaffold with strict TS, Vitest 4 sanity-tested, and shadcn/ui New York primitives (Button, Card, Input, Label) rendering the Finance Tracker AI landing page.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-05-05T18:10:10Z
- **Completed:** 2026-05-05T18:24:58Z
- **Tasks:** 3
- **Files created:** 22 (scaffold + Vitest + shadcn primitives + lib/utils + tests)
- **Files modified:** 2 (`.gitignore`, `app/page.tsx`, `app/globals.css`)

## Accomplishments

- **Next.js 16.2.4 + React 19.2.4 App Router scaffold** installed in-place, with `.planning/` and `docs/` preserved by temporarily moving them aside during `create-next-app`, then restoring after scaffolding.
- **Strict TypeScript** with `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true` (the three settings locked in `01-CONTEXT.md`). `npx tsc --noEmit` exits 0 cleanly.
- **Tailwind v4** wired through `@tailwindcss/postcss`, theme tokens generated by shadcn init, OKLCH color palette plus `tw-animate-css`.
- **Vitest 4.1.5** runner with `@/` alias resolving to project root, Node test environment, sanity test passing (`expect(2 + 2).toBe(4)`).
- **shadcn/ui (New York / Neutral / CSS variables)** primitives Button / Card / Input / Label vendored under `components/ui/`, plus `lib/utils.ts` exporting the `cn` helper (`clsx` + `tailwind-merge`). Button supports the `variant`, `size`, `asChild` props that downstream Plan 04 will rely on for the dashboard sign-in link.
- **Landing page** at `app/page.tsx` renders an `h1` with "Finance Tracker AI", a muted-foreground subtitle, and a styled shadcn `<Button>` reading "Get started". Verified via background `npm run dev` + `curl http://localhost:3000` → HTTP 200, body contained both required strings.
- **`npm run lint`, `npm run typecheck`, `npm test` all exit 0** at the end of Plan 02.
- **`.nvmrc` pins Node 20** for CI parity (downstream Plan 05 will read this in GitHub Actions).
- **`.gitignore`** explicitly lists `.env*.local` (in addition to the inherited `.env*`), satisfying the Phase 1 threat model T-01-02-02 mitigation gate before any `.env.local` is created in Plan 03.

## Task Commits

Each task was committed atomically with inline git identity (`-c user.email -c user.name` per the orchestrator's no-global-config requirement).

1. **Task 1: Run create-next-app, install deps, pin Node, write strict tsconfig.json** — `a7912e6` (feat)
2. **Task 2: Add Vitest framework + sanity test + npm scripts** — `8901c22` (feat)
3. **Task 3: Initialize shadcn/ui, add Button/Card/Input/Label, render landing page** — `d8ae1a3` (feat)

_No final metadata commit by this executor — STATE.md and ROADMAP.md updates are owned by the orchestrator after wave completion._

## Files Created/Modified

### Created
- `package.json` — scripts (dev/build/start/lint/typecheck/test/test:watch), all runtime + dev deps
- `package-lock.json` — locked dependency graph
- `tsconfig.json` — strict TS with the three locked options
- `.nvmrc` — `20`
- `next.config.ts` — Next.js config (defaults from create-next-app)
- `eslint.config.mjs` — ESLint flat config (Next.js default)
- `postcss.config.mjs` — PostCSS for Tailwind v4
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — root layout, landing page, theme tokens
- `vitest.config.ts` — Vitest runner (Node env, `@/` alias, `tests/**/*.test.ts(x)` glob)
- `tests/sanity.test.ts` — `expect(2 + 2).toBe(4)` smoke
- `components.json` — shadcn config (`new-york` / `neutral` / `cssVariables: true`)
- `components/ui/button.tsx` — shadcn Button (exports `Button`, `buttonVariants`; supports `variant`, `size`, `asChild`)
- `components/ui/card.tsx` — shadcn Card (exports `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardDescription`, `CardFooter`, `CardAction`)
- `components/ui/input.tsx` — shadcn Input
- `components/ui/label.tsx` — shadcn Label
- `lib/utils.ts` — `cn(...inputs: ClassValue[]): string` helper
- `AGENTS.md`, `CLAUDE.md`, `README.md`, `public/*.svg` — create-next-app boilerplate (kept untouched; will be replaced in Plan 05 README task)

### Modified
- `.gitignore` — added explicit `.env*.local` line under the inherited `.env*` (so the `\.env\*?\.local` regex used by future verifiers matches literally)
- `app/globals.css` — removed broken `@import "shadcn/tailwind.css"` line (auto-emitted by shadcn init but `dist/tailwind.css` is not actually shipped in `shadcn@4.7.0`); kept the rest (theme tokens, OKLCH palette, base layer)

## Decisions Made

- **Kept `style: "new-york"` in components.json** despite `npx shadcn@latest init --defaults` writing `style: "base-nova"` first. Re-pointed and re-ran `shadcn add button card input label` so all four primitives now match the locked CONTEXT.md decision (New York / Neutral / CSS variables) and resolve to the `registry/new-york-v4` registry. Verified via `npx shadcn@latest view button` returning the New York v4 path.
- **Did not pin `next` to a v15 fallback** — used whatever current `create-next-app@latest` installs, which is Next 16.2.4 + React 19.2.4. This matches the spec and the must_haves criterion ("any major 15+ acceptable").
- **shadcn 4.x install pollution cleanup:** dropped `@base-ui/react` from dependencies (a residual from the initial `--defaults` run that pulled in base-nova primitives, then immediately overwritten by New York). `radix-ui` is the only UI primitive runtime dep left, used by Button's `asChild` Slot.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `create-next-app` refused to scaffold over `.planning/`**
- **Found during:** Task 1, step 3 (`npx create-next-app@latest .`)
- **Issue:** The Next.js 16 CLI refuses to scaffold into a directory containing `.planning/` (the GSD planning artifacts). The plan's note "When create-next-app prompts about non-empty directory, answer YES" assumed an interactive prompt — Next 16's CLI hard-fails non-interactively instead.
- **Fix:** Moved `ai-finance-coach/.planning` and `ai-finance-coach/docs` to a sibling temp directory, ran `create-next-app`, then moved them back. Net effect identical to the plan's intent (scaffold preserves planning + docs); only the mechanism differs.
- **Files modified:** None permanent (temp move/restore only)
- **Verification:** Post-scaffold `ls -la` confirms `.planning/` and `docs/` are intact alongside the new Next.js scaffold.
- **Committed in:** `a7912e6` (Task 1 commit)

**2. [Rule 1 - Bug] Removed broken `@import "shadcn/tailwind.css"` from `app/globals.css`**
- **Found during:** Task 3, step 4 (dev-server smoke check)
- **Issue:** `npx shadcn@latest init` (CLI v4.7.0) writes `@import "shadcn/tailwind.css"` into `app/globals.css`. The `shadcn` npm package's `package.json` declares `"./tailwind.css"` in its `exports` map pointing at `./dist/tailwind.css`, but **the file is not present in the published tarball**. Result: turbopack's PostCSS chain throws `Can't resolve 'shadcn/tailwind.css'` → 500 on every page.
- **Fix:** Removed the broken `@import` line. The remaining imports (`tailwindcss`, `tw-animate-css`) are both legitimate. Theme tokens, OKLCH palette, and `@layer base` rules below the import block were all left intact.
- **Files modified:** `app/globals.css`
- **Verification:** Dev server now responds with HTTP 200 and the landing page renders the heading + button correctly. Lint, typecheck, and tests all green.
- **Committed in:** `d8ae1a3` (Task 3 commit)

**3. [Rule 2 - Missing Critical] Cleaned up `@base-ui/react` runtime dep that shadcn `--defaults` pulled in**
- **Found during:** Task 3, step 2 (immediately after re-running `shadcn add` under the `new-york` style)
- **Issue:** The first `shadcn init --defaults` call selected the `base-nova` style and installed `@base-ui/react` as a peer (the base-nova Button uses `@base-ui/react/button`). After flipping `style` to `new-york` and re-adding, the New York Button uses `radix-ui`'s `Slot` instead, leaving `@base-ui/react` unused but in `package.json`. Keeping it would risk Drizzle/Auth.js peer-dep warnings later and bloats the lockfile.
- **Fix:** `npm uninstall @base-ui/react`. Verified no remaining imports via `grep -r "@base-ui/react" --include="*.tsx" --include="*.ts"` (zero hits).
- **Files modified:** `package.json`, `package-lock.json`
- **Verification:** Typecheck still green; build still works.
- **Committed in:** `d8ae1a3` (Task 3 commit)

**4. [Rule 1 - Bug] tsconfig.json `jsx` setting was auto-rewritten by Next 16**
- **Found during:** Task 1, step 7 (first `npm run dev`)
- **Issue:** The plan's tsconfig spec says `"jsx": "preserve"`. Next 16's first dev-server boot detected the project and rewrote it to `"jsx": "react-jsx"` (its automatic runtime), and added `.next/dev/types/**/*.ts` to the `include` array. This is mandatory in Next 16 — they declare the change in the dev-server log.
- **Fix:** Accepted the Next 16 mandated rewrite. The three locked CONTEXT.md decisions (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`) are still in place; only `jsx` differs from the literal plan.
- **Files modified:** `tsconfig.json`
- **Verification:** `npx tsc --noEmit` exits 0; React 19 compiles cleanly under react-jsx automatic runtime.
- **Committed in:** `a7912e6` (Task 1 commit)

---

**Total deviations:** 4 auto-fixed (1 blocking, 2 bugs, 1 missing-critical cleanup)
**Impact on plan:** All four deviations are forced by upstream tooling changes (Next 16, shadcn 4.7) since the plan was authored. None changes the surface area or semantics. The user's locked decisions in `01-CONTEXT.md` (Next 16 + strict TS + shadcn New York / Neutral / CSS variables) are all honored in spirit and in artifact.

## Issues Encountered

- **shadcn 4.7 default style is `base-nova`, not `new-york`.** The CLI no longer ships an interactive style picker — `--defaults` selects `base-nova` and `--style` is no longer a top-level flag. Worked around by post-init flipping `components.json` `style` to `"new-york"` and re-running `shadcn add`, which the registry still resolves correctly.
- **`@import "shadcn/tailwind.css"` resolves to a non-shipped file** in the `shadcn@4.7.0` published tarball. This is a known upstream packaging issue — the `exports` map points to a file that the publish pipeline doesn't include in `dist/`. Removing the import is the correct fix; nothing in the four installed primitives depends on the missing CSS (it would have been menu-related utilities for `menuColor` / `menuAccent` features we don't use).
- **`create-next-app` non-interactive mode hard-fails on conflicting subdirectories.** The plan's "answer YES if prompted" guidance assumed interactive mode; with `--yes` the CLI exits 1 instead. Temporary move-and-restore of `.planning/` + `docs/` is the cleanest workaround that doesn't compromise either side.

## Lint script note

Plan Step 3 (Task 2) and Task 3 step 6 budgeted for the possibility that Next 16 removed `next lint`. **Confirmed:** Next 16.2.4 ships standalone ESLint, and `create-next-app` already wrote `"lint": "eslint"` (no `next lint` reference). No swap was needed; the script as emitted runs ESLint flat config from `eslint.config.mjs` and exits 0.

## User Setup Required

None — Plan 02 introduces no environment variables, no third-party services, no `.env.local`. The Phase 1 threat-model gate T-01-02-02 (`.gitignore` covers `.env*.local`) is green; the actual `.env.local` file is created in Plan 03 Task 1, after Plan 02 verifies the gate.

## Tests in suite

- **1 test** (sanity): `tests/sanity.test.ts` → `describe("sanity")` / `it("runs vitest")` / `expect(2 + 2).toBe(4)`. Plan 03 will add `tests/db.test.ts`; Plan 04 will add `tests/schema.test.ts`.

## Next Phase Readiness

**Ready for Plan 03 (Drizzle + Neon Postgres connection):**
- npm scripts in place; Plan 03 will add `db:generate` / `db:migrate` / `db:push` / `db:studio` to the same scripts block.
- `lib/` directory exists (`lib/utils.ts` is the first occupant); `lib/db/index.ts` and `lib/db/schema.ts` will land alongside.
- `tests/` directory exists with the sanity test; `tests/db.test.ts` will add the Neon connectivity smoke test.
- `.gitignore` already protects `.env*.local`, so Plan 03 can safely create `.env.local` with the real `DATABASE_URL`.

**Blockers for Plan 03:**
- User has NOT yet completed Plan 01-01 prerequisites (Neon project + DATABASE_URL). Plan 03 will need to gate on this — either as a `human-action` checkpoint or by deferring schema-push verification until the user provides credentials.

**Other notes for downstream plans:**
- Button component supports `asChild` (uses radix-ui's Slot) — Plan 04 Task 4's `<Button asChild><Link href="/signin">…</Link></Button>` pattern will work without changes.
- `cn` is at `@/lib/utils`; future shadcn add commands will import from this exact path (configured in `components.json`).
- `style: "new-york"` is locked in `components.json`; future `shadcn add` calls will continue to pull from `registry/new-york-v4`.
- React 19.2 is in use — `useActionState`, `useFormStatus`, the `<form action>` pattern (used in Plan 04's sign-in page) are all available.

## Self-Check: PASSED

Verified post-write:
- `package.json`, `tsconfig.json`, `.nvmrc`, `vitest.config.ts`, `components.json`, `lib/utils.ts`, `tests/sanity.test.ts` all exist (Bash `Test-Path` analog via `ls`).
- `components/ui/{button,card,input,label}.tsx` all exist with the expected exports.
- Three task commits exist in `git log --oneline -5`: `a7912e6`, `8901c22`, `d8ae1a3` — all prefixed `feat(01-02): …`.
- `npm run typecheck` exits 0; `npm run lint` exits 0; `npm test` exits 0 (1 test passed).
- Dev server returned HTTP 200 with body containing "Finance Tracker AI" and "Get started"; subsequently terminated.
- `.planning/STATE.md` and `.planning/ROADMAP.md` left unmodified by this executor (orchestrator-owned).

---
*Phase: 01-foundation*
*Plan: 02*
*Completed: 2026-05-06*
