### Project Amelia – Setup

1. Prereqs: Node 18+ (LTS), pnpm. If pnpm missing: `corepack enable && corepack prepare pnpm@latest --activate`.
2. Copy env: `cp .env.example .env.local` and fill required values. For local dev defaults work.
3. Install: `pnpm install`.
4. DB: `pnpm prisma:generate` then `pnpm prisma:migrate`.
5. Dev: `pnpm dev` (opens on http://localhost:3000).

#### Vercel Deploy
- Create project, add env vars from `.env.example`.
- Set `DB_PROVIDER=postgresql` and provide Supabase `DATABASE_URL`.
- Add Stripe/Resend/OpenAI keys when enabling those features.


