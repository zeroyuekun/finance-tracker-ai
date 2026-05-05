# Phase 1 — Deferred Work

**Status:** All autonomous code-ahead work is complete. Remaining items are blocked on external account setup ("Do the API later").

**Last updated:** 2026-05-06

---

## What's done autonomously (code-ahead)

| Plan | Wave | Status | Commits |
|------|------|--------|---------|
| 01-02 | 2 | ✅ Complete | 4 (a7912e6, 8901c22, d8ae1a3, f99d617) |
| 01-03 | 3 | 🟡 Partial — code written, [BLOCKING] db:push deferred | 2 (8fb8851, b9321f5) |
| 01-04 | 4 | 🟡 Partial — UI written, manual browser verify deferred | 1 (24ee9b0) |
| 01-05 | 5 | 🟡 Partial — CI YAML + base README written, push/deploy deferred | 1 (b841341) |

**Verification still green:**
- `npm run typecheck` ✓
- `npm run lint` ✓
- `npm test` ✓ (1 passed, 2 skipped — db/schema tests skip until real DATABASE_URL)

**Deviation noted:**
- `proxy.ts` used instead of `middleware.ts` per Next 16 deprecation (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` line 627). Auth.js v5 default export pattern works unchanged.
- Migration filename auto-generated as `0000_lively_tenebrous.sql` (drizzle-kit's adjective-noun naming). Journal references this tag — left as-is per plan's optional rename guidance.

---

## What's deferred (blocked on user-driven account setup)

### Wave 1 — Plan 01-01 prerequisites (5 of 6 remaining; Node already verified)

| # | Prerequisite | What user needs to do | Unblocks |
|---|--------------|----------------------|----------|
| 1 | Node ≥20 | ✅ Already verified (v24.8.0) | — |
| 2 | GitHub repo | Create repo, set `origin` remote | Plan 05 push |
| 3 | Neon project | Create Neon project, copy `DATABASE_URL` (postgresql://…?sslmode=require) | Plan 03 db:push, all DB tests |
| 4 | Google OAuth client | Create OAuth client in https://console.cloud.google.com/, add `http://localhost:3000/api/auth/callback/google` to authorized redirects, copy Client ID + Secret | Plan 04 Google sign-in |
| 5 | Vercel account linked to GitHub | Link account at https://vercel.com/ | Plan 05 deploy |
| 6 | Resend account | Create account at https://resend.com/, get API key + verified sender (e.g. `onboarding@resend.dev`) | Plan 04 magic-link |

After completing all 6, fill the real values in `.env.local` (replacing the placeholders Claude wrote during code-ahead). Then write `PREREQS.md` documenting the captured values (the user-reply-driven file from Plan 01).

---

### Wave 3 — Plan 01-03 finishing steps

After `.env.local` has real `DATABASE_URL`:

1. **[BLOCKING]** `npm run db:push` — pushes the generated migration to the live Neon DB
2. `npm test` — db.test.ts and schema.test.ts now run (no longer skipped); expect "3 passed"
3. Commit any test fixes if drift surfaces
4. Write `01-03-SUMMARY.md`

---

### Wave 4 — Plan 01-04 manual verification

After Plan 03 finishing steps + real `AUTH_GOOGLE_ID/SECRET` and `AUTH_RESEND_KEY/AUTH_EMAIL_FROM` in `.env.local`:

1. `npm run dev` (background)
2. Browser-side 6-step verification (incognito):
   - Landing → /signin link
   - Middleware redirect (/dashboard → /signin?callbackUrl=/dashboard) — note: now powered by `proxy.ts`
   - Google OAuth flow → /dashboard
   - Sign out → landing
   - Magic-link flow → /dashboard
   - `user` row exists in Neon
3. Kill dev server
4. Write `01-04-SUMMARY.md`

---

### Wave 5 — Plan 01-05 deploy + verify

1. `git remote add origin <GitHub repo URL>` and `git push -u origin main`
2. Add 6 GitHub repository secrets in Settings → Secrets and variables → Actions: DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_RESEND_KEY, AUTH_EMAIL_FROM. Do NOT add AUTH_TRUST_HOST (it's plain text in the workflow YAML).
3. Trigger CI rerun: `git commit --allow-empty -m "ci: trigger after secrets" && git push`. Verify the run is green on GitHub Actions tab.
4. Visit https://vercel.com/new, import the repo. In env vars panel before clicking Deploy: add all 7 vars (the 6 secrets above + AUTH_TRUST_HOST=true) across Production, Preview, Development. Click Deploy. Capture production URL.
5. Add `https://<production-domain>/api/auth/callback/google` to Google OAuth Authorized redirect URIs.
6. Browser-side 7-step production verification:
   - HTTP 200 on production URL
   - /signin link works
   - Middleware redirect on /dashboard
   - Google OAuth → /dashboard
   - Sign out → landing
   - Magic-link → /dashboard
   - `user` row in production Neon
7. Update README with `**Live demo:** https://<production-domain>` line, commit, push.
8. Write `01-05-SUMMARY.md`.

---

## Resume instructions

When the user is ready to do API setup:

1. User completes the 5 prereqs (GitHub repo, Neon, Google OAuth, Vercel, Resend)
2. User pastes credentials; Claude updates `.env.local`
3. Claude resumes from `Wave 3 — Plan 01-03 finishing steps` above
4. Run plans 03→04→05 finishing steps in sequence
5. Phase 1 Definition of Done: all 13 items in `01-CONTEXT.md` specifics block satisfied

Total estimated work after API setup: ~30–60 min of Claude-driven steps + ~5–10 min of user browser verification per checkpoint.
