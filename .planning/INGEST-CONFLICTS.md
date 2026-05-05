## Conflict Detection Report

**Generated:** 2026-05-06
**Mode:** new
**Precedence:** ADR > SPEC > PRD > DOC
**Inputs:** 1 SPEC, 1 DOC (both high-confidence, manifest-overridden)

### BLOCKERS (0)

No blockers detected.

- No LOCKED-vs-LOCKED ADR contradictions (no ADRs ingested).
- No UNKNOWN-confidence-low classifications.
- No cycles in cross-ref graph (DOC -> SPEC, SPEC has no cross_refs; depth 1, well below cap of 50).

### WARNINGS (0)

No competing variants detected.

- No PRDs ingested, so no overlapping requirement scopes with divergent acceptance criteria.
- Within the single SPEC, no conflicting acceptance criteria across sections.
- The DOC (Phase 1 implementation plan) explicitly maps to SPEC §13 weeks 1-2 and §11 tech stack with consistent (non-divergent) detail.

### INFO (4)

[INFO] DOC adds Phase 1 implementation detail to SPEC categories without contradiction
  Note: docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §11 names tech-stack categories (Auth.js, Tailwind, shadcn/ui, Vitest, Vercel Hobby, Neon). docs/superpowers/plans/2026-05-06-phase-1-foundation.md binds specific versions and minor providers (Tailwind v4, Auth.js v5 via next-auth@beta, Resend for magic-link email, Node 20 LTS, Turbopack dev server, shadcn New York style + Neutral/Zinc base). Source: SPEC §11 + DOC Tech Stack header. Both sources retained; DOC is recorded as the binding implementation in `constraints.md` (C-phase1-tech) under SPEC's higher-precedence framing.

[INFO] Email auth provider: SPEC unspecified, DOC chooses Resend
  Note: SPEC §5.1 requires "email + Google OAuth via Auth.js" without naming the email provider. DOC §Prerequisites P6 + Task 6 selects Resend (free tier) for magic-link email. No conflict — DOC fills a gap left open by the SPEC. Source: docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §5.1; docs/superpowers/plans/2026-05-06-phase-1-foundation.md Task 6.

[INFO] Auth `users` table: SPEC conceptual model vs DOC Auth.js standard schema
  Note: SPEC §6.2 names `users` (plural) with fields `id, email, oauth_provider, created_at`. DOC Task 5 implements the Auth.js v5 standard schema using a singular `user` table with fields `id, name, email, emailVerified, image, createdAt`, plus a related `account` table that carries provider info per linked OAuth account. The SPEC's `oauth_provider` column is satisfied by the related `account` row. Treated as the same conceptual constraint with the implementation expanded — no precedence conflict. Source: docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §6.2; docs/superpowers/plans/2026-05-06-phase-1-foundation.md Task 5.

[INFO] CI scope: SPEC includes Promptfoo on PR, Phase 1 DOC defers Promptfoo to a later phase
  Note: SPEC §12 describes the CI pipeline as `lint + type-check + Vitest + Promptfoo (sampled scenarios) + build check`. DOC Task 8 sets up CI with `Lint -> Typecheck -> Test -> Build` only — Promptfoo is intentionally out-of-scope for Phase 1 because the eval suite ships in week 9 per SPEC §13. No precedence conflict — this is a temporal scoping difference, not a contradiction. The Phase 1 CI is a strict subset of the full CI, scheduled to be extended in week 9. Source: docs/superpowers/specs/2026-05-06-ai-finance-coach-design.md §12, §13; docs/superpowers/plans/2026-05-06-phase-1-foundation.md Task 8 + Self-Review Notes.

---

**Summary**

- 0 blockers — safe to route
- 0 warnings — no user resolution needed
- 4 informational notes — DOC adds detail consistent with SPEC; no precedence overrides triggered

The two source documents are complementary: the SPEC is the authoritative design, the DOC is a faithful Phase 1 implementation plan that explicitly cross-references SPEC sections (§5.1, §6.2, §11, §12, §13) and limits itself to weeks 1-2 of the SPEC roadmap. All synthesized intel is recorded in `.planning/intel/{decisions,requirements,constraints,context}.md`.
