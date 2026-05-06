# Roadmap: Finance Tracker AI

## Overview

A 9-phase journey from empty repo to a live `*.vercel.app` URL where a real user signs up, completes a 10-question CFP onboarding, lands on a dashboard with their data, and has a tailored streaming conversation with the AI advisor — all backed by Vitest + Promptfoo evals green in CI on every PR. Phases map 1:1 to weeks 1–10 of the design SPEC §13 implementation plan, with Phase 1 covering the foundation across weeks 1–2.

**Source documents:**
- Design SPEC: `docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md` (authoritative; precedence > DOC)
- Phase 1 implementation plan: `docs/superpowers/plans/2026-05-06-phase-1-foundation.md` (1196 lines, ~30 files, 9 tasks; reference but do not overwrite)
- Synthesis intel: `.planning/intel/SYNTHESIS.md` (+ per-type files)

**Granularity:** Fine (9 phases). Driven by SPEC §13's per-week structure; preserved rather than collapsed because each week delivers a verifiable capability and downstream eval/observability work depends on prior subsystems being intact.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Next.js + TS scaffold, Auth.js v5, Drizzle/Neon, Vercel deploy, CI green (weeks 1–2)
- [ ] **Phase 2: Transactions** - Manual CRUD + CSV import (parse → map → preview → save) + default categories (week 3)
- [ ] **Phase 3: Categorization** - Rule engine + AI fallback (Gemini) + manual override creates new rules + Vitest (week 4)
- [ ] **Phase 4: Goals & Dashboard** - Goals CRUD, KPI tiles, Recharts spend chart, top-goal projection (week 5)
- [ ] **Phase 5: Onboarding** - 10-question CFP intake + profile persistence + welcome flow (week 6)
- [ ] **Phase 6: Finance Tools** - 6 deterministic TS tool functions, test-first via Vitest (week 7)
- [ ] **Phase 7: AI Advisor Chat** - Streaming chat UI + 5-layer prompt + tool calling + history (week 8)
- [ ] **Phase 8: Evals & Observability** - Promptfoo scenarios + `ai_calls` logging + `/admin/ai-stats` + Sentry (week 9)
- [ ] **Phase 9: Polish & Ship** - UX polish, responsive, README, demo video, portfolio writeup (week 10)

## Phase Details

### Phase 1: Foundation
**Goal**: A live Vercel URL exists where a real user can sign up via Google OAuth or email magic-link and reach a protected `/dashboard` placeholder, with CI green on `main`.
**Depends on**: Nothing (first phase)
**Requirements**: REQ-auth
**Success Criteria** (what must be TRUE):
  1. User can visit a public landing page at `https://<project>.vercel.app` and click "Get started"
  2. User can sign in with Google OAuth and lands on `/dashboard` with their name/email visible
  3. User can sign in with an email magic-link (Resend) and lands on `/dashboard`
  4. Unauthenticated visit to `/dashboard` redirects to `/signin?callbackUrl=/dashboard`
  5. A `user` row is visible in production Neon Postgres after first signup, and CI (`lint + typecheck + test + build`) is green on `main`
**Plans:** 1/5 plans executed

Plans:
- [ ] 01-01-PLAN.md - External account prerequisites (Node, GitHub repo, Neon, Google OAuth, Vercel, Resend); 6 user-action checkpoints + PREREQS.md write
- [x] 01-02-PLAN.md - Project scaffold: Next.js 16 + strict TS + Tailwind v4 + Vitest sanity + shadcn/ui (Button/Card/Input/Label) + landing page
- [ ] 01-03-PLAN.md - DB + Auth: Drizzle + Neon connection, Auth.js v5 schema (user/account/session/verificationToken), [BLOCKING] db:push, Auth.js v5 config (Google + Resend + DB sessions), middleware
- [ ] 01-04-PLAN.md - Sign-in UI: signin page (Google + Resend forms), protected dashboard placeholder, sign-out button, landing CTA; manual local end-to-end verification
- [ ] 01-05-PLAN.md - CI + Deploy: GitHub Actions workflow + secrets, Vercel project import + env vars, production OAuth callback, end-to-end production verification, README live demo URL

**Source spec section:** SPEC §13 (weeks 1–2), §5.1, §11, §12
**Existing implementation reference:** `docs/superpowers/plans/2026-05-06-phase-1-foundation.md` — a 1196-line, 9-task implementation plan already exists for this phase. When `/gsd-plan-phase 1` runs, it MUST consult this document and adapt rather than overwrite. The document covers prerequisites (P1–P6), file inventory (~30 files), Auth.js v5 standard schema (`user`, `account`, `session`, `verificationToken`), CI workflow at `.github/workflows/ci.yml`, and Vercel deployment steps.
**UI hint**: yes

### Phase 2: Transactions
**Goal**: A signed-in user can manually create, edit, and delete transactions, and bulk-import a CSV with a guided parse → map → preview → save flow.
**Depends on**: Phase 1
**Requirements**: REQ-transactions
**Success Criteria** (what must be TRUE):
  1. User can create a transaction with account, amount, date, description, and category
  2. User can edit and delete their own transactions; data isolates per `user_id`
  3. User can upload a CSV file and is shown a column-mapping UI before save
  4. User can preview parsed rows and confirm before final commit; original CSV row is preserved in `raw_data` JSON
  5. A signed-in user sees a default category seed available the first time they visit the transactions page
**Plans**: TBD

**Source spec section:** SPEC §13 (week 3), §5.2, §6.2 (`transactions`, `accounts`, `categories` tables)
**UI hint**: yes

### Phase 3: Categorization
**Goal**: Transactions get categorized automatically by a rule engine first, with an AI fallback for unmatched cases, and manual overrides train the system by creating new rules.
**Depends on**: Phase 2
**Requirements**: REQ-categorization
**Success Criteria** (what must be TRUE):
  1. A new transaction matching an existing rule (regex/keyword + priority) is auto-categorized without an LLM call
  2. A new transaction with no matching rule triggers a Gemini Flash fallback and persists the resulting category
  3. When a user manually changes a transaction's category, a new categorization rule is created so future similar transactions auto-match
  4. Vitest unit tests cover the rule engine's pattern + priority resolution and pass in CI
  5. The user sees a visible indicator (e.g. badge or icon) distinguishing rule-matched, AI-categorized, and manually-overridden transactions
**Plans**: TBD

**Source spec section:** SPEC §13 (week 4), §5.3, §6.2 (`categorization_rules` table)
**UI hint**: yes

### Phase 4: Goals & Dashboard
**Goal**: A signed-in user can create financial goals and see a dashboard with KPI tiles, spend-by-category chart, AI insight card, recent transactions, and a projection chart for their top goal.
**Depends on**: Phase 3
**Requirements**: REQ-goals-dashboard
**Success Criteria** (what must be TRUE):
  1. User can create, edit, and delete goals (name, target_amount, target_date, current_amount, type, status) persisted to the `goals` table
  2. Dashboard shows 4 KPI tiles: savings rate, EF tier, top-goal % complete, and this-month spend
  3. Dashboard renders a spend-by-category Recharts chart for the last 30 days
  4. Dashboard shows a projection chart for the user's top goal (target vs. current trajectory)
  5. Dashboard shows recent transactions and an AI insight card placeholder (real AI insight powered in Phase 7)
**Plans**: TBD

**Source spec section:** SPEC §13 (week 5), §5.5, §10.2, §6.2 (`goals` table)
**UI hint**: yes

### Phase 5: Onboarding
**Goal**: A first-time user is guided through a conversational, one-question-per-screen 10-question CFP intake whose answers persist into the `profiles` table and shape downstream AI behavior.
**Depends on**: Phase 4
**Requirements**: REQ-onboarding
**Success Criteria** (what must be TRUE):
  1. After first signup, a user is routed to the onboarding flow rather than directly to the dashboard
  2. User progresses through all 10 questions in order (age band → income stability → take-home → EF → debts → dependents → top goals → horizon → risk reaction → non-negotiables) with a visible progress bar
  3. All 10 answers persist correctly to `profiles` (age_band, income_band, income_stability, ef_band, debts JSON, dependents, goals JSON, top_goal_horizon, risk_score, non_negotiables JSON)
  4. After completion, the user lands on the dashboard with their profile context populated
  5. User can later view and edit their onboarding answers from the Profile page
**Plans**: TBD

**Source spec section:** SPEC §13 (week 6), §5.4, §8, §6.2 (`profiles` table)
**UI hint**: yes

### Phase 6: Finance Tools
**Goal**: All 6 deterministic finance tool functions exist in TypeScript with comprehensive Vitest coverage, ready to be invoked by the AI advisor in Phase 7. Math runs in TS, not in the LLM.
**Depends on**: Phase 5
**Requirements**: REQ-ai-advisor (tools layer)
**Success Criteria** (what must be TRUE):
  1. `calculate_savings_rate(income, expenses, period)` returns a rate in [0..1] and is covered by Vitest with edge cases (zero income, expenses > income, negative inputs)
  2. `check_emergency_fund_tier(liquid_savings, monthly_expenses)` returns `{ tier: none|starter|full|over, months_covered }` with Vitest coverage of all four tiers
  3. `simulate_debt_payoff(debts[], strategy: "avalanche"|"snowball", extra_payment)` returns `{ schedule, total_interest, months }` with Vitest coverage of avalanche vs snowball ordering and zero-debt edge cases
  4. `project_goal_completion`, `analyze_spending`, and `recommend_budget_split` each have implementations + Vitest tests with deterministic assertions
  5. All 6 tool functions pass Vitest in CI on every PR (Layer 1 evals foundation)
**Plans**: TBD

**Source spec section:** SPEC §13 (week 7), §5.6, §7.2, §9.1

### Phase 7: AI Advisor Chat
**Goal**: A signed-in user can have a streaming, framework-grounded conversation with the AI advisor that calls the deterministic tools from Phase 6, shows tool results inline, and persists conversation history.
**Depends on**: Phase 6
**Requirements**: REQ-ai-advisor (chat UI + system prompt + history)
**Success Criteria** (what must be TRUE):
  1. User can open the AI Advisor chat screen and see suggested prompts at empty state
  2. User-typed messages stream back token-by-token via Vercel AI SDK + Gemini 2.5 Flash, with the 5-layer system prompt (ROLE → HARD CONSTRAINTS → AVAILABLE FRAMEWORKS → USER CONTEXT → TOOLS) composed dynamically per request
  3. When the LLM invokes one of the 6 finance tools, the tool runs deterministically in TypeScript and renders as an inline result card in the chat
  4. Citation chips link from advisor responses to the underlying transactions or goals they reference
  5. Conversations and messages persist to the `conversations` and `messages` tables, and the user can return to a prior conversation across sessions
  6. Hard constraints visibly enforced: refuses specific stock/fund picks, escalates tax/legal questions to a real CFP, never recommends cutting non-negotiables marked in onboarding
**Plans**: TBD

**Source spec section:** SPEC §13 (week 8), §5.6, §7.1 (5-layer prompt), §7.3 (streaming + tool calls), §10.3 (UI), §6.2 (`conversations`, `messages` tables)
**UI hint**: yes

### Phase 8: Evals & Observability
**Goal**: Promptfoo scenarios prove the AI's behavior, every LLM call is logged, the owner has an `/admin/ai-stats` dashboard, Sentry catches errors, and sampled evals run on every PR.
**Depends on**: Phase 7
**Requirements**: REQ-eval-suite
**Success Criteria** (what must be TRUE):
  1. The 7 baseline Promptfoo scenarios are implemented and pass: EF shortfall flagging, debt avalanche call, snowball preference switch, 401k cashout walkthrough (no binary), ETF pick refusal, non-negotiable respect, goal feasibility computation
  2. GitHub Actions runs sampled Promptfoo scenarios on every PR; full Promptfoo suite runs nightly or on demand
  3. Every LLM request writes a row to `ai_calls` (model, prompt_hash, input_tokens, output_tokens, latency_ms, tool_calls_count, status) within 100ms of the request finishing
  4. The owner can visit `/admin/ai-stats` (owner-only auth check) and see token usage, latency distribution, and tool-call counts over a configurable time window
  5. Sentry free tier captures unhandled errors from both server and client, and Vercel Analytics shows traffic
**Plans**: TBD

**Source spec section:** SPEC §13 (week 9), §5.7, §9 (full eval design), §6.2 (`ai_calls`, `evaluations` tables), §6.3 (`/admin/ai-stats`), §11, §12
**UI hint**: yes

### Phase 9: Polish & Ship
**Goal**: The product is responsive, polished, demoable, and ready to be the centerpiece of a SWE job application — README, demo video, seed account, and portfolio writeup all in place.
**Depends on**: Phase 8
**Requirements**: (verifies all 7 v1 requirements end-to-end; introduces no new ones)
**Success Criteria** (what must be TRUE):
  1. All 9 UI screens (Landing, Onboarding, Dashboard, Transactions, Goals, AI Advisor, Profile, Settings, `/admin/ai-stats`) are responsive across mobile / tablet / desktop with no broken layouts
  2. Empty states, error states, and loading animations are present on every primary flow
  3. README contains the personal-story narrative, architecture diagram, eval results screenshot, demo GIF, live demo URL, and lessons learned
  4. A ~3-minute demo video walks through personal story → product flow → tech depth (DB schema → LLM tool calling → eval design)
  5. A seed/demo account exists so a recruiter can explore the product without signing up, and the full user journey (signup → 10-question onboarding → dashboard → AI conversation) works end-to-end on the live URL
**Plans**: TBD

**Source spec section:** SPEC §13 (week 10), §17 (success criteria)
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 1/5 | In Progress|  |
| 2. Transactions | 0/TBD | Not started | - |
| 3. Categorization | 0/TBD | Not started | - |
| 4. Goals & Dashboard | 0/TBD | Not started | - |
| 5. Onboarding | 0/TBD | Not started | - |
| 6. Finance Tools | 0/TBD | Not started | - |
| 7. AI Advisor Chat | 0/TBD | Not started | - |
| 8. Evals & Observability | 0/TBD | Not started | - |
| 9. Polish & Ship | 0/TBD | Not started | - |

---
*Roadmap defined: 2026-05-06 from new-project-from-ingest synthesis*
*Source SPEC: `docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md` §13*
