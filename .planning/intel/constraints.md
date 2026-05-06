# Constraints (SPEC-derived)

> **Source policy:** ADR > SPEC > PRD > DOC. Constraints in this file flow from the design SPEC (high precedence) and binding implementation choices in the Phase 1 DOC (lower precedence). Where the DOC adds detail not covered by the SPEC, both are recorded with attribution.

---

## C-tech-stack (technology choices)

- **Type:** nfr / technology
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §11
- **Constraint:**
  - Framework: Next.js 16 (App Router) + TypeScript
  - Database: Neon Postgres + Drizzle ORM
  - Auth: Auth.js v5 (NextAuth)
  - LLM (production): Google Gemini 2.5 Flash via Vercel AI SDK
  - LLM (dev/eval): Anthropic Claude
  - AI SDK: Vercel AI SDK (provider-agnostic)
  - UI: Tailwind CSS + shadcn/ui
  - Charts: Recharts (or Tremor)
  - Evals: Vitest + Promptfoo
  - Errors: Sentry free tier (5k events/mo)
  - AI ops: custom `ai_calls` table + `/admin/ai-stats` page
  - Hosting: Vercel Hobby
  - CI: GitHub Actions
- **Rationale:** $0/month operating cost at portfolio scale; recruiter-recognized stack; provider-agnostic AI SDK enables one-line LLM swaps if pricing/availability changes.

## C-phase1-tech (Phase 1 binding implementation detail)

- **Type:** technology / implementation
- **Source:** docs/superpowers/plans/2026-05-06-phase-1-foundation.md (Tech Stack header + Tasks 1–9)
- **Constraint:**
  - Tailwind CSS v4 (specific major version)
  - shadcn/ui style: New York; base color: Neutral or Zinc; CSS variables: Yes
  - Auth.js v5 via `next-auth@beta`
  - Drizzle adapter: `@auth/drizzle-adapter`
  - Email magic-link provider: Resend (`AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM`)
  - Node version: 20 LTS (pinned via `.nvmrc`)
  - Next.js dev server uses Turbopack (`next dev --turbopack`)
- **Rationale:** Concrete bindings for Phase 1 implementation. SPEC §11 names the categories; this constraint names the specific versions/providers used to satisfy them. No conflict — DOC adds detail consistent with SPEC.

## C-cost-budget (operational cost ceiling)

- **Type:** nfr
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §2, §11
- **Constraint:** Total operational cost must remain at $0/month at portfolio scale (<100 users) for the MVP.
- **Implications:** No paid services; rely on free tiers (Vercel Hobby, Neon free, Gemini free tier 250 req/day, Sentry free 5k events/mo, GitHub Actions free for public repos, Resend free tier). Custom domain ($12/yr) is optional and out of v1 budget.
- **Risk note:** Vercel Hobby plan bans commercial use; portfolio is non-commercial, but if monetizing later, migrate to Cloudflare Pages.

## C-ship-budget (time and effort budget)

- **Type:** nfr / schedule
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §1 (header), §13
- **Constraint:** Ship MVP in ~10 weeks at ~10–12 hrs/week. Buffer weeks 11–12 absorb spillover.
- **Phase 1 sub-budget:** ~20–24 hours over weeks 1–2 (DOC).

## C-data-model (Postgres schema constraint)

- **Type:** schema
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §6.2
- **Constraint:** The data model must include the following tables (full MVP set):
  - `users` — id, email, oauth_provider, created_at
  - `profiles` — user_id, age_band, income_band, income_stability, ef_band, debts (JSON), dependents, goals (JSON), top_goal_horizon, risk_score, non_negotiables (JSON)
  - `accounts` — id, user_id, name, type (cash/credit/savings)
  - `transactions` — id, user_id, account_id, amount, date, description, category_id, raw_data (JSON)
  - `categories` — id, user_id, name, parent_id, type (income/expense)
  - `categorization_rules` — id, user_id, pattern, category_id, priority, confidence
  - `goals` — id, user_id, name, target_amount, target_date, current_amount, type, status
  - `conversations` — id, user_id, started_at, last_message_at, summary
  - `messages` — id, conversation_id, role, content, tool_calls (JSON), created_at
  - `ai_calls` — id, user_id, model, prompt_hash, input_tokens, output_tokens, latency_ms, tool_calls_count, status, created_at
  - `evaluations` — id, scenario, expected, actual, passed, run_at
- **Phase 1 subset (DOC):** Auth.js standard tables only — `user`, `account`, `session`, `verificationToken` (Auth.js standard schema, table names lowercase singular). Domain tables added in later phases.
- **Cross-doc note:** SPEC names `users` (plural) with fields `id, email, oauth_provider, created_at`. DOC implements Auth.js v5 standard `user` (singular) table with fields `id, name, email, emailVerified, image, createdAt`. The `oauth_provider` column from SPEC is satisfied by the related `account` table (Auth.js pattern), which carries provider info per linked account. **No conflict** — SPEC's `users` table is the conceptual model; DOC's Auth.js standard schema is the binding implementation. Treated as the same constraint with the implementation expanded.

## C-ai-advisor-prompt (5-layer system prompt structure)

- **Type:** protocol / api-contract
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §7.1
- **Constraint:** The AI advisor system prompt must be composed dynamically per request from 5 layers in fixed order:
  1. ROLE — "personal finance advisor grounded in CFP frameworks"
  2. HARD CONSTRAINTS — show math; no stock/fund picks; escalate tax/legal to real CFP; ask clarifying questions before consequential claims; never recommend cutting non-negotiables
  3. AVAILABLE FRAMEWORKS — 50/30/20, Zero-based, Envelope, Debt avalanche, Debt snowball, EF tiering, Savings rate by life stage, Pay-yourself-first, Sinking funds
  4. USER CONTEXT — profile (onboarding answers), active goals + progress, spend pattern (top categories last 30 days)
  5. TOOLS — the 6 tool function references

## C-finance-tools (deterministic tool function contracts)

- **Type:** api-contract
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §7.2
- **Constraint:** Six TypeScript tool functions, deterministic, math-in-TS-not-in-LLM:
  - `calculate_savings_rate(income, expenses, period) → rate (0..1)`
  - `check_emergency_fund_tier(liquid_savings, monthly_expenses) → { tier: none|starter|full|over, months_covered }`
  - `simulate_debt_payoff(debts[], strategy: "avalanche"|"snowball", extra_payment) → { schedule, total_interest, months }`
  - `project_goal_completion(goal, current_savings_rate, monthly_surplus) → { projected_date, scenarios }`
  - `analyze_spending(period, optional_category) → { breakdown, trends, outliers }`
  - `recommend_budget_split(income, framework) → { category_allocations }`
- **Critical invariant:** All math runs in TypeScript, not in the LLM. The LLM only orchestrates which tool to call and how to explain the result. This makes advice trustworthy and testable via Vitest.

## C-eval-strategy (two-layer eval contract)

- **Type:** protocol
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §9
- **Constraint:**
  - **Layer 1 (Vitest):** Pure-TS unit tests on the 6 finance tool functions. Zero LLM involvement. Runs on every PR.
  - **Layer 2 (Promptfoo):** Scenario-based LLM behavior tests covering at least the 7 scenarios in SPEC §9.2 table. Sampled scenarios run on every PR via GitHub Actions; full suite runs on a slower cadence (nightly/on-demand).

## C-non-goals (explicit v1 exclusions)

- **Type:** scope / nfr
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §3
- **Constraint:** The following are explicitly excluded from v1 and must not be implemented in the 10-week MVP:
  - Plaid bank sync
  - Native mobile app (responsive web only)
  - Voice interface
  - Couples / multi-user
  - Multi-currency
  - Investment / retirement / tax planning
  - Subscription / recurring detection
  - Fine-tuned or custom models (general-purpose LLMs only)
- **Disposition:** All listed in §15 backlog for post-MVP consideration.

## C-deployment-pipeline (CI/CD contract)

- **Type:** protocol
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §12; docs/superpowers/plans/2026-05-06-phase-1-foundation.md Task 8
- **Constraint:**
  - On PR: GitHub Actions runs lint + type-check + Vitest + Promptfoo (sampled) + build check
  - On merge to `main`: Vercel auto-deploys
  - Drizzle migrations run against Neon Postgres prod branch
  - Live URL pattern: `https://<project>.vercel.app`
- **Phase 1 binding (DOC):** CI workflow at `.github/workflows/ci.yml` with jobs: Lint · Typecheck · Test · Build. Repository secrets: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM`. Promptfoo eval job is added in a later phase per the SPEC §13 schedule (week 9).

## C-observability (AI ops + error tracking)

- **Type:** nfr
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §6.3 (`/admin/ai-stats`), §11, §12
- **Constraint:**
  - Sentry free tier for app errors
  - Custom `ai_calls` table records per-request: model, prompt_hash, input_tokens, output_tokens, latency_ms, tool_calls_count, status
  - `/admin/ai-stats` owner-only dashboard surfaces token usage, latency, tool call counts
  - Vercel Analytics for traffic

## C-privacy (data isolation + deletion)

- **Type:** nfr / security
- **Source:** docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md §14
- **Constraint:**
  - Auth + secure cookies + CSRF protection on all authenticated routes
  - All user data isolated per `user_id` foreign key
  - Full-account-delete option must be available in Settings

---

*End of constraints.md*
