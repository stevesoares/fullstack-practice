### Project Amelia – Setup & Deploy

#### Prereqs
- Node.js 18.17+ (LTS recommended)
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)

#### Local Development
1) Environment
```
cp .env.example .env.local
```
Fill at least:
- `DB_PROVIDER=sqlite`
- `DATABASE_URL=file:./prisma/dev.db`
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET=<any random string>`
Optional: OAuth keys (Google/Apple) if testing federated sign-in.

2) Install & DB
```
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
```

3) Run
```
pnpm dev
```
Visit `http://localhost:3000`. The app is behind auth at `/app`. Use Credentials provider (any email + password) to create a user.

4) Seed (optional)
Open `http://localhost:3000/api/seed` in the browser to create demo data.

#### Vercel Deployment
1) Create a new Vercel project and connect the repo.
2) Environment Variables (Project Settings → Environment Variables):
   - `DB_PROVIDER=postgresql`
   - `DATABASE_URL=<your Postgres direct URL>` (e.g., Supabase)
   - `NEXTAUTH_URL=https://<your-vercel-domain>`
   - `NEXTAUTH_SECRET=<strong-random-string>`
   - Optional providers: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.
3) Build & Runtime
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Output: default
4) Database Migration
   - Run locally against your production Postgres before first traffic:
     ```
     # Ensure DATABASE_URL points to Postgres (not SQLite)
     pnpm prisma:generate
     pnpm prisma migrate deploy
     ```
5) Post-deploy
   - Test marketing: `https://<domain>/`
   - Test app auth: `https://<domain>/app` (should redirect to sign-in if logged out)



