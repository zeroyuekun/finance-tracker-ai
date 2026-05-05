# AI Finance Coach

A conversational AI advisor for personal finance — grounded in real CFP frameworks, not vibes.

## Stack

Next.js 16 · TypeScript · Tailwind · shadcn/ui · Drizzle ORM · Neon Postgres · Auth.js v5 · Vitest · Vercel

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill values
cp .env.example .env.local

# 3. Push schema to your Neon database
npm run db:push

# 4. Run dev server
npm run dev
```

## Scripts

- `npm run dev` — local dev server (Turbopack)
- `npm run build` — production build
- `npm test` — Vitest test suite
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run db:generate` — generate migration from schema
- `npm run db:push` — push schema directly to DB

## Project status

Phase 1 (Foundation) — auth, DB, deployment.
