### Project Amelia – Setup & Deploy

#### Prereqs
- Node.js 18.17+ (LTS recommended)
- pnpm 9+ (`corepack enable && corepack prepare pnpm@latest --activate`)

#### Local Development
1) Environment
```
source ~/.nvm/nvm.sh && nvm use
cp .env.example .env.local
```
Fill at least:
- `DB_PROVIDER=sqlite`
- `DATABASE_URL=file:./prisma/dev.db`
- `NEXTAUTH_URL=http://localhost:3000`
- `NEXTAUTH_SECRET=<any random string>`
Optional: OAuth keys (Google/Apple) if testing federated sign-in.
`DB_PROVIDER` is an app-level flag and does not change Prisma's datasource provider in this repo.

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
Visit `http://localhost:3000`. The app is behind auth at `/app`. Create an account at `/auth/signup`, then sign in at `/auth/signin`.

4) Seed (optional)
Open `http://localhost:3000/api/seed` in the browser to create demo data (development only).

#### Vercel Deployment
1) Create a new Vercel project and connect the repo.
2) Environment Variables (Project Settings → Environment Variables):
   - `DB_PROVIDER=sqlite`
   - `DATABASE_URL=<persistent sqlite path>`
   - `NEXTAUTH_URL=https://<your-vercel-domain>`
   - `NEXTAUTH_SECRET=<strong-random-string>`
   - `SEED_SECRET=<random string>` (required to allow seed endpoint outside development)
   - Optional providers: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, etc.
3) Build & Runtime
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Output: default
4) Database Migration
   - Run locally against your deployment database before first traffic:
     ```
     # Ensure DATABASE_URL points to your deployment database
     pnpm prisma:generate
     pnpm prisma migrate deploy
     ```
5) Post-deploy
   - Test marketing: `https://<domain>/`
   - Test app auth: `https://<domain>/app` (should redirect to sign-in if logged out)
