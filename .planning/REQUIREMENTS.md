# Requirements: Finance Tracker AI

**Defined:** 2026-05-06
**Core Value:** A user can complete a 10-question CFP onboarding and have a tailored, framework-grounded conversation with an AI advisor whose math runs in deterministic TypeScript tools — and a recruiter can see the eval suite proving the advice is correct.

> **Source of truth:** These 7 requirements are extracted from the design SPEC (§5) at `docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md` and mirrored from `.planning/intel/requirements.md`. SPEC remains authoritative; this file is the consumer-facing roadmap-traceable view.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication

- [ ] **REQ-auth**: Authentication (email magic-link + Google OAuth)
  - Sign-in supports email magic-link (Resend provider) and Google OAuth
  - Sessions persist via Auth.js v5 Drizzle adapter against Neon Postgres
  - Protected routes redirect unauthenticated users to `/signin`
  - Production OAuth callback URL whitelisted in Google Cloud Console
  - **Source:** SPEC §5.1 · DOC Tasks 5–7

### Transactions

- [ ] **REQ-transactions**: Transactions CRUD + CSV import
  - Manual transaction CRUD with account, amount, date, description, category
  - CSV import preserves raw data in `raw_data` JSON column
  - Column-mapping UI before save
  - Preview step before final commit
  - Default category seed available
  - **Source:** SPEC §5.2

### Categorization

- [ ] **REQ-categorization**: Categorization engine (rules + AI fallback + manual override)
  - Rule engine matches transactions to categories by pattern + priority
  - AI fallback (Gemini Flash) invoked only when no rule matches
  - Manual category change persists as a new rule for future similar transactions
  - Vitest unit tests for rule engine
  - **Source:** SPEC §5.3

### Onboarding

- [ ] **REQ-onboarding**: 10-question CFP onboarding intake
  - 10 questions in order: age band, income stability, monthly take-home, emergency fund, debts, dependents, top 1–3 goals, top-goal horizon, risk reaction, non-negotiable spending
  - One question per screen with progress bar
  - Answers persist into `profiles` table (age_band, income_band, income_stability, ef_band, debts JSON, dependents, goals JSON, top_goal_horizon, risk_score, non_negotiables JSON)
  - Each question maps to AI behavior (Q4 → EF tier check, Q5 → debt strategy choice, Q9 → risk-adjusted tone, Q10 → AI never suggests cutting these categories)
  - **Source:** SPEC §5.4, §8

### Goals & Dashboard

- [ ] **REQ-goals-dashboard**: Goals + Dashboard
  - Goals CRUD persists to `goals` table (name, target_amount, target_date, current_amount, type, status)
  - Dashboard renders 4 KPI tiles (savings rate, EF tier, top-goal %, this-month spend)
  - Spend-by-category Recharts chart
  - AI insight card on dashboard
  - Recent transactions list on dashboard
  - Projection chart for top goal
  - **Source:** SPEC §5.5, §10.2

### AI Advisor

- [ ] **REQ-ai-advisor**: AI advisor chat (streaming, tool-calling, framework-grounded)
  - 5-layer system prompt composed per-request: ROLE → HARD CONSTRAINTS → AVAILABLE FRAMEWORKS → USER CONTEXT → TOOLS
  - 6 tool functions implemented in TypeScript (deterministic math, never in LLM head):
    - `calculate_savings_rate(income, expenses, period) → rate (0..1)`
    - `check_emergency_fund_tier(liquid_savings, monthly_expenses) → { tier, months_covered }`
    - `simulate_debt_payoff(debts[], strategy, extra_payment) → { schedule, total_interest, months }`
    - `project_goal_completion(goal, current_savings_rate, monthly_surplus) → { projected_date, scenarios }`
    - `analyze_spending(period, optional_category) → { breakdown, trends, outliers }`
    - `recommend_budget_split(income, framework) → { category_allocations }`
  - Streaming chat UI via Vercel AI SDK (token-by-token)
  - Tool calls render as inline result cards
  - Citation chips link to underlying transactions
  - Suggested prompts at empty state
  - Conversation history persists across sessions (`conversations` + `messages` tables)
  - Hard constraints enforced: no specific stock/fund picks; escalate tax/legal to real CFP; never recommend cutting non-negotiables
  - **Source:** SPEC §5.6, §7, §10.3

### Eval Suite

- [ ] **REQ-eval-suite**: Eval suite (Vitest tools + Promptfoo LLM behavior)
  - Layer 1 (Vitest): pure-TS unit tests on all 6 finance tool functions; runs every PR
  - Layer 2 (Promptfoo): at least 7 baseline scenarios per SPEC §9.2 — EF shortfall, debt avalanche, snowball preference, 401k cashout refusal, ETF pick refusal, non-negotiable respect, goal feasibility
  - Sampled Promptfoo scenarios run on every PR via GitHub Actions
  - Full Promptfoo suite runs nightly or on demand
  - `ai_calls` table logs every LLM request (model, prompt_hash, tokens, latency, tool calls, status)
  - `/admin/ai-stats` owner-only dashboard surfaces token usage, latency, tool call counts
  - Sentry free tier for app errors
  - **Source:** SPEC §5.7, §9, §6.3, §11, §12

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Bank Sync

- **BANK-01**: Plaid (US) bank sync — auto-ingest transactions
- **BANK-02**: TrueLayer (UK) bank sync
- **BANK-03**: Tink (EU) bank sync

### Multimodal & Voice

- **VOICE-01**: Voice interface (OpenAI Realtime / Claude Voice Mode)
- **OCR-01**: Receipt OCR via multimodal Gemini

### Mobile

- **MOBILE-01**: Native mobile app (React Native or PWA)

### Multi-User

- **MULTI-01**: Couples / shared mode (multi-user data model)

### Currency

- **CUR-01**: Multi-currency support

### Investment & Tax

- **INV-01**: Investment tracking
- **TAX-01**: Tax planning module

### Other Backlog

- **SUB-01**: Subscription / recurring detection
- **MEM-01**: Long-term memory / agent persistence
- **BENCH-01**: Public benchmark dashboard for AI advice quality
- **SIM-01**: "What-if" simulator (raise / move / job loss scenarios)

## Out of Scope (v1)

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Plaid bank sync | Out-of-budget complexity for 10-week MVP; CSV covers ingestion. v2 backlog. |
| Native mobile | Responsive web only; mobile later. v2 backlog. |
| Voice interface | Defer until conversational UX is solid. v2 backlog. |
| Couples / multi-user | Single-user data model in v1. v2 backlog. |
| Multi-currency | Single currency v1. v2 backlog. |
| Investment / retirement / tax planning | Hard advisor-side constraint: AI escalates to real CFP. No v1 surface. |
| Subscription / recurring detection | Backlog. |
| Fine-tuned or custom models | General-purpose LLMs only (Gemini 2.5 Flash production, Claude dev/eval). |
| Custom domain | Stay on `*.vercel.app` for v1; $12/yr is optional, out-of-budget. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

> **Note on REQ-ai-advisor:** This requirement spans Phase 6 (deterministic TS tool implementation, test-first per SPEC §13 week 7) and Phase 7 (streaming chat UI, system prompt assembly, tool wiring, history). Primary mapping is Phase 7 (the user-visible advisor surface); Phase 6 is the prerequisite tool layer. Both phases must complete for REQ-ai-advisor to be satisfied.

| Requirement | Phase | Status |
|-------------|-------|--------|
| REQ-auth | Phase 1 | Pending |
| REQ-transactions | Phase 2 | Pending |
| REQ-categorization | Phase 3 | Pending |
| REQ-goals-dashboard | Phase 4 | Pending |
| REQ-onboarding | Phase 5 | Pending |
| REQ-ai-advisor (tools) | Phase 6 | Pending |
| REQ-ai-advisor (chat UI) | Phase 7 | Pending |
| REQ-eval-suite | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0 ✓

> Phase 9 (Polish + Ship) introduces no new requirements; it verifies the entire v1 surface end-to-end against this requirements list and produces the README + demo video that close out the project.

---
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-06 after new-project-from-ingest synthesis*
