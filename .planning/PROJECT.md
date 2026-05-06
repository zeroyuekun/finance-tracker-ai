# Finance Tracker AI

> **Project name status:** Working title. May be renamed before launch (see Open Questions below). All artifacts can be relabeled in place — the title is metadata, not a locked decision.

## What This Is

A conversational AI personal finance advisor that gathers CFP-grade context through a 10-question onboarding intake, then delivers framework-grounded advice (50/30/20, debt avalanche/snowball, emergency-fund tiering, savings rate by life stage) through a streaming chat UI. Built first for the author's own use during a finance-degree-to-SWE pivot, secondarily for anyone who wants better than "you spent too much on coffee" guidance.

## Core Value

A user can complete a 10-question CFP onboarding and have a tailored, framework-grounded conversation with an AI advisor whose math runs in deterministic TypeScript tools — and a recruiter can see the eval suite proving the advice is correct.

## Author Context

- Pivoting from a finance degree to software engineering.
- Project goal: portfolio piece that lands a SWE job in 2026 by demonstrating full-stack + AI engineering + domain expertise.
- Personal motivation: tried Cleo / Monarch / Rocket Money during a tight financial stretch; found them generic with no understanding of personal context. Wanted an advisor that knows goals, fixed obligations, non-negotiables, and savings targets.
- Hireable angle: the eval suite (Vitest tools + Promptfoo scenarios) is the credible answer to "how do you know your AI is correct?"

## Developer-Facing Success Metric

Success = all of the following are simultaneously true at the end of week 10:

1. Live deployed URL on Vercel where a real user can sign up, complete the 10-question CFP onboarding, see a dashboard with their data, and have a tailored conversation with the framework-grounded AI advisor.
2. Vitest + Promptfoo eval suites green in CI on every PR.
3. README with personal-story narrative, architecture diagram, eval results, and demo video (~3 min).
4. Total operating cost: $0/month at portfolio scale (<100 users).
5. Author can explain every layer (DB schema → LLM tool calling → eval design) in 30 minutes of interview without notes.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- v1 scope. Building toward these. Full detail in REQUIREMENTS.md. -->

- [ ] **REQ-auth** — Authentication (email magic-link + Google OAuth) via Auth.js v5
- [ ] **REQ-transactions** — Manual transaction CRUD + CSV import (parse → map → preview → save)
- [ ] **REQ-categorization** — Rule engine + AI fallback + manual override (creates new rules)
- [ ] **REQ-onboarding** — 10-question CFP intake persisting to `profiles` table
- [ ] **REQ-goals-dashboard** — Goals CRUD + KPI tiles + Recharts chart + projection
- [ ] **REQ-ai-advisor** — Streaming chat UI + 5-layer system prompt + 6 deterministic TS tools + history
- [ ] **REQ-eval-suite** — Vitest unit tests on tools + Promptfoo scenarios on LLM behavior, both in CI

### Out of Scope (v1)

<!-- Explicit boundaries. Reasons recorded to prevent re-adding. -->

- **Plaid bank sync** — Out-of-budget complexity for 10-week MVP; CSV import covers ingestion. Backlog.
- **Native mobile app** — Responsive web only; mobile later.
- **Voice interface** — Defer until conversational UX is solid.
- **Couples / multi-user** — Single-user data model only in v1.
- **Multi-currency** — Single currency in v1.
- **Investment / retirement / tax planning** — Hard advisor-side constraint: AI escalates these to a real CFP. No v1 product surface.
- **Subscription / recurring detection** — Backlog.
- **Fine-tuned or custom models** — General-purpose LLMs only (Gemini 2.5 Flash production, Claude dev/eval).
- **Custom domain** — Stay on `*.vercel.app` for v1; $12/yr domain is optional and out-of-budget.

## Context

- **Market gap (2026 research):** Existing tools fall into four buckets — behavioral AI (Copilot Money, Monarch) with shallow advice; conversational AI (Cleo, Origin) with vibes-grade math; open-source budgeting (Firefly III, Actual Budget) with zero AI; real CFP intakes (Edward Jones, Morgan Stanley) clinical and intimidating. Gap: conversational AI advisor that gathers CFP-grade context, applies real frameworks, and proves correctness via evals.
- **9 UI screens planned:** Landing → Signup, Onboarding flow, Dashboard, Transactions, Goals, AI Advisor chat, Profile, Settings, `/admin/ai-stats`.
- **6 deterministic finance tools** drive AI advice: `calculate_savings_rate`, `check_emergency_fund_tier`, `simulate_debt_payoff`, `project_goal_completion`, `analyze_spending`, `recommend_budget_split`. Math runs in TypeScript, never in the LLM head.
- **5-layer dynamic system prompt** for advisor: ROLE → HARD CONSTRAINTS → AVAILABLE FRAMEWORKS → USER CONTEXT → TOOLS, composed per request.
- **7 baseline Promptfoo scenarios:** EF shortfall, debt avalanche, snowball preference, 401k cashout refusal, ETF pick refusal, non-negotiable respect, goal feasibility.
- **Phase 1 implementation plan already exists** at `docs/superpowers/plans/2026-05-06-phase-1-foundation.md` (1196 lines, ~30 files, 9 tasks). `/gsd-plan-phase 1` should reference and adapt this rather than overwrite.
- **Source design SPEC** at `docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md`; 10-week roadmap detailed in §13.
- **Synthesis intel** lives in `.planning/intel/` (SYNTHESIS, decisions, requirements, constraints, context).

## Constraints

- **Tech stack:** Next.js 16 App Router + TypeScript; Drizzle ORM + Neon Postgres; Auth.js v5; Vercel AI SDK with Google Gemini 2.5 Flash (production) / Claude (dev+eval); Tailwind v4 + shadcn/ui (New York, Neutral/Zinc, CSS variables); Recharts; Vitest + Promptfoo; Sentry free tier; custom `ai_calls` table + `/admin/ai-stats`; Vercel Hobby; GitHub Actions CI; Node 20 LTS; Turbopack dev. — Locked by SPEC §11 + Phase 1 plan; recruiter-recognized stack; provider-agnostic AI SDK enables one-line LLM swap.
- **Cost budget:** $0/month at portfolio scale (<100 users) for v1. — Free tiers only (Vercel Hobby, Neon free, Gemini free 250 req/day, Sentry 5k events/mo, Resend free, GitHub Actions free for public repos).
- **Schedule budget:** ~10 weeks at ~10–12 hrs/week. Buffer weeks 11–12 absorb spillover. — Hard ship deadline tied to job-search timing.
- **Phase 1 sub-budget:** ~20–24 hours over weeks 1–2. — Documented in the existing Phase 1 plan.
- **Data model:** Postgres tables — `users`, `profiles`, `accounts`, `transactions`, `categories`, `categorization_rules`, `goals`, `conversations`, `messages`, `ai_calls`, `evaluations`. Phase 1 implements only Auth.js standard tables (`user`, `account`, `session`, `verificationToken`); domain tables added in later phases.
- **AI advisor 5-layer prompt invariant:** ROLE → HARD CONSTRAINTS → AVAILABLE FRAMEWORKS → USER CONTEXT → TOOLS, composed dynamically per request. Hard constraints: show math; no stock/fund picks; escalate tax/legal to real CFP; ask clarifying questions before consequential claims; never recommend cutting non-negotiables.
- **Math-in-TS-not-in-LLM invariant:** All financial calculations run in deterministic TypeScript tools. The LLM only orchestrates which tool to call and how to explain the result. Vitest verifies determinism.
- **Eval contract:** Layer 1 Vitest on tools (every PR). Layer 2 Promptfoo sampled on every PR + full suite nightly/on-demand.
- **Privacy:** Auth + secure cookies + CSRF on all authenticated routes; all user data isolated per `user_id` foreign key; full-account-delete option in Settings.
- **Observability:** Sentry free tier for errors; custom `ai_calls` table per request (model, prompt_hash, input/output tokens, latency, tool call count, status); `/admin/ai-stats` owner-only; Vercel Analytics for traffic.
- **CI/CD:** GitHub Actions on PR (lint + typecheck + Vitest + Promptfoo sampled + build); Vercel auto-deploy on merge to `main`; Drizzle migrations against Neon prod branch. Promptfoo job added in week 9 (Phase 8) per SPEC §13 schedule.
- **Vercel Hobby commercial-use ban:** Portfolio is non-commercial. If monetizing later, migrate to Cloudflare Pages.

## Open Questions

<!-- Tracked but not blocking. Resolve before launch where applicable. -->

- **Project name** — "Finance Tracker AI" is a working title; may rename before launch.
- **Custom domain** — Buy a $12/yr domain or stay on `*.vercel.app`? Out of v1 budget either way.
- **Open source license** — MIT recommended for portfolio visibility.
- **Public repo** — Recommended (hiring signal); confirm no sensitive data in commits.

## Key Decisions

<!-- Decisions that constrain future work. Empty initially — no ADRs ingested yet.
     Tech-stack and architecture choices flow from the SPEC and live as Constraints (above), not as ADR-locked decisions. Future ADRs (e.g. lock hosting, datastore, LLM provider) populate this table via /gsd-ingest-docs. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| *(none yet — 0 locked decisions)* | | |

## Risks (tracked, mitigations in place)

- **LLM provider deprecation/pricing change** → Vercel AI SDK is provider-agnostic; swap in one line.
- **Free tier overage** → Portfolio scale (<100 users) is well within all free-tier limits.
- **"Another budget app" saturation** → Differentiate via finance-degree story + framework grounding + eval suite.
- **Scope creep** → Backlog (PROJECT §"Out of Scope" + SPEC §15); stop-the-line if v1 not ready by week 10.
- **AI hallucinations giving wrong financial advice** → Layer-2 Promptfoo evals catch behavioral failures; deterministic TS tools prevent math errors.
- **Privacy** → Auth + secure cookies + CSRF; per-user data isolation; full-account-delete.
- **Vercel Hobby commercial-use ban** → Non-commercial portfolio; migrate to Cloudflare Pages if monetizing later.

## Source Documents

- **Design SPEC:** `docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md` (authoritative; precedence > DOC)
- **Phase 1 implementation plan:** `docs/superpowers/plans/2026-05-06-phase-1-foundation.md` (1196 lines; reference but do not overwrite)
- **Synthesis intel:** `.planning/intel/SYNTHESIS.md` and per-type files (`decisions.md`, `requirements.md`, `constraints.md`, `context.md`)
- **Ingest conflicts log:** `.planning/INGEST-CONFLICTS.md` (4 INFO-level entries; 0 blockers)

---
*Last updated: 2026-05-06 after new-project-from-ingest synthesis*
