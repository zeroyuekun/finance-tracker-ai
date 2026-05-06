# Requirements (PRD-derived)

> **Source policy:** ADR > SPEC > PRD > DOC. This file aggregates user-facing requirements extracted from PRD-class sources. Note: the design SPEC contains a "Functional requirements (MVP)" section (§5); for transparency those are mirrored below as SPEC-sourced requirements so downstream roadmapping has a single requirements view, but they remain governed by the SPEC's precedence (higher than PRD).

## Status

**No PRDs ingested.** The ingest set contained 1 SPEC and 1 DOC. The seven MVP requirements below are extracted from the SPEC (§5) and are mirrored here for downstream consumers; their authoritative source remains the SPEC.

---

## REQ-auth

- **Title:** Authentication (email + Google OAuth)
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.1
- **Description:** Users sign up and sign in via email magic-link or Google OAuth, managed by Auth.js v5 with database-backed sessions.
- **Acceptance criteria:**
  - Sign-in supports email magic-link and Google OAuth
  - Sessions persist via Auth.js Drizzle adapter against Postgres
  - Protected routes redirect unauthenticated users to `/signin`
  - Production OAuth callback URL whitelisted in Google Cloud Console
- **Scope:** auth subsystem
- **Cross-doc note:** Phase 1 plan (DOC) implements this requirement in Tasks 5–7. DOC chooses Resend for the email provider; SPEC does not name a provider. Treated as compatible (DOC adds implementation detail consistent with SPEC).

---

## REQ-transactions

- **Title:** Transactions CRUD + CSV import
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.2
- **Description:** Users manually create, read, update, delete transactions, and bulk-import via CSV with a parse → column-map → preview → confirm flow.
- **Acceptance criteria:**
  - Manual transaction CRUD with account, amount, date, description, category
  - CSV import preserves raw data in `raw_data` JSON column
  - Column-mapping UI before save
  - Preview step before final commit
- **Scope:** transactions subsystem (post-Phase-1)

---

## REQ-categorization

- **Title:** Categorization engine (rules + AI fallback + manual override)
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.3
- **Description:** Two-stage categorization: regex/keyword rule engine first, AI fallback (Gemini Flash) for misses, with manual overrides that create new rules.
- **Acceptance criteria:**
  - Rule engine matches transactions to categories by pattern + priority
  - AI fallback invoked only when no rule matches
  - Manual category change persists as a new rule for future similar transactions
  - Vitest unit tests for rule engine
- **Scope:** categorization subsystem (post-Phase-1)

---

## REQ-onboarding

- **Title:** 10-question CFP onboarding intake
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.4, §8
- **Description:** Conversational, one-question-per-screen onboarding flow capturing CFP-grade financial context that drives downstream AI advice behavior.
- **Acceptance criteria:**
  - 10 questions in order: age band, income stability, monthly take-home, emergency fund, debts, dependents, top 1–3 goals, top-goal horizon, risk reaction, non-negotiable spending
  - Progress bar visible
  - Answers persist into `profiles` table (age_band, income_band, income_stability, ef_band, debts JSON, dependents, goals JSON, top_goal_horizon, risk_score, non_negotiables JSON)
  - Each question maps to AI behavior (Q4 → EF tier check, Q5 → debt strategy choice, Q9 → risk-adjusted tone, Q10 → AI never suggests cutting these categories)
- **Scope:** onboarding subsystem (post-Phase-1)

---

## REQ-goals-dashboard

- **Title:** Goals + Dashboard
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.5, §10.2
- **Description:** Goals CRUD plus a dashboard showing KPI tiles (savings rate, EF tier, top-goal %, this-month spend), spend-by-category chart, AI insight card, and recent transactions.
- **Acceptance criteria:**
  - Goals CRUD persists to `goals` table
  - Dashboard renders 4 KPI tiles + spend chart (Recharts) + insight card + recent-transactions list
  - Projection chart for top goal
- **Scope:** goals + dashboard subsystem (post-Phase-1)

---

## REQ-ai-advisor

- **Title:** AI advisor chat (streaming, tool-calling, framework-grounded)
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.6, §7, §10.3
- **Description:** Full-screen conversational advisor with token-by-token streaming, deterministic finance tool calls visible inline, citation chips linking to user data, suggested prompts at empty state, and persistent conversation history.
- **Acceptance criteria:**
  - 5-layer system prompt composed per-request (role, hard constraints, frameworks, user context, tools)
  - 6 tool functions implemented in TypeScript: `calculate_savings_rate`, `check_emergency_fund_tier`, `simulate_debt_payoff`, `project_goal_completion`, `analyze_spending`, `recommend_budget_split`
  - Math runs deterministically in TS, never in the LLM head
  - Streaming UI via Vercel AI SDK
  - Tool calls render as inline result cards
  - Citation chips link to underlying transactions
  - Conversation history persists across sessions in `conversations` + `messages` tables
  - Hard constraints enforced: no specific stock/fund picks, escalate tax/legal to real CFP, never recommend cutting non-negotiables
- **Scope:** AI advisor subsystem (post-Phase-1)

---

## REQ-eval-suite

- **Title:** Eval suite (Vitest tools + Promptfoo LLM behavior)
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §5.7, §9
- **Description:** Two-layer evaluation: Vitest unit tests on deterministic finance tools (Layer 1), Promptfoo scenarios on LLM behavior (Layer 2), both running in CI on every PR.
- **Acceptance criteria:**
  - Vitest covers all 6 finance tools with deterministic assertions
  - Promptfoo defines at least 7 scenarios (per §9.2 table): EF shortfall, debt avalanche, snowball preference, 401k cashout, ETF pick refusal, non-negotiable respect, goal feasibility
  - Sampled Promptfoo scenarios run on every PR via GitHub Actions
  - Full Promptfoo suite runs nightly or on demand
- **Scope:** eval subsystem (post-Phase-1)

---

*End of requirements.md*
