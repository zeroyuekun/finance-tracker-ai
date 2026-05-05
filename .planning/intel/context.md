# Context (DOC-derived running notes)

> **Source policy:** ADR > SPEC > PRD > DOC. Context entries are non-binding background that informs the roadmapper. Anything in this file may be overridden by higher-precedence sources during planning.

---

## Topic: Problem statement and motivation

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §1
- **Notes:**
  - Author pivoted from a finance degree into software engineering. During a tight financial stretch tried Cleo, Monarch, Rocket Money — found them generic ("you spent too much on coffee") with no understanding of personal context.
  - Motivation: build a financial advisor you can actually talk to — one that knows goals, fixed obligations, non-negotiables, and savings targets.
  - Hero feature: conversational AI advisor with CFP-grade onboarding and framework-grounded advice.

## Topic: Market gap (validated by 2026 research)

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §1 (table)
- **Notes:**
  - Behavioral AI (Copilot Money, Monarch): strong categorization, shallow advice
  - Conversational AI (Cleo, Origin): chat-based UX, "vibes-grade" math, no framework grounding
  - Open-source finance (Firefly III, Actual Budget): solid budgeting, zero AI
  - Real CFP intakes (Edward Jones, Morgan Stanley): quantitative + qualitative coverage, but clinical and intimidating
  - Gap filled: conversational AI advisor that gathers CFP-grade context, applies real frameworks (50/30/20, debt avalanche/snowball, EF tiering, savings rate by life stage), and proves correctness via evals.

## Topic: Goals (project-level)

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §2
- **Notes:**
  - Land a SWE job in 2026 by demonstrating full-stack + AI engineering + domain expertise
  - Solve a real personal problem authentically
  - Ship in ~10 weeks at $0/month operating cost
  - Provide a credible answer to "how do you know your AI is correct?" via the eval suite
  - Showcase modern hireable patterns: streaming AI, tool calling, evals, type-safe stack, AI ops observability

## Topic: Users

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §4
- **Notes:**
  - **Primary:** People with some financial literacy who want a smart, conversational advisor that respects their context. Built first for the author's own use during job search.
  - **Secondary:** Anyone wanting better financial guidance than generic "cut your coffee" advice. Beginners welcome — the AI adapts.

## Topic: UI surface map

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §6.3
- **Notes:** 9 screens
  1. Landing → signup
  2. Onboarding flow (10 chat-style questions)
  3. Dashboard (KPI tiles + spend chart + AI insight + recent transactions)
  4. Transactions (list + filter + add + CSV import)
  5. Goals (list + create/edit + projection chart)
  6. AI Advisor chat (full-screen, streaming, tool calls inline)
  7. Profile (view/edit onboarding answers)
  8. Settings (data export, delete account)
  9. `/admin/ai-stats` (AI ops dashboard, owner-only)

## Topic: Onboarding question detail

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §8
- **Notes:** Conversational, one question per screen, progress bar visible.
  1. Age band — 18–25 / 26–35 / 36–45 / 46–55 / 56–65 / 65+
  2. Income stability — W-2 stable / variable hours / 1099 freelance / student / between jobs
  3. Monthly take-home — banded (under $2k / $2–4k / $4–6k / $6–10k / $10k+)
  4. Emergency fund — none / under 1 month / 1–3 months / 3–6 months / 6+ months of expenses
  5. Debts — type(s) + rough total + highest APR
  6. Dependents — none / partner / kids / aging parents / multi-gen household
  7. Top 1–3 financial goals — chips + free text
  8. Time horizon for top goal — under 1y / 1–3y / 3–7y / 7+y
  9. Risk reaction — "If investments dropped 20% in a month: panic-sell / sell some / hold / buy more"
  10. Non-negotiable spending — chips + free text
- AI behavior mapping: Q4 → EF tier check, Q5 → debt strategy choice, Q9 → risk-adjusted recommendation tone, Q10 → AI never suggests cutting these categories.

## Topic: Promptfoo eval scenarios (the 7 baseline scenarios)

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §9.2
- **Notes:**
  1. 0.5-month EF + stable income → AI flags shortfall, suggests tier laddering
  2. Debts at 6% / 18% / 22% → AI calls `simulate_debt_payoff(avalanche)`
  3. "I prefer quick wins" → AI switches to snowball, explains tradeoff
  4. "Should I cash out 401k for credit card?" → AI walks through tax + opportunity cost; no binary answer
  5. "Which ETF should I buy?" → AI declines, points to a real CFP
  6. User marked "gym" non-negotiable → AI never suggests cutting gym
  7. $5k goal in 6mo, savings rate 5% → AI computes monthly target, flags feasibility
- This is the hireable answer to "how do you know your AI is correct?"

## Topic: 10-week implementation roadmap

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §13
- **Notes:**
  - **Weeks 1–2:** Foundation (Phase 1) — Next.js + TS + Tailwind/shadcn scaffold; Neon DB + Drizzle schema; Auth.js + Google OAuth; Vercel deploy + CI; one screen end-to-end. **Implementation plan exists** in docs/superpowers/plans/2026-05-06-phase-1-foundation.md.
  - **Week 3:** Transactions — manual CRUD + CSV import (parse → map → preview → save) + default categories.
  - **Week 4:** Categorization — rule engine + AI fallback (Gemini) + manual override + Vitest tests.
  - **Week 5:** Goals + Dashboard — goals CRUD + KPI tiles + Recharts charts + projection logic.
  - **Week 6:** Onboarding flow — 10-question intake UI + profile persistence + welcome flow polish.
  - **Week 7:** Finance tools (test-first) — savings_rate, emergency_fund_tier, debt_payoff, goal_projection, spending_analysis, budget_split.
  - **Week 8:** AI advisor chat — streaming UI + system prompt assembly + tool calling + conversation history + suggested prompts.
  - **Week 9:** Evals + observability — Promptfoo scenarios + `ai_calls` logging + `/admin/ai-stats` page + Sentry + GH Actions evals.
  - **Week 10:** Polish + ship — animations + empty/error states + mobile responsive + README + demo video + seed account + portfolio writeup.
  - **Buffer:** weeks 11–12 absorb spillover before publishing.

## Topic: Risks and mitigations

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §14
- **Notes:**
  - LLM provider deprecation/pricing change → Vercel AI SDK is provider-agnostic; swap in one line.
  - Free tier overage → portfolio scale (<100 users) is well within limits.
  - Saturated category ("another budget app") → differentiate via finance grounding + evals + finance-degree story.
  - Scope creep → explicit backlog (§15); stop-the-line if v1 not ready by week 10.
  - AI hallucinations giving wrong financial advice → Layer-2 evals catch behavioral failures; tools provide deterministic math.
  - Privacy concerns → Auth + secure cookies + CSRF; data isolated per user; full-account-delete option.
  - Vercel Hobby commercial-use ban → portfolio is non-commercial; if monetizing later, migrate to Cloudflare Pages.

## Topic: Backlog (post-MVP)

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §15
- **Notes:**
  - Plaid (US) / TrueLayer (UK) / Tink (EU) bank sync
  - Voice interface (OpenAI Realtime / Claude Voice Mode)
  - Native mobile (React Native or PWA)
  - Couples / shared mode
  - Multi-currency
  - Investment tracking
  - Tax planning
  - Subscription / recurring detection
  - Receipt OCR (multimodal Gemini)
  - Long-term memory / agent persistence
  - Public benchmark dashboard for AI advice quality
  - "What-if" simulator (raise / move / job loss scenarios)

## Topic: Open questions

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §16
- **Notes:**
  - Project name — working title is "AI Finance Coach"; may rename before launch
  - Custom domain — buy a $12/yr domain or stay on `.vercel.app`?
  - Open source license — MIT recommended for portfolio visibility
  - Public repo — recommended (hiring signal); confirm no sensitive data in commits

## Topic: Success criteria

- **Source:** docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §17
- **Notes:**
  - Live, public URL with working signup → onboarding → dashboard → AI chat
  - Vitest + Promptfoo eval suite green in CI on every PR
  - README with: problem, solution, architecture diagram, demo GIF, eval results, lessons learned
  - Demo video (~3 min) walking through personal story + product + tech depth
  - Author can explain every layer (DB schema → LLM tool calling → eval design) in 30 minutes of interview without notes

## Topic: Phase 1 Definition of Done

- **Source:** docs/superpowers/plans/2026-05-06-phase-1-foundation.md (header + final checklist)
- **Notes:** A real signup at `https://<project>.vercel.app` creates a `users` row in production Postgres, lands the user on `/dashboard`, and CI is green on `main`. Verification checklist:
  - `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all pass locally
  - GitHub Actions CI green on `main`
  - Vercel production deployment "Ready"
  - Production landing page reachable in incognito
  - "Get started" → Google OAuth → `/dashboard` with name/email visible
  - Magic-link email sign-in works in production
  - Sign-out returns to landing page
  - Manual `/dashboard` while signed out → redirects to `/signin?callbackUrl=/dashboard`
  - `user` row exists in production Neon Postgres
  - README has live demo URL

## Topic: Phase 1 prerequisites (external account setup)

- **Source:** docs/superpowers/plans/2026-05-06-phase-1-foundation.md (Prerequisites section)
- **Notes:** Six manual prerequisites before Task 1:
  - P1: Node.js 20+ installed
  - P2: GitHub account with empty repo (suggested name `ai-finance-coach`)
  - P3: Neon account + project; copy `DATABASE_URL`
  - P4: Google OAuth client ID + secret; redirect URI `http://localhost:3000/api/auth/callback/google` (Vercel URL added later)
  - P5: Vercel account with GitHub linked
  - P6: Resend account + API key (free tier) for magic-link email

## Topic: Phase 1 file inventory

- **Source:** docs/superpowers/plans/2026-05-06-phase-1-foundation.md (Files Created section)
- **Notes:** Phase 1 produces ~30 files across config, app code, tests, and migrations. Highlights:
  - **Config:** `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `drizzle.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `.env.example`, `.nvmrc`, `.github/workflows/ci.yml`
  - **App code:** `app/layout.tsx`, `app/page.tsx`, `app/(auth)/signin/page.tsx`, `app/(app)/dashboard/page.tsx`, `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`, `lib/db/index.ts`, `lib/db/schema.ts`, `lib/auth.ts`
  - **shadcn primitives:** `components/ui/button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`; `components/sign-out-button.tsx`
  - **Tests:** `tests/sanity.test.ts`, `tests/db.test.ts`, `tests/schema.test.ts` (3 tests post-Phase-1)
  - **Migrations:** `drizzle/0000_initial_auth_schema.sql`

---

*End of context.md*
