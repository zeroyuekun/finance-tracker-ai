# Phase 1: Foundation - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning
**Source:** Express path from existing superpowers spec + implementation plan (no separate discuss-phase needed — questions already answered)

<domain>
## Phase Boundary

Stand up a deployable Next.js 16 + TypeScript application with Postgres-backed authentication (email magic-link + Google OAuth), continuous integration green on every push, and a live Vercel URL where a real user can sign up and reach a protected dashboard placeholder.

**Definition of Done:** A real signup at `https://<project>.vercel.app` creates a `users` row in production Postgres, lands the user on `/dashboard`, and CI is green on `main`.

**In scope:**
- Next.js scaffold (App Router, strict TS, Tailwind)
- shadcn/ui base primitives (Button, Card, Input, Label)
- Vitest test framework + sanity tests
- Drizzle ORM + Neon Postgres connection
- Auth.js v5 standard schema (users, accounts, sessions, verificationTokens)
- Auth.js v5 with Google OAuth + Resend magic-link email provider
- Sign-in page + protected `/dashboard` placeholder with sign-out
- Middleware for protected routes
- GitHub Actions CI (lint + typecheck + test + build)
- Vercel deployment with env vars wired

**Out of scope (deferred to later phases):**
- Transactions CRUD → Phase 2
- Categorization → Phase 3
- Goals + Dashboard data → Phase 4
- Onboarding intake → Phase 5
- Finance tools → Phase 6
- AI Advisor chat → Phase 7
- Eval suite + observability → Phase 8
- Polish + ship → Phase 9

</domain>

<decisions>
## Implementation Decisions

### Framework + language
- Next.js 16 (App Router, Turbopack)
- TypeScript with strict mode + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`
- Tailwind CSS v4

### UI
- shadcn/ui components (New York style, Neutral base color, CSS variables)
- Install initial primitives only: Button, Card, Input, Label
- Landing page → sign-in page → dashboard placeholder

### Database
- Neon Postgres (serverless, free tier)
- Drizzle ORM with `drizzle-kit` for migrations
- Connection via `@neondatabase/serverless` driver (HTTP, not WebSocket)
- Standard Auth.js schema: `user`, `account`, `session`, `verificationToken` tables

### Auth
- Auth.js v5 (`next-auth@beta`) with `@auth/drizzle-adapter`
- Database session strategy (not JWT)
- Two providers: Google OAuth + Resend (magic-link email)
- Custom sign-in page at `/signin`
- Middleware protects `/dashboard/*`

### Tests
- Vitest with Node environment
- `tests/sanity.test.ts` — sanity check
- `tests/db.test.ts` — DB connection smoke test (`SELECT 1`)
- `tests/schema.test.ts` — verifies Auth.js tables exist after migration

### CI/CD
- GitHub Actions: lint → typecheck → test → build, on push and pull_request
- Repository secrets for env vars (DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_RESEND_KEY, AUTH_EMAIL_FROM)
- Node version pinned via `.nvmrc` (`20`)

### Deployment
- Vercel Hobby tier
- Imported from GitHub, auto-deploys main
- All env vars configured in Vercel dashboard (Production, Preview, Development)
- Production callback URL added to Google OAuth allowlist

### Schema push (BLOCKING — see schema_push_requirement)
- Drizzle is in scope. Plans MUST include a `[BLOCKING]` task running `npm run db:push` AFTER schema is defined and BEFORE verification, otherwise type checks pass but live DB is empty (false-positive verification).

### Claude's Discretion
- Exact eslint config flavor (use Next.js default flat config)
- Internal helper organization within `lib/`
- README structure beyond the required live-demo URL + setup steps + scripts

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source-of-truth artifacts (the "questions are answered" docs)
- `docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md` — Full design spec; §5 Functional Requirements, §6 Architecture, §11 Tech Stack, §12 Deployment & Ops, §13 Roadmap weeks 1–2 are the binding sections for Phase 1
- `docs/superpowers/plans/2026-05-06-phase-1-foundation.md` — **Existing 1196-line implementation plan with 9 tasks and 73 bite-sized TDD steps.** Adapt this into GSD's PLAN.md/CONTEXT.md format; do NOT discard it. Each GSD task should map to a task or task-group from this plan with traceability comments.

### GSD planning files
- `.planning/PROJECT.md` — Project context, success metric, target runtime
- `.planning/REQUIREMENTS.md` — REQ-auth (the requirement Phase 1 satisfies)
- `.planning/ROADMAP.md` — Phase 1 detail section with phase goal and dependencies
- `.planning/STATE.md` — Current project state

</canonical_refs>

<specifics>
## Specific Ideas

### Manual prerequisites (cannot be automated — user must complete before execution)
1. Node.js 20+ installed (`node --version`)
2. GitHub repo created, `origin` remote set
3. Neon project + DATABASE_URL captured
4. Google OAuth Client ID + Secret with redirect `http://localhost:3000/api/auth/callback/google` (production redirect added later)
5. Vercel account linked to GitHub
6. Resend account + API key + verified sender (e.g. `onboarding@resend.dev`)

The plan MUST surface these as `autonomous: false` prerequisite tasks at the top — execution cannot proceed without them.

### File structure (from existing plan §"Files Created in This Phase")
Configuration: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `components.json`, `drizzle.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `.env.example`, `.env.local`, `.gitignore`, `.nvmrc`, `README.md`, `.github/workflows/ci.yml`

Application: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/(auth)/signin/page.tsx`, `app/(app)/dashboard/page.tsx`, `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`, `lib/db/index.ts`, `lib/db/schema.ts`, `lib/auth.ts`, `lib/utils.ts`

Components: `components/ui/{button,card,input,label}.tsx`, `components/sign-out-button.tsx`

Tests: `tests/sanity.test.ts`, `tests/db.test.ts`, `tests/schema.test.ts`

Migrations: `drizzle/0000_initial_auth_schema.sql` (generated)

### Definition-of-Done checklist (from existing plan)
1. `npm run lint` passes locally
2. `npm run typecheck` passes locally
3. `npm test` passes locally (3 tests: sanity + db + schema)
4. `npm run build` passes locally
5. GitHub Actions CI green on `main`
6. Vercel production deployment is "Ready"
7. Visiting the production URL in incognito shows the landing page
8. Google OAuth flow → arrives at `/dashboard` with name/email visible
9. Magic-link email sign-in works in production
10. Sign-out returns to landing page
11. Middleware redirects unauthenticated `/dashboard` access to `/signin`
12. A `user` row exists in production Neon Postgres
13. README has a live demo URL

</specifics>

<deferred>
## Deferred Ideas

- Plaid bank sync (paid + complex) → spec §15 backlog
- Voice interface (OpenAI Realtime / Claude Voice) → spec §15 backlog
- Native mobile / PWA → spec §15 backlog
- Couples / multi-user mode → spec §15 backlog
- Multi-currency → spec §15 backlog
- Investment / retirement / tax planning → spec §15 backlog
- Subscription / recurring detection → spec §15 backlog
- Custom domain (stays on `.vercel.app` for v1) → spec §16 open question
- Open source license (MIT recommended but not required v1) → spec §16 open question

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-05-06 via express path from existing spec + implementation plan*
