# Finance Tracker AI — Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a deployable Next.js 16 + TypeScript app with Postgres-backed auth (email + Google OAuth), CI green on every push, and a live Vercel URL where a real user can sign up and reach a protected dashboard placeholder.

**Architecture:** Single Next.js App Router project. Drizzle ORM talks to Neon Postgres. Auth.js v5 manages sessions via the Drizzle adapter. shadcn/ui + Tailwind for components. GitHub Actions runs lint + type-check + Vitest + build on every PR. Vercel auto-deploys `main` branch.

**Tech Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Drizzle ORM · Neon Postgres · Auth.js v5 (NextAuth) · Vitest · GitHub Actions · Vercel Hobby

**Phase scope:** ~20–24 hours (2 weeks at 10–12 hrs/week)

**Definition of Done:** A real signup at `https://<project>.vercel.app` creates a `users` row in production Postgres, lands the user on `/dashboard`, and CI is green on `main`.

---

## Files Created in This Phase

### Configuration
- `package.json` — npm dependencies and scripts
- `tsconfig.json` — TypeScript strict config
- `next.config.ts` — Next.js config (defaults + env hints)
- `tailwind.config.ts` — Tailwind config
- `postcss.config.mjs` — PostCSS for Tailwind
- `components.json` — shadcn/ui config
- `drizzle.config.ts` — Drizzle Kit config (migrations)
- `vitest.config.ts` — Vitest test runner config
- `eslint.config.mjs` — ESLint flat config
- `.env.example` — committed template of env vars
- `.env.local` — local secrets (gitignored)
- `.gitignore` — node_modules, .env.local, .next, etc.
- `.nvmrc` — Node version pin (`20`)
- `README.md` — project overview, setup, run commands
- `.github/workflows/ci.yml` — lint + type-check + test + build

### Application code
- `app/layout.tsx` — root layout (HTML, fonts, providers)
- `app/page.tsx` — landing page
- `app/globals.css` — Tailwind base + theme tokens
- `app/(auth)/signin/page.tsx` — sign-in page
- `app/(app)/dashboard/page.tsx` — protected dashboard placeholder
- `app/api/auth/[...nextauth]/route.ts` — Auth.js handlers
- `middleware.ts` — protect `/dashboard/*`
- `lib/db/index.ts` — Drizzle client (Neon)
- `lib/db/schema.ts` — Auth.js tables (users, accounts, sessions, verificationTokens)
- `lib/auth.ts` — Auth.js v5 config (providers + adapter)
- `components/ui/button.tsx` — shadcn Button
- `components/ui/card.tsx` — shadcn Card
- `components/ui/input.tsx` — shadcn Input
- `components/ui/label.tsx` — shadcn Label
- `components/sign-out-button.tsx` — wraps Auth.js signOut

### Tests
- `tests/db.test.ts` — DB connection sanity test
- `tests/schema.test.ts` — schema integrity test

### Migrations
- `drizzle/0000_initial_auth_schema.sql` — generated migration

---

## Prerequisites (User Manual Steps)

These are **not coding tasks** — they are external account setups. Complete before Task 1.

- [ ] **P1: Node.js 20+ installed.** Verify with `node --version` (expect `v20.x` or `v22.x`).
- [ ] **P2: GitHub account with a new empty repo.** Repo name suggestion: `finance-tracker-ai`. Don't initialize with README — local already has one. Note the repo URL.
- [ ] **P3: Neon account + project.** Sign up at https://neon.tech (free tier). Create a project. Copy the connection string from the dashboard — it looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`.
- [ ] **P4: Google OAuth credentials.** Go to https://console.cloud.google.com → APIs & Services → Credentials → Create OAuth 2.0 Client ID → Web application. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google` (will add Vercel URL later). Copy Client ID and Client Secret.
- [ ] **P5: Vercel account, GitHub linked.** Sign up at https://vercel.com — link your GitHub account so Vercel can auto-deploy.
- [ ] **P6: Resend account (free tier) for magic-link email.** Sign up at https://resend.com. Create an API key. (Used for email-link sign-in. We avoid SMTP setup with this approach.)

**Save these somewhere safe** — you'll paste them into `.env.local` and Vercel env vars in later tasks:

```
DATABASE_URL=<from Neon>
AUTH_SECRET=<generate in Task 6, step 2>
AUTH_GOOGLE_ID=<from Google Cloud>
AUTH_GOOGLE_SECRET=<from Google Cloud>
AUTH_RESEND_KEY=<from Resend>
AUTH_EMAIL_FROM=onboarding@resend.dev   # use your verified sender
```

---

## Task 1: Initialize Next.js project with TypeScript

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `eslint.config.mjs`, `.gitignore`, `.nvmrc`

- [ ] **Step 1: Verify Node version**

```bash
node --version
```

Expected: `v20.x.x` or `v22.x.x`. If older, install Node 20 LTS from https://nodejs.org first.

- [ ] **Step 2: Confirm working directory**

```bash
cd "C:\Users\Admin\projects\finance-tracker-ai"
pwd
```

Expected: `C:\Users\Admin\projects\finance-tracker-ai` (or its forward-slash equivalent).

- [ ] **Step 3: Run create-next-app**

The project directory already exists (created during brainstorming) and contains a `.git` folder + `docs/`. Use the in-place install:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --turbopack --skip-install
```

When prompted "would you like to use Turbopack" — yes. When prompted to overwrite or proceed in non-empty dir — yes (the existing files are docs and won't conflict).

Expected: Files created including `package.json`, `app/`, `tsconfig.json`. No `node_modules` yet (we passed `--skip-install`).

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` populated, `package-lock.json` created.

- [ ] **Step 5: Pin Node version**

Create `.nvmrc`:

```
20
```

- [ ] **Step 6: Verify dev server runs**

```bash
npm run dev
```

Expected: server starts on `http://localhost:3000`. Visit in browser — see the Next.js default page. Press Ctrl+C to stop.

- [ ] **Step 7: Tighten TypeScript config**

Edit `tsconfig.json` — add/confirm these compiler options inside `"compilerOptions"`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 8: Run type check to verify**

```bash
npx tsc --noEmit
```

Expected: no output (success). Errors mean the strict config caught something — fix in default Next.js code if needed.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js 16 with TypeScript, Tailwind, and strict tsconfig"
```

---

## Task 2: Add Vitest test framework

**Files:**
- Create: `vitest.config.ts`, `tests/sanity.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest and related packages**

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: [],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Add test scripts to `package.json`**

In the `"scripts"` block, add:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Write the failing sanity test**

Create `tests/sanity.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("sanity", () => {
  it("runs vitest", () => {
    expect(2 + 2).toBe(4);
  });
});
```

- [ ] **Step 5: Run the test**

```bash
npm test
```

Expected: `1 test passed`. Vitest runs `tests/sanity.test.ts` and the assertion passes.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts tests/sanity.test.ts package.json package-lock.json
git commit -m "feat: add Vitest test framework with sanity test"
```

---

## Task 3: Add shadcn/ui components

**Files:**
- Create: `components.json`, `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`, `lib/utils.ts`

- [ ] **Step 1: Run shadcn init**

```bash
npx shadcn@latest init
```

Prompts to answer:
- Style: **New York**
- Base color: **Neutral** (or **Zinc**)
- Use CSS variables: **Yes**

Expected: creates `components.json`, `lib/utils.ts`, modifies `app/globals.css` with theme tokens.

- [ ] **Step 2: Add baseline UI primitives**

```bash
npx shadcn@latest add button card input label
```

Expected: components appear under `components/ui/`.

- [ ] **Step 3: Verify components import**

Edit `app/page.tsx` to use the Button:

```tsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Finance Tracker AI</h1>
      <p className="text-muted-foreground">Conversational, framework-grounded budgeting.</p>
      <Button>Get started</Button>
    </main>
  );
}
```

- [ ] **Step 4: Run dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000. Expected: heading, subtitle, and a styled Button component. Stop with Ctrl+C.

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add shadcn/ui (button, card, input, label) and landing page"
```

---

## Task 4: Set up Drizzle ORM + Neon Postgres connection

**Files:**
- Create: `drizzle.config.ts`, `lib/db/index.ts`, `lib/db/schema.ts` (placeholder), `tests/db.test.ts`, `.env.local`, `.env.example`
- Modify: `.gitignore`, `package.json`

- [ ] **Step 1: Install Drizzle + Neon driver**

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv tsx
```

- [ ] **Step 2: Create `.env.example` (committed template)**

```
# Database (Neon)
DATABASE_URL=

# Auth.js
AUTH_SECRET=
AUTH_TRUST_HOST=true

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# Resend (magic-link email)
AUTH_RESEND_KEY=
AUTH_EMAIL_FROM=
```

- [ ] **Step 3: Create `.env.local` (NOT committed) with your real DATABASE_URL**

```
DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

(Paste your value from the Neon dashboard — Prerequisite P3.)

- [ ] **Step 4: Verify `.env.local` is in `.gitignore`**

Open `.gitignore`. Confirm `.env*` or `.env.local` is listed. If not, add:

```
.env*.local
```

- [ ] **Step 5: Create `drizzle.config.ts`**

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
```

- [ ] **Step 6: Create `lib/db/index.ts`**

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export type Db = typeof db;
```

- [ ] **Step 7: Create placeholder `lib/db/schema.ts`**

```ts
// Auth.js tables added in Task 5.
// Domain tables (transactions, goals, etc.) added in later phases.
export {};
```

- [ ] **Step 8: Add db scripts to `package.json`**

In `"scripts"`:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate",
"db:push": "drizzle-kit push",
"db:studio": "drizzle-kit studio"
```

- [ ] **Step 9: Write a DB connection test**

Create `tests/db.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

describe("database", () => {
  it("connects to Neon and returns SELECT 1", async () => {
    const databaseUrl = process.env.DATABASE_URL;
    expect(databaseUrl).toBeDefined();

    const sql = neon(databaseUrl as string);
    const rows = await sql`SELECT 1 AS one`;
    expect(rows[0]?.one).toBe(1);
  });
});
```

- [ ] **Step 10: Run the DB test**

```bash
npm test
```

Expected: 2 tests pass (sanity + db). If DB test fails, check `.env.local` `DATABASE_URL` value.

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: configure Drizzle ORM with Neon Postgres connection"
```

---

## Task 5: Define Auth.js schema (users, accounts, sessions, verificationTokens)

**Files:**
- Modify: `lib/db/schema.ts`
- Create: `drizzle/0000_*.sql`, `tests/schema.test.ts`

- [ ] **Step 1: Install Auth.js + Drizzle adapter**

```bash
npm install next-auth@beta @auth/drizzle-adapter
npm install -D @types/node
```

(`next-auth@beta` is Auth.js v5.)

- [ ] **Step 2: Replace `lib/db/schema.ts` with Auth.js standard tables**

```ts
import { pgTable, text, timestamp, primaryKey, integer } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
```

- [ ] **Step 3: Generate the migration**

```bash
npm run db:generate
```

Expected: a new file `drizzle/0000_<random_name>.sql` is created with `CREATE TABLE` statements.

- [ ] **Step 4: Push the schema to Neon**

```bash
npm run db:push
```

When prompted to confirm — yes. Expected: tables `user`, `account`, `session`, `verificationToken` are created in Neon. You can verify in the Neon dashboard SQL editor.

- [ ] **Step 5: Write a schema integrity test**

Create `tests/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

describe("auth schema", () => {
  it("required tables exist", async () => {
    const sql = neon(process.env.DATABASE_URL as string);
    const rows = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    const names = rows.map((r) => r.table_name as string);
    expect(names).toContain("user");
    expect(names).toContain("account");
    expect(names).toContain("session");
    expect(names).toContain("verificationToken");
  });
});
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: 3 tests pass (sanity + db + schema).

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: define Auth.js schema (user, account, session, verificationToken) with migration"
```

---

## Task 6: Configure Auth.js v5 with Google OAuth + magic-link email

**Files:**
- Create: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`
- Modify: `.env.local`, `app/layout.tsx`

- [ ] **Step 1: Install Resend provider package**

```bash
npm install resend
```

- [ ] **Step 2: Generate AUTH_SECRET**

```bash
npx auth secret
```

Expected: writes a generated secret into `.env.local` as `AUTH_SECRET=...`. (If `auth` CLI isn't found, fall back to `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` and paste manually.)

- [ ] **Step 3: Add the rest of auth env vars to `.env.local`**

Open `.env.local` and add:

```
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=<from Prerequisite P4>
AUTH_GOOGLE_SECRET=<from Prerequisite P4>
AUTH_RESEND_KEY=<from Prerequisite P6>
AUTH_EMAIL_FROM=onboarding@resend.dev
```

- [ ] **Step 4: Create `lib/auth.ts`**

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.AUTH_EMAIL_FROM!,
    }),
  ],
  session: { strategy: "database" },
  pages: { signIn: "/signin" },
});
```

- [ ] **Step 5: Create the API route handler**

Create `app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 6: Create middleware to protect `/dashboard`**

Create `middleware.ts` at the project root:

```ts
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

- [ ] **Step 7: Run type check**

```bash
npm run typecheck
```

Expected: no errors. If errors mention `next-auth` types, ensure `next-auth@beta` was installed (Step 1 of Task 6).

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: configure Auth.js v5 with Google OAuth + Resend magic-link"
```

---

## Task 7: Build sign-in page and protected dashboard placeholder

**Files:**
- Create: `app/(auth)/signin/page.tsx`, `app/(app)/dashboard/page.tsx`, `components/sign-out-button.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create sign-out button component**

Create `components/sign-out-button.tsx`:

```tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </Button>
  );
}
```

- [ ] **Step 2: Install the next-auth react helper (already included with next-auth@beta but confirm)**

```bash
npm list next-auth
```

Expected: `next-auth@5.x.x` listed.

- [ ] **Step 3: Create the sign-in page**

Create `app/(auth)/signin/page.tsx`:

```tsx
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to Finance Tracker AI</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button type="submit" className="w-full" variant="outline">
              Continue with Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <form
            action={async (formData: FormData) => {
              "use server";
              const email = formData.get("email");
              if (typeof email !== "string") return;
              await signIn("resend", { email, redirectTo: "/dashboard" });
            }}
            className="flex flex-col gap-3"
          >
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            <Button type="submit" className="w-full">Send magic link</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 4: Create the dashboard placeholder**

Create `app/(app)/dashboard/page.tsx`:

```tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome back, {session.user.name ?? session.user.email}</h1>
        <SignOutButton />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard placeholder</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Phase 1 is live. Phase 2 will add transactions and categorization.
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 5: Update the landing page to link to sign-in**

Replace `app/page.tsx`:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Finance Tracker AI</h1>
        <p className="max-w-xl text-muted-foreground">
          A conversational AI advisor grounded in real finance frameworks.
          Tracks your spending and gives advice tailored to your goals — not vibes.
        </p>
      </div>
      <Button asChild>
        <Link href="/signin">Get started</Link>
      </Button>
    </main>
  );
}
```

- [ ] **Step 6: Run dev server and test sign-in locally**

```bash
npm run dev
```

Open http://localhost:3000 → click "Get started" → arrive at `/signin`.

Test Google flow: click "Continue with Google" → OAuth redirect → land on `/dashboard`.

Test magic-link flow: enter your email → click "Send magic link" → check inbox → click link → land on `/dashboard`.

Test sign-out: click "Sign out" → return to landing page.

Test middleware: while signed out, manually visit http://localhost:3000/dashboard → redirected to `/signin?callbackUrl=/dashboard`.

If any step fails, debug before moving on.

- [ ] **Step 7: Verify a `user` row was inserted in Neon**

In the Neon dashboard SQL editor:

```sql
SELECT id, email, "createdAt" FROM "user";
```

Expected: at least one row (you).

- [ ] **Step 8: Run lint + typecheck + tests**

```bash
npm run lint
npm run typecheck
npm test
```

Expected: all pass.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add sign-in page, protected dashboard, and sign-out flow"
```

---

## Task 8: Set up GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `README.md`

- [ ] **Step 1: Create the CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    name: Lint · Typecheck · Test · Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "npm"

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Test
        run: npm test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
          AUTH_GOOGLE_ID: ${{ secrets.AUTH_GOOGLE_ID }}
          AUTH_GOOGLE_SECRET: ${{ secrets.AUTH_GOOGLE_SECRET }}
          AUTH_RESEND_KEY: ${{ secrets.AUTH_RESEND_KEY }}
          AUTH_EMAIL_FROM: ${{ secrets.AUTH_EMAIL_FROM }}
          AUTH_TRUST_HOST: "true"
```

- [ ] **Step 2: Update `README.md` with project description and setup steps**

Replace `README.md` content with:

````markdown
# Finance Tracker AI

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
````

- [ ] **Step 3: Verify the GitHub remote is set**

```bash
git remote -v
```

If empty, add it (replace URL with your repo from Prerequisite P2):

```bash
git remote add origin https://github.com/<your-username>/finance-tracker-ai.git
```

- [ ] **Step 4: Commit and push**

```bash
git add .
git commit -m "ci: add GitHub Actions workflow for lint/typecheck/test/build"
git push -u origin main
```

- [ ] **Step 5: Add repository secrets in GitHub**

Go to your repo on GitHub → Settings → Secrets and variables → Actions → New repository secret. Add each:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_RESEND_KEY`
- `AUTH_EMAIL_FROM`

(Use the same values as `.env.local`.)

- [ ] **Step 6: Verify CI runs green**

GitHub → repo → Actions tab. The first run should be triggered by your push. Wait ~2 minutes. Expected: all jobs green ✅.

If any job fails, click into it, read the error, fix, push again.

- [ ] **Step 7: Commit any fixes (if needed)**

```bash
git push
```

---

## Task 9: Deploy to Vercel + verify production

**Files:** (none new — Vercel UI work + verification)

- [ ] **Step 1: Import the GitHub repo into Vercel**

Go to https://vercel.com/new → import your GitHub repo. Framework preset auto-detects Next.js.

- [ ] **Step 2: Add environment variables in Vercel**

Before deploying, add the same env vars as Task 8 Step 5:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_RESEND_KEY`
- `AUTH_EMAIL_FROM`
- `AUTH_TRUST_HOST` = `true`

(Apply to all environments: Production, Preview, Development.)

- [ ] **Step 3: Click "Deploy"**

Wait ~1-2 minutes for build. Expected: green check + production URL like `https://finance-tracker-ai-xxx.vercel.app`.

- [ ] **Step 4: Add the production URL to Google OAuth allowed redirects**

Google Cloud Console → Credentials → your OAuth Client → Authorized redirect URIs → add:

```
https://<your-vercel-domain>/api/auth/callback/google
```

Save.

- [ ] **Step 5: Verify the production sign-up flow**

Visit your Vercel URL. Click "Get started" → "Continue with Google" → sign in → land on `/dashboard`. Verify the greeting shows your name/email.

- [ ] **Step 6: Verify a new user was created in production Postgres**

In Neon SQL editor:

```sql
SELECT id, email, "createdAt" FROM "user" ORDER BY "createdAt" DESC LIMIT 5;
```

Expected: your user row(s).

- [ ] **Step 7: Take a screenshot of the live dashboard**

Save it to `docs/phase-1-screenshot.png` for the README later.

- [ ] **Step 8: Update README with the live URL**

In `README.md`, add at the top under the title:

```markdown
**Live demo:** https://<your-vercel-domain>
```

- [ ] **Step 9: Commit**

```bash
git add README.md docs/phase-1-screenshot.png
git commit -m "docs: add live demo URL and Phase 1 screenshot"
git push
```

- [ ] **Step 10: Verify Vercel auto-deployed the docs commit**

Vercel dashboard → Deployments → newest deployment should show "Ready" within 1-2 minutes of the push.

---

## Phase 1 Definition of Done — verification checklist

Run through every item before declaring Phase 1 complete:

- [ ] `npm run lint` passes locally
- [ ] `npm run typecheck` passes locally
- [ ] `npm test` passes locally (3 tests: sanity + db + schema)
- [ ] `npm run build` passes locally
- [ ] GitHub Actions CI green on `main`
- [ ] Vercel production deployment is "Ready"
- [ ] Visiting the production URL in an incognito window shows the landing page
- [ ] Clicking "Get started" → Google OAuth → arrives at `/dashboard` with name/email visible
- [ ] Magic-link email sign-in works in production
- [ ] Sign-out returns to landing page
- [ ] Manually navigating to `/dashboard` while signed out redirects to `/signin?callbackUrl=/dashboard`
- [ ] A `user` row exists in production Neon Postgres
- [ ] README.md has a live demo URL

When all boxes are checked, Phase 1 is complete and Phase 2 (Transactions module) can be planned.

---

## Self-Review Notes

This plan covers spec §13 weeks 1–2 (Foundation). Coverage map:

- **Spec §5.1 Auth (email + Google OAuth)** → Tasks 5, 6, 7
- **Spec §6.2 `users` table** → Task 5 (Auth.js standard schema)
- **Spec §11 Tech stack — Next.js, TS, Tailwind, shadcn, Drizzle, Neon, Auth.js, Vitest, GH Actions, Vercel** → Tasks 1–9
- **Spec §12 Deployment pipeline** → Tasks 8, 9
- **Spec §13 weeks 1–2 ("Foundation: scaffold + DB + auth + deploy + CI; one screen end-to-end")** → all tasks

Out of scope for Phase 1 (planned in later phases):

- Transaction CRUD → Phase 2 (week 3)
- Categorization → Phase 3 (week 4)
- Goals + dashboard data → Phase 4 (week 5)
- Onboarding intake → Phase 5 (week 6)
- Finance tools → Phase 6 (week 7)
- AI advisor chat → Phase 7 (week 8)
- Eval suite + observability → Phase 8 (week 9)
- Polish + ship → Phase 9 (week 10)
