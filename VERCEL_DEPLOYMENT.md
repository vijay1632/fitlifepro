# Vercel deployment

This project is a server-rendered Next.js application. Vercel should detect the **Next.js** framework; do not configure it as a static export.

## Required Vercel environment variables

- `DATABASE_URL` — a production PostgreSQL connection string that accepts connections from Vercel.
- `NEXTAUTH_SECRET` — a new, random value of at least 32 characters.
- `NEXTAUTH_URL` — the production URL, for example `https://your-project.vercel.app`.

Set all three for the Production environment. Never put their values in source control or in variables prefixed with `NEXT_PUBLIC_`.

## First deployment

1. Create the PostgreSQL database and add `DATABASE_URL` in Vercel.
2. From a trusted local machine that has the same `DATABASE_URL`, run `npx prisma db push` once to create the schema. This repository has no checked-in Prisma migrations yet, so database initialization is intentionally not part of the Vercel build.
3. Deploy from the `main` branch. Vercel will use Node 20, run `npm install` (which generates Prisma Client), and run `npm run build`.

If Vercel still shows an old static-build configuration, redeploy after pulling this revision. The included `vercel.json` now declares the Next.js framework and no catch-all static route.
