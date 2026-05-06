# Synthesis Summary

**Generated:** 2026-05-06
**Mode:** new
**Precedence applied:** ADR > SPEC > PRD > DOC
**Project:** Finance Tracker AI (Next.js 16 + TypeScript + Postgres + Auth.js + Vercel AI SDK)

---

## Doc counts

| Type | Count | Sources |
|---|---|---|
| ADR | 0 | — |
| SPEC | 1 | docs/superpowers/specs/2026-05-06-finance-tracker-ai-design.md |
| PRD | 0 | — |
| DOC | 1 | docs/superpowers/plans/2026-05-06-phase-1-foundation.md |
| **Total** | **2** | |

Confidence: both `high`, both manifest-overridden. No `UNKNOWN`-confidence-low docs.

## Cross-reference graph

- SPEC -> (no outbound refs)
- DOC -> SPEC (1 edge)
- Cycles: none (depth 1, below cap of 50)

## Decisions locked

**0 locked decisions.** No ADRs ingested. Technology and architecture choices flow from the SPEC and are recorded as constraints. Future ADRs (e.g. to lock hosting, datastore, or LLM provider) can be ingested via `/gsd-ingest-docs` and will populate `decisions.md`.

## Requirements extracted

7 MVP requirements (sourced from SPEC §5; mirrored in `requirements.md` for downstream consumption since no PRDs were ingested):

| ID | Title | Source section |
|---|---|---|
| REQ-auth | Authentication (email + Google OAuth) | SPEC §5.1 |
| REQ-transactions | Transactions CRUD + CSV import | SPEC §5.2 |
| REQ-categorization | Categorization (rules + AI fallback + manual override) | SPEC §5.3 |
| REQ-onboarding | 10-question CFP onboarding intake | SPEC §5.4, §8 |
| REQ-goals-dashboard | Goals + Dashboard | SPEC §5.5, §10.2 |
| REQ-ai-advisor | AI advisor chat (streaming, tool-calling, framework-grounded) | SPEC §5.6, §7, §10.3 |
| REQ-eval-suite | Eval suite (Vitest tools + Promptfoo LLM behavior) | SPEC §5.7, §9 |

## Constraints extracted

11 constraints in `constraints.md`:

| Type | Count | IDs |
|---|---|---|
| nfr | 4 | C-cost-budget, C-ship-budget, C-observability, C-privacy |
| schema | 1 | C-data-model |
| api-contract | 2 | C-finance-tools, C-ai-advisor-prompt |
| protocol | 2 | C-eval-strategy, C-deployment-pipeline |
| technology | 2 | C-tech-stack, C-phase1-tech |
| scope | 1 | C-non-goals |

(Some constraints carry mixed types; counts above sum to 12 because C-tech-stack is also nfr-flavored and C-phase1-tech is technology+implementation. Authoritative IDs: 11.)

## Context topics

12 topics captured in `context.md`:

1. Problem statement and motivation
2. Market gap (validated by 2026 research)
3. Goals (project-level)
4. Users
5. UI surface map (9 screens)
6. Onboarding question detail
7. Promptfoo eval scenarios (7 baseline)
8. 10-week implementation roadmap
9. Risks and mitigations
10. Backlog (post-MVP)
11. Open questions
12. Success criteria
13. Phase 1 Definition of Done
14. Phase 1 prerequisites
15. Phase 1 file inventory

## Conflicts

| Bucket | Count |
|---|---|
| BLOCKERS | 0 |
| WARNINGS (competing variants) | 0 |
| INFO (auto-resolved / informational) | 4 |

Detail: `.planning/INGEST-CONFLICTS.md`

The 4 INFO entries reflect benign overlap where the DOC adds implementation detail (Resend provider, specific versions, Auth.js standard schema) that the SPEC left open or described conceptually. No precedence overrides were triggered; both sources are retained in `constraints.md` and `context.md` with provenance.

## Pointers

- **Per-type intel files:**
  - `.planning/intel/decisions.md`
  - `.planning/intel/requirements.md`
  - `.planning/intel/constraints.md`
  - `.planning/intel/context.md`
- **Conflicts report:** `.planning/INGEST-CONFLICTS.md`
- **Classifications consumed:**
  - `.planning/intel/classifications/2026-05-06-finance-tracker-ai-design-7a8f3b2c.json`
  - `.planning/intel/classifications/2026-05-06-phase-1-foundation-9b3a8d2c.json`

## Status

**READY for routing.** No blockers, no competing variants. The roadmapper (`gsd-roadmapper`) can safely consume this synthesis to produce PROJECT.md, REQUIREMENTS.md, and ROADMAP.md.

---

*End of SYNTHESIS.md*
