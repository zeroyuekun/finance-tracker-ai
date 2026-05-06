---
phase: 01-foundation
plan: 04
status: partial-complete
subsystem: ui+auth-flow
tags: [next-app-router, react-19, server-actions, shadcn, auth.js, sign-in, dashboard]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Plan 03 (Drizzle + Auth.js config) — code complete; live db:push and OAuth verification deferred."
provides:
  - "Landing page (app/page.tsx) replaced — heading, subtitle, asChild Button → Link to /signin"
  - "Sign-in page at /signin (app/(auth)/signin/page.tsx) — server-action forms for Google OAuth + Resend magic-link, both redirectTo /dashboard"
  - "Protected dashboard at /dashboard (app/(app)/dashboard/page.tsx) — calls auth(), redirects to /signin if no session, displays session.user.name ?? session.user.email + SignOutButton"
  - "SignOutButton client component (components/sign-out-button.tsx) — \"use client\", wraps next-auth/react signOut with callbackUrl: '/'"
  - "End-to-end UI surface for the entire Phase 1 auth flow — landing → signin → dashboard → signout → landing"
affects: [01-foundation/01-05, 04-goals-dashboard, 05-onboarding, 07-ai-advisor, 09-polish]

# Tech tracking
tech-stack:
  added: []   # no new runtime deps; uses existing shadcn primitives + next-auth + Auth.js exports from Plan 03
  patterns:
    - "Route groups (auth)/(app) for organizational separation without affecting URL paths"
    - "RSC server actions inside <form action={async () => { 'use server'; ... }}> pattern for OAuth and magic-link signIn"
    - "Defense-in-depth auth — proxy.ts catches /dashboard at the edge, dashboard/page.tsx re-checks via auth() server-side"
    - "Client component boundary minimized — only SignOutButton needs 'use client' (uses next-auth/react), everything else is RSC"
    - "Button asChild + Next.js Link composition for routed CTAs without nested <a> issues"
    - "session.user.name ?? session.user.email fallback — Google users have name, Resend users only email"

key-files:
  created:
    - "components/sign-out-button.tsx (\"use client\", imports signOut from next-auth/react, renders shadcn Button outline variant)"
    - "app/(auth)/signin/page.tsx (RSC; Card with two server-action forms; \"or\" divider; Card max-w-md)"
    - "app/(app)/dashboard/page.tsx (async RSC; await auth(); redirect on no session; header + SignOutButton + placeholder Card)"
  modified:
    - "app/page.tsx (replaced — subtitle copy, asChild Button → Link href=/signin, gap-6 layout)"

key-decisions:
  - "Used Next.js route groups (auth) and (app) — they don't change URL paths but allow future layout file additions per group (e.g. an authenticated nav shell under (app)) without restructuring."
  - "Magic-link form uses standard <form> with FormData (not React 19 useActionState) — Auth.js signIn returns a redirect, which works with the simpler pattern. Will revisit if we want optimistic UI in Phase 5+."
  - "session.user.name ?? session.user.email fallback chosen for the dashboard greeting — Google OAuth users always have name, Resend magic-link users typically only have email until they update their profile."
  - "asChild Button with nested Next.js Link instead of styled <Link> — uses radix-ui Slot pattern shadcn ships with, satisfies React's no-nested-<a> rule."

patterns-established:
  - "All sign-in entrypoints route through /signin (no scattered OAuth buttons elsewhere)"
  - "Dashboard page uses redirect('/signin') from next/navigation, NOT Response.redirect — RSC-correct API"
  - "Client components are an exception, not the default — minimize 'use client' surface area"

requirements-completed: []
requirements-partial: [REQ-auth]   # UI written; live OAuth + magic-link verification deferred to Plan 04 Task 2

# Metrics
duration: ~10min (autonomous code-ahead)
completed_partial: 2026-05-06
---

# Phase 1 Plan 4: Sign-in UI + Protected Dashboard + Sign-out Summary

**End-to-end UI surface for the Phase 1 auth flow: replaced landing page, sign-in page with Google OAuth and Resend magic-link forms, protected dashboard, and sign-out button. Live 6-step browser verification deferred until external service credentials are wired into `.env.local`.**

## Status: PARTIAL — code complete, blocked on Plan 03 live verification + service credentials

| Plan 04 Task | Status | Commit |
|--------------|--------|--------|
| Task 1: Build SignOutButton + signin page + dashboard + landing replace | ✅ Done | `24ee9b0` |
| Task 2: Manual 6-step browser verification (live OAuth + magic-link + middleware + Neon row) | ⏸ DEFERRED — blocked on `npm run db:push`, real `AUTH_GOOGLE_ID/SECRET`, and real `AUTH_RESEND_KEY` | — |

## Performance

- **Duration:** ~10 min (UI-only, no service round-trips during code-ahead)
- **Started:** 2026-05-06
- **Completed (partial):** 2026-05-06
- **Tasks:** 1 of 2 done
- **Files created:** 3 (SignOutButton, signin page, dashboard page)
- **Files modified:** 1 (landing page replaced)

## Accomplishments

### Sign-in page (`app/(auth)/signin/page.tsx`)
- **Card layout** with title "Sign in to Finance Tracker AI"
- **Google OAuth form** — single Button "Continue with Google" inside a `<form>` with server-action calling `signIn("google", { redirectTo: "/dashboard" })`. Outline variant, full width.
- **Visual divider** — "or" between the two forms with absolute-positioned border-t
- **Magic-link form** — Label + Input (`type="email"`, `name="email"`, required) + Button "Send magic link" inside a `<form>` with server-action calling `signIn("resend", { email, redirectTo: "/dashboard" })`. FormData lookup with `typeof email !== "string"` guard.
- **Both forms use the inline `'use server'` directive** inside the action function — keeps the page itself an RSC, only the action is server-side-only.

### Dashboard placeholder (`app/(app)/dashboard/page.tsx`)
- **Async RSC** that awaits `auth()` from `@/lib/auth`
- **Defense in depth** — if `!session?.user`, calls `redirect("/signin")` from `next/navigation` (so even if proxy.ts is bypassed, the page still gates)
- **Greeting** — `Welcome back, {session.user.name ?? session.user.email}` (handles both Google and magic-link users)
- **SignOutButton** in the header (client component boundary)
- **Placeholder Card** — "Phase 1 is live. Phase 2 will add transactions and categorization." (intentional handoff message for future phases)

### Sign-out button (`components/sign-out-button.tsx`)
- **`"use client"` directive** — required because `signOut` from `next-auth/react` uses `window.location` for the redirect
- Imports shadcn `Button` (outline variant) — keeps visual style consistent with the sign-in page
- `onClick={() => signOut({ callbackUrl: "/" })}` — returns user to landing after sign-out

### Landing page (`app/page.tsx`)
- **Replaced** the Plan 02 placeholder Button with a routed CTA
- Heading "Finance Tracker AI" (4xl, semibold, tracking-tight)
- Subtitle: "A conversational AI advisor grounded in real finance frameworks. Tracks your spending and gives advice tailored to your goals — not vibes."
- `<Button asChild><Link href="/signin">Get started</Link></Button>` — radix Slot pattern, no nested `<a>` warnings

### Verification baseline (post-code-ahead, before live services)
- `npm run typecheck` ✅
- `npm run lint` ✅
- `npm test` ✅ (1 passed, 2 skipped by design — DB tests gated until DATABASE_URL is real)

## Task Commits

1. **Task 1: SignOutButton + signin page + dashboard + landing replace** — `24ee9b0` (feat)

(Task 2 produces no commit — it's a manual verification checkpoint.)

## Deviations from Plan

None. Task 1 implementation matches the plan's specified file content byte-for-byte. The plan's only flexibility was acceptance criteria-driven; all criteria green for the code itself.

## Issues Encountered

- **Cannot exercise the auth flow during code-ahead** — without real `AUTH_GOOGLE_ID/SECRET` and `AUTH_RESEND_KEY`, neither Google OAuth redirect nor Resend send can complete. The code is byte-correct per the plan but cannot be runtime-verified end-to-end until the user provides credentials.
- **Plan 03 Task 3 (db:push) is a hard prereq** — even if OAuth credentials are provided, sign-in requires the live `user`/`account`/`session` tables in Neon to persist sessions. Session strategy is `database`, not `jwt`.

## Open Issues / Deferred Work

### [BLOCKING] Task 2: 6-step manual browser verification

**Status:** All UI code committed; blocked on Plan 03 Task 3 + service credentials.

**Resume protocol after `db:push` succeeds and `.env.local` has real `AUTH_GOOGLE_ID/SECRET` + `AUTH_RESEND_KEY`:**

1. **Pre-flight (Claude):** Start `npm run dev` in background. Wait 5s. `Invoke-WebRequest http://localhost:3000` → confirm HTTP 200, body contains "Finance Tracker AI" + "Get started".
2. **User in incognito browser, report PASS/FAIL for each:**
   1. Visit http://localhost:3000 → click "Get started" → lands on /signin with Card, Google button, and email form
   2. Visit http://localhost:3000/dashboard while signed out → redirected to /signin?callbackUrl=%2Fdashboard
   3. Click "Continue with Google" → Google OAuth consent → after approve, lands on /dashboard with greeting
   4. Click "Sign out" → returns to landing page; cookie cleared
   5. Enter real email → click "Send magic link" → email arrives within ~1 min from `onboarding@resend.dev` → click link → lands on /dashboard
   6. In Neon SQL editor, run `SELECT id, email, "createdAt" FROM "user" ORDER BY "createdAt" DESC LIMIT 5;` → at least one row matching the email(s) used
3. **Cleanup (Claude):** kill dev server (`Stop-Process -Name node -Force` or close terminal hosting npm run dev)
4. Update this SUMMARY's status from "partial-complete" to "complete" with the row count from step 6.

If any step fails, course-correct before declaring Plan 04 done.

## Next Phase Readiness

**Ready for Plan 05 (CI + Vercel deploy) — partially started in code-ahead.** Plan 05 Task 1 (CI YAML + README + git push) was committed as `b841341`. See `01-05-SUMMARY.md`.

**Blockers for true Plan 04 completion:**
- Plan 03 Task 3 (`db:push`) succeeds → enables session persistence
- User completes Google OAuth client → AUTH_GOOGLE_ID + AUTH_GOOGLE_SECRET in .env.local
- User completes Resend account → AUTH_RESEND_KEY in .env.local
- 6-step manual verification all PASS

**Other notes for downstream plans:**
- The `(auth)` and `(app)` route groups are now established — Phase 5+ can add layout files (`app/(app)/layout.tsx`) for an authenticated app shell without touching the public surface
- Server-action signIn pattern is canonical — Phase 7 (AI advisor) can follow the same shape for any auth-gated mutations
- `session.user.name ?? session.user.email` fallback is the single point of truth — extract to a helper if used in 3+ places

## Self-Check: PARTIAL PASS

Verified post-write:
- `components/sign-out-button.tsx` starts with `"use client"`, imports `signOut` from `next-auth/react`, exports `SignOutButton`, calls `signOut({ callbackUrl: "/" })`
- `app/(auth)/signin/page.tsx` has TWO `<form>` elements with `action={async () => { "use server"; ... }}` — one for Google, one for Resend
- Both signIn calls use `redirectTo: "/dashboard"`
- `app/(app)/dashboard/page.tsx` is async, awaits `auth()`, redirects to `/signin` on no session, renders `SignOutButton` and the user greeting
- `app/page.tsx` has `<Button asChild>` wrapping `<Link href="/signin">`
- One task commit in git log: `24ee9b0`
- typecheck + lint + test all green
- **NOT verified (deferred):** Live OAuth, magic-link delivery, middleware redirect on /dashboard, Neon user row insertion, dev server cleanup

---
*Phase: 01-foundation*
*Plan: 04*
*Status: partial-complete (1/2 tasks done; Task 2 manual browser verification deferred)*
*Last updated: 2026-05-06*
