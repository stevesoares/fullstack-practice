Project Amelia – Marketing + App (Next.js 15, Tailwind v4, Prisma)

## Overview
- Marketing site at `/` (public)
- App at `/app` (auth required)
- Auth via NextAuth (JWT). Credentials and OAuth providers supported.
- DB: Prisma (SQLite local, Postgres recommended on Vercel)

## Quick Start (Local)

```bash
pnpm install
cp .env.example .env.local
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

Then:
- Visit http://localhost:3000 (marketing landing)
- Click Login → choose Credentials, enter any email + password (a user will be created if none exists)
- You’ll be redirected to `/app` with the app UI and KPIs
- Optional seed data: open http://localhost:3000/api/seed to create demo leads

## Routes & Structure
- Marketing: `src/app/(marketing)/page.tsx`, navbar in `src/app/(landing)/components/Navbar.tsx`
- App shell: `src/app/(app)/app/layout.tsx` with tabs (Overview, Calendar, Leads, Clients, Sales, Galleries)
- App pages: `src/app/(app)/app/*`
- Auth routes: `src/app/api/auth/[...nextauth]/route.ts`
- Middleware protection for app: `src/middleware.ts`

## Environment
Copy `.env.example` → `.env.local` and adjust as needed. Minimum for local:
- `DB_PROVIDER=sqlite`
- `DATABASE_URL=file:./prisma/dev.db`
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET=generate_a_random_string`
OAuth provider keys are optional for local (Credentials provider works out of the box).

## Testing Locally (Pre-deploy)
- Start dev server: `pnpm dev`
- Seed demo data: GET `http://localhost:3000/api/seed`
- Check auth guard: open `http://localhost:3000/app` in an incognito window → redirected to sign-in
- Run e2e smoke test: `pnpm test` (verifies landing renders hero heading)

## Deploy (Vercel)
See `SETUP.md` for complete instructions. High level:
- Create a Vercel project, connect this repo
- Set env vars from `.env.example`
- Use Postgres (e.g., Supabase) and set `DB_PROVIDER=postgresql` and `DATABASE_URL`
- Run `pnpm prisma:generate` locally; run your first migration against your Postgres DB before production

## Fonts & UI
- Sans: Geist; Mono: Geist Mono; Serif brand: Cormorant Garamond for the “Amelia” wordmark in the app header.
