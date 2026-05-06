# Phase 1 — Deferred Work

**Status:** Plan 01-04 complete. Plan 01-05 Tasks 1–3 complete (CI green on `main`). Plan 01-05 Task 4 IN PROGRESS — Vercel UI import attempted; first build failed at "Collecting page data" with `DATABASE_URL is not set`. Diagnosed: env vars not attached to Production scope. User going to sleep; will fix dashboard config + redeploy next session.

**Last updated:** 2026-05-07 (session 3 paused — Vercel deploy attempt 1 failed, awaiting env var fix + redeploy)

---

## ⏯ RESUME HERE

Visibility ✅ resolved (public).
Project rename ✅ done.
Task #1 (Neon) ✅ done.
Task #2 (Google OAuth) ✅ done — client `300508208703-p261kcl0q795veqf1p9ikm1dq8mrqnnv.apps.googleusercontent.com` configured with `http://localhost:3000/api/auth/callback/google` redirect URI.
Task #3 (Resend) ✅ done — API key wired, `onboarding@resend.dev` as sender.
Task #4 (Local sign-in verify) ✅ done 2026-05-06 — all 6 browser steps PASS, 1 user row in Neon.
Task #5 (GitHub secrets + CI green) ✅ done 2026-05-06 — 6 secrets present (`gh secret list` confirms `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM` set 2026-05-06T11:42Z); latest CI run for `b276232` (feat(01-04): live sign-in flow verified end-to-end) = ✅ success in 56s at 12:36Z.

**Next entry point:** Task #6 — Vercel deploy. User chose Path A (Vercel UI) and started import; **first build attempt FAILED** with `DATABASE_URL is not set` at "Collecting page data" phase (timestamp 23:08:01.886, error stack at `app/api/auth/[...nextauth]/route.js:6:3`). Identical failure mode to pre-secrets CI runs — `lib/db/index.ts:5-8` throws synchronously when env var is empty.

**Root cause:** The 7 env vars added during the Vercel import wizard either weren't saved or weren't attached to the **Production** environment. Vercel uses Production-scope env vars at build time for production deploys.

**Resume protocol (next session):**

1. User opens **Vercel dashboard → finance-tracker-ai → Settings → Environment Variables**
2. Verifies all 7 keys present, each with **Production + Preview + Development** ticked:
   - `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM` (values from `.env.local`)
   - `AUTH_TRUST_HOST` = literal `true`
3. Adds any missing rows; for existing rows missing Production scope, edits → ticks Production → Save.
4. **Deployments tab → ⋯ on failed deploy → Redeploy** (uncheck "Use existing Build Cache").
5. Replies with the production URL once green.

**Alternative — Path B fallback (Claude-driven CLI):**

If user prefers, Claude can run (read-only first):
```powershell
vercel link --yes --project finance-tracker-ai
vercel env ls
```
This enumerates what's actually attached without writing. With explicit per-action authorization, follow up with `vercel env add` for any missing keys + `vercel redeploy <url>` to retry.

After deploy succeeds:
- Task #4b — Add `https://<prod-domain>/api/auth/callback/google` to Google OAuth Authorized redirect URIs (GCP Console, browser-driven).
- Task #7 — Production verify + README live demo + 01-05 SUMMARY.

**Open task list (TaskList tool, ID order):**
1. Neon: get DATABASE_URL and run db:push ✅
2. Google OAuth: Client ID + Secret ✅
3. Resend: API key + verified sender ✅
4. Local sign-in verification (6 steps) ✅
5. GitHub secrets + CI green ✅
6. Vercel deploy + production OAuth callback ⏳ NEXT
7. Production verify + README live demo + 01-05 SUMMARY ⏳



---

## What's done autonomously (code-ahead)

| Plan | Wave | Status | Commits |
|------|------|--------|---------|
| 01-02 | 2 | ✅ Complete | 4 (a7912e6, 8901c22, d8ae1a3, f99d617) |
| 01-03 | 3 | ✅ Complete — code + db:push + 3 tests passing | 2 (8fb8851, b9321f5) + setup file commit |
| 01-04 | 4 | ✅ Complete — UI + 6-step browser verify all PASS, 1 user row in Neon | 1 (24ee9b0) |
| 01-05 | 5 | 🟡 Partial — CI YAML + README written + secrets set + CI green; Vercel deploy + README live demo deferred | 1 (b841341) |

**Verification still green:**
- `npm run typecheck` ✓
- `npm run lint` ✓
- `npm test` ✓ **3 passed** (sanity + db connection + schema integrity — Neon live)

**Deviation noted:**
- `proxy.ts` used instead of `middleware.ts` per Next 16 deprecation (`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` line 627). Auth.js v5 default export pattern works unchanged.
- Migration filename auto-generated as `0000_lively_tenebrous.sql` (drizzle-kit's adjective-noun naming). Journal references this tag — left as-is per plan's optional rename guidance.

---

## What's deferred (blocked on user-driven account setup)

### Wave 1 — Plan 01-01 prerequisites (5 of 6 remaining; Node already verified)

| # | Prerequisite | What user needs to do | Unblocks |
|---|--------------|----------------------|----------|
| 1 | Node ≥20 | ✅ Already verified (v24.8.0) | — |
| 2 | GitHub repo | ✅ Created at https://github.com/zeroyuekun/finance-tracker-ai (PUBLIC, pending user confirmation), origin remote set, all 11 commits pushed to main | — |
| 3 | Neon project | ✅ Done 2026-05-06 — created via `neonctl init`, DATABASE_URL applied, db:push succeeded, 3 tests passing | Plan 03 unblocked |
| 4 | Google OAuth client | Create OAuth client in https://console.cloud.google.com/, add `http://localhost:3000/api/auth/callback/google` to authorized redirects, copy Client ID + Secret | Plan 04 Google sign-in |
| 5 | Vercel account linked to GitHub | Link account at https://vercel.com/ | Plan 05 deploy |
| 6 | Resend account | Create account at https://resend.com/, get API key + verified sender (e.g. `onboarding@resend.dev`) | Plan 04 magic-link |

After completing all 6, fill the real values in `.env.local` (replacing the placeholders Claude wrote during code-ahead). Then write `PREREQS.md` documenting the captured values (the user-reply-driven file from Plan 01).

---

### Wave 3 — Plan 01-03 finishing steps ✅ COMPLETE 2026-05-06

1. ✅ `npm run db:push --force` — applied `drizzle/0000_lively_tenebrous.sql` against live Neon DB. Required `--force` because drizzle.config.ts has `strict: true` (forces TTY confirmation, fails non-interactively).
2. ✅ `tests/setup.ts` added (vitest setupFile that loads `.env.local` via dotenv) — vitest's default `import "dotenv/config"` only reads `.env`, so the skipIf gate was always firing. Setup file fixed it. `npm test` now shows **3 passed**.
3. ✅ Committed alongside the rename batch.
4. ✅ `01-03-SUMMARY.md` updated to status: complete.

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
