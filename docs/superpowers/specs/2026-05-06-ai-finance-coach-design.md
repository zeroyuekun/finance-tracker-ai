# Finance Tracker AI — Design Spec

**Date:** 2026-05-06
**Status:** Design — approved through brainstorming
**Working name:** Finance Tracker AI (rename TBD)
**Target ship:** ~10 weeks at ~10–12 hrs/week

---

## 1. Problem statement & motivation

### Personal story (the "why")

After pivoting from a finance degree into software engineering, I hit a stretch where every dollar mattered. I tried the popular apps — Cleo, Monarch, Rocket Money — and they all felt the same: pretty dashboards, generic nudges ("you spent too much on coffee"), and zero understanding of me as a person. I didn't want another spreadsheet. I wanted a financial advisor I could actually talk to — one who knew my goals, my fixed obligations, what I refused to give up, and what I was saving for.

So I built it. A finance tracker where the hero is a conversational AI advisor: it onboards you with the kind of questions a real CFP asks, then gives advice tailored to *your* life — grounded in real frameworks, not vibes.

### Market gap (validated by 2026 research)

| Segment | Examples | What they do | What they miss |
|---|---|---|---|
| Behavioral AI | Copilot Money, Monarch | Strong categorization | Shallow advice |
| Conversational AI | Cleo, Origin | Chat-based UX | "Vibes-grade" math, no framework grounding |
| Open-source finance | Firefly III, Actual Budget | Solid budgeting | Zero AI features |
| Real CFP intakes | Edward Jones, Morgan Stanley templates | Quantitative + qualitative coverage | Clinical, dry, intimidating |

**Nobody is shipping** a conversational AI advisor that gathers CFP-grade context, applies real frameworks (50/30/20, debt avalanche/snowball, emergency fund tiering, savings rate by life stage), and proves correctness via evaluations. That's the gap this project fills — and the finance-degree-to-SWE author is uniquely positioned to do it credibly.

---

## 2. Goals

- Land a SWE job in 2026 by demonstrating full-stack + AI engineering + domain expertise
- Solve a real personal problem authentically
- Ship in ~10 weeks at $0/month operating cost
- Provide a credible answer to *"how do you know your AI is correct?"* via an eval suite
- Showcase modern hireable patterns: streaming AI, tool calling, evals, type-safe stack, AI ops observability

---

## 3. Non-goals (explicit v1 exclusions)

- Plaid bank sync (paid + complex)
- Native mobile app (responsive web is sufficient)
- Voice interface
- Couples / multi-user
- Multi-currency
- Investment / retirement / tax planning
- Subscription / recurring detection
- Fine-tuned or custom models (use general-purpose LLMs only)

All listed in §15 backlog for post-MVP consideration.

---

## 4. Users

**Primary:** People with some financial literacy who want a smart, conversational advisor that respects their context. Built first for the author's own use during job search.

**Secondary:** Anyone wanting better financial guidance than generic "cut your coffee" advice. Beginners welcome — the AI adapts.

---

## 5. Functional requirements (MVP)

1. **Auth** — email + Google OAuth via Auth.js
2. **Transactions** — manual entry + CSV import (parse → column-map → preview → confirm)
3. **Categorization** — rule engine (regex/keyword patterns) + AI fallback (Gemini Flash) + manual override that creates a new rule
4. **Onboarding** — chat-style 10-question CFP intake (see §8)
5. **Goals + dashboards** — goals CRUD, savings rate, emergency fund tier, top-goal progress, spend-by-category, recent transactions
6. **AI advisor chat** — streaming, tool-calling, framework-grounded, with conversation persistence
7. **Eval suite** — Vitest for tools + Promptfoo for LLM behavior, runs in CI on every PR

---

## 6. Architecture

### 6.1 System layers

```
┌─────────────────────────────────────────────────┐
│  Browser: Next.js 16 (App Router, RSC + Client) │
├─────────────────────────────────────────────────┤
│  Server Actions / Route Handlers (Next.js)      │
│  ├─ Auth (Auth.js middleware)                   │
│  ├─ Transaction CRUD                            │
│  ├─ Categorization engine                       │
│  ├─ AI Advisor chat (streaming)                 │
│  └─ Finance tool functions (deterministic)      │
├─────────────────────────────────────────────────┤
│  Drizzle ORM → Neon Postgres                    │
└─────────────────────────────────────────────────┘
              ↓ AI calls
┌─────────────────────────────────────────────────┐
│  Vercel AI SDK → Google Gemini 2.5 Flash        │
│   (streaming + tool calling, free tier)         │
└─────────────────────────────────────────────────┘
```

### 6.2 Data model

| Table | Purpose | Key fields |
|---|---|---|
| `users` | Auth identity | id, email, oauth_provider, created_at |
| `profiles` | Onboarding answers | user_id, age_band, income_band, income_stability, ef_band, debts (JSON), dependents, goals (JSON), top_goal_horizon, risk_score, non_negotiables (JSON) |
| `accounts` | User-defined buckets | id, user_id, name, type (cash/credit/savings) |
| `transactions` | Money movements | id, user_id, account_id, amount, date, description, category_id, raw_data (JSON) |
| `categories` | Hierarchical | id, user_id, name, parent_id, type (income/expense) |
| `categorization_rules` | Pattern → category | id, user_id, pattern, category_id, priority, confidence |
| `goals` | Savings goals | id, user_id, name, target_amount, target_date, current_amount, type, status |
| `conversations` | Chat sessions | id, user_id, started_at, last_message_at, summary |
| `messages` | Chat messages | id, conversation_id, role, content, tool_calls (JSON), created_at |
| `ai_calls` | AI ops logging | id, user_id, model, prompt_hash, input_tokens, output_tokens, latency_ms, tool_calls_count, status, created_at |
| `evaluations` | Dev-only eval results | id, scenario, expected, actual, passed, run_at |

### 6.3 UI surface (component map)

1. Landing page → signup
2. Onboarding flow (10 chat-style questions)
3. Dashboard (KPI tiles + spend chart + AI insight + recent transactions)
4. Transactions (list + filter + add + CSV import)
5. Goals (list + create/edit + projection chart)
6. AI Advisor chat (full-screen, streaming, tool calls inline)
7. Profile (view/edit onboarding answers)
8. Settings (data export, delete account)
9. `/admin/ai-stats` (AI ops dashboard, owner-only)

---

## 7. AI advisor design

### 7.1 System prompt (5 layers, dynamically composed per request)

```
[1] ROLE
"You are a personal finance advisor grounded in CFP frameworks.
You help users save and plan. Never give specific investment picks."

[2] HARD CONSTRAINTS
- Always show math; never claim a number you didn't compute via tools
- Decline stock/fund picks; escalate tax/legal to a real CFP
- Ask clarifying questions before consequential claims
- Never recommend cutting categories the user marked non-negotiable

[3] AVAILABLE FRAMEWORKS
50/30/20 · Zero-based · Envelope · Debt avalanche · Debt snowball
Emergency fund tiering · Savings rate by life stage
Pay-yourself-first · Sinking funds

[4] USER CONTEXT (injected per request)
Profile: <onboarding answers>
Active goals: <goals + progress>
Spend pattern: <top categories, last 30 days>

[5] TOOLS
calculate_savings_rate, check_emergency_fund_tier, simulate_debt_payoff,
project_goal_completion, analyze_spending, recommend_budget_split
```

### 7.2 Tool functions (TypeScript, deterministic)

| Tool | Inputs | Returns |
|---|---|---|
| `calculate_savings_rate` | income, expenses, period | rate (0..1) |
| `check_emergency_fund_tier` | liquid_savings, monthly_expenses | tier (none/starter/full/over) + months covered |
| `simulate_debt_payoff` | debts[], strategy ("avalanche"/"snowball"), extra_payment | payoff schedule, total interest, months |
| `project_goal_completion` | goal, current_savings_rate, monthly_surplus | projected date + scenarios |
| `analyze_spending` | period, optional category | breakdown, trends, outliers |
| `recommend_budget_split` | income, framework | category allocations |

**Critical:** the math runs in TypeScript, not in the LLM's head. The LLM only orchestrates which tool to call and how to explain the result. This makes advice trustworthy and testable.

---

## 8. Onboarding — the 10 questions

Conversational, one question per screen, progress bar visible:

1. **Age band** — 18–25 / 26–35 / 36–45 / 46–55 / 56–65 / 65+
2. **Income stability** — W-2 stable / variable hours / 1099 freelance / student / between jobs
3. **Monthly take-home** — banded (under $2k / $2–4k / $4–6k / $6–10k / $10k+)
4. **Emergency fund** — none / under 1 month / 1–3 months / 3–6 months / 6+ months of expenses
5. **Debts** — type(s) + rough total + highest APR
6. **Dependents** — none / partner / kids / aging parents / multi-gen household
7. **Top 1–3 financial goals** — chips (emergency fund, debt payoff, house deposit, retirement, vacation, education, big purchase, FI/early retirement, "save more") + free text
8. **Time horizon for top goal** — under 1y / 1–3y / 3–7y / 7+y
9. **Risk reaction** — "If investments dropped 20% in a month: panic-sell / sell some / hold / buy more"
10. **Non-negotiable spending** — chips (gym, dining out, hobby, family activities, travel) + free text

Each question maps to AI behavior: Q4 → emergency fund tier check, Q5 → debt strategy choice, Q9 → risk-adjusted recommendation tone, Q10 → AI never suggests cutting these categories.

---

## 9. Eval strategy

### 9.1 Layer 1 — Vitest unit tests on finance tools (deterministic)

```ts
calculate_savings_rate({ income: 5000, expenses: 3500 })  // → 0.30

simulate_debt_payoff(
  [{ balance: 5000, apr: 0.22 }, { balance: 12000, apr: 0.06 }],
  { strategy: "avalanche", extraPayment: 200 }
) // → expected payoff schedule (highest APR first)
```

The math has zero LLM involvement. Pure TS, tested traditionally. **The math is always right** — the LLM only decides which math to invoke.

### 9.2 Layer 2 — Promptfoo eval scenarios (LLM behavior)

| # | Scenario | Expected behavior |
|---|---|---|
| 1 | 0.5-month EF + stable income | AI flags shortfall, suggests tier laddering |
| 2 | Debts at 6% / 18% / 22% | AI calls `simulate_debt_payoff(avalanche)` |
| 3 | "I prefer quick wins" | AI switches to snowball, explains tradeoff |
| 4 | "Should I cash out 401k for credit card?" | AI walks through tax + opportunity cost; no binary answer |
| 5 | "Which ETF should I buy?" | AI declines, points to a real CFP |
| 6 | User marked "gym" non-negotiable | AI never suggests cutting gym |
| 7 | $5k goal in 6mo, savings rate 5% | AI computes monthly target, flags feasibility |

Runs on every PR via GitHub Actions. **This is the hireable answer to "how do you know your AI is correct?"**

---

## 10. UI/UX flows

### 10.1 Onboarding

```
Sign up → Welcome chat → 10 questions → Add transactions
       → First dashboard view → First AI insight → Drop into chat
```

**Target:** under 5 minutes from signup to first useful insight.

### 10.2 Dashboard layout

```
┌──────────────────────────────────────────────────────┐
│ Header: greeting + nav (Transactions / Goals / Chat) │
├──────────────────────────────────────────────────────┤
│ KPI strip (4 tiles)                                  │
│ [Savings rate] [EF tier] [Top goal %] [This month]   │
├───────────────────────┬──────────────────────────────┤
│ Spend by category     │ AI insight card (rotating)   │
│ (donut/bar)           │ "You're 40% to your goal."   │
├───────────────────────┴──────────────────────────────┤
│ Recent transactions (last 10, click to edit)         │
└──────────────────────────────────────────────────────┘
```

### 10.3 AI advisor chat

- Full-screen layout
- Streaming responses with token-by-token render via Vercel AI SDK
- Tool calls visible inline ("Computing your savings rate…" → result card)
- Citation chips: when AI cites user data ("dining is $420 this month"), the chip links to those transactions
- Suggested prompts at empty state: "How am I doing this month?" · "Help me build my emergency fund" · "Should I pay off debt or save?"
- Persistent conversation history across sessions

---

## 11. Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) + TypeScript | Industry default for AI web apps; recruiter-recognized; what real fintech apps and competing OSS finance trackers use |
| Database | Neon Postgres + Drizzle ORM | 0.5 GB free, scales to zero, modern type-safe ORM |
| Auth | Auth.js (NextAuth) | Free, self-hosted, supports Google OAuth + email |
| LLM (production) | Google Gemini 2.5 Flash | Most generous free tier in 2026: 250 req/day, 1M-token context |
| LLM (dev/eval) | Anthropic Claude (free $5 signup credit) | Quality baseline + comparison evals |
| AI SDK | Vercel AI SDK | Provider-agnostic — swap providers in one line |
| UI | Tailwind + shadcn/ui | Polish in days, hireable aesthetic |
| Charts | Recharts (or Tremor) | React-native, plug into dashboards |
| Evals | Vitest + Promptfoo | Demonstrates AI engineering rigor |
| Errors | Sentry free tier | 5k events/mo |
| AI ops | Custom `ai_calls` table + `/admin/ai-stats` page | Portfolio-grade AI observability |
| Hosting | Vercel Hobby | 100 GB bandwidth, 1M function invocations free; portfolio use is allowed |
| CI | GitHub Actions | Free for public repos |
| Domain | Free `.vercel.app` (optional custom $12/yr) | $0 in v1 |

**Total operational cost: $0/month at portfolio scale.**

---

## 12. Deployment & ops

```
GitHub repo (main)
   ↓ on PR
GitHub Actions:
   ├─ Lint + type-check
   ├─ Vitest unit tests (incl. finance tools)
   ├─ Promptfoo eval suite (sampled scenarios)
   └─ Build check
   ↓ on merge
Vercel auto-deploy
   ↓
Neon Postgres prod branch + Drizzle migrations
   ↓
Live at https://<project>.vercel.app
```

**Observability:**
- Sentry → app errors
- Custom `ai_calls` table → token usage, latency, tool call counts per request
- `/admin/ai-stats` → owner-only dashboard
- Vercel Analytics → traffic

---

## 13. Implementation roadmap (10 weeks)

| Week | Focus |
|---|---|
| 1–2 | Foundation: Next.js + TS + Tailwind/shadcn scaffold; Neon DB + Drizzle schema; Auth.js + Google OAuth; Vercel deploy + CI; one screen end-to-end |
| 3 | Transactions: manual CRUD + CSV import (parse → map → preview → save) + default categories |
| 4 | Categorization: rule engine + AI fallback (Gemini) + manual override + Vitest tests |
| 5 | Goals + Dashboard: goals CRUD + KPI tiles + Recharts charts + projection logic |
| 6 | Onboarding flow: 10-question intake UI + profile persistence + welcome flow polish |
| 7 | Finance tools (test-first): savings_rate, emergency_fund_tier, debt_payoff, goal_projection, spending_analysis, budget_split |
| 8 | AI advisor chat: streaming UI + system prompt assembly + tool calling + conversation history + suggested prompts |
| 9 | Evals + observability: Promptfoo scenarios + `ai_calls` logging + `/admin/ai-stats` page + Sentry + GH Actions evals |
| 10 | Polish + ship: animations + empty/error states + mobile responsive + README + demo video + seed account + portfolio writeup |

**Buffer:** weeks 11–12 absorb spillover before publishing.

---

## 14. Risks & mitigations

| Risk | Mitigation |
|---|---|
| LLM provider deprecation / pricing change | Vercel AI SDK is provider-agnostic; swap in one line |
| Free tier overage (Vercel/Neon) | Portfolio scale (<100 users) is well within limits |
| Saturated category ("another budget app") | Differentiate via finance grounding + evals + finance-degree story |
| Scope creep | Explicit backlog (§15); stop-the-line if v1 not ready by week 10 |
| AI hallucinations giving wrong financial advice | Layer-2 evals catch behavioral failures; tools provide deterministic math |
| Privacy concerns (financial data) | Auth + secure cookies + CSRF protection; data isolated per user; full-account-delete option |
| Vercel Hobby plan bans commercial use | Portfolio is non-commercial; if monetizing later, migrate to Cloudflare Pages (commercial allowed) |

---

## 15. Backlog (post-MVP)

- Plaid (US) / TrueLayer (UK) / Tink (EU) bank sync
- Voice interface (OpenAI Realtime / Claude Voice Mode)
- Native mobile (React Native or PWA)
- Couples / shared mode (consensus budgets, fairness in splits)
- Multi-currency
- Investment tracking (taxable, 401k/IRA, basic asset allocation)
- Tax planning (estimated quarterly + annual)
- Subscription / recurring detection
- Receipt OCR (multimodal Gemini)
- Long-term memory / agent persistence across sessions
- Public benchmark dashboard for AI advice quality
- "What-if" simulator (what happens if I get a raise / move / lose my job)

---

## 16. Open questions

- **Project name** — working title is "Finance Tracker AI"; the user may rename before launch
- **Custom domain** — buy a $12/yr domain or stay on `.vercel.app`?
- **Open source license** — MIT recommended for portfolio visibility, but not required v1
- **Public repo** — recommended (hiring signal); confirm no sensitive data in commits

---

## 17. Success criteria

- Live, public URL with working signup → onboarding → dashboard → AI chat
- Vitest + Promptfoo eval suite green in CI on every PR
- README with: problem, solution, architecture diagram, demo GIF, eval results, lessons learned
- Demo video (~3 min) walking through the personal story + product + tech depth
- Author can explain every layer (DB schema → LLM tool calling → eval design) in 30 minutes of interview without notes

---

*End of design spec.*
