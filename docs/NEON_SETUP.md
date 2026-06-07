# Migrate to Neon PostgreSQL

Neon offers a **free PostgreSQL** tier that does not expire after 30 days (unlike Render's free Postgres). Follow these steps to switch your live API from Render Postgres to Neon.

## Step 1 — Create a Neon database

1. Sign up at [neon.tech](https://neon.tech) (free, no credit card).
2. Create a new project, e.g. `job-tracker`.
3. Copy the **connection string** (starts with `postgres://` or `postgresql://`).
   - Use the **pooled** connection string for serverless/production if offered.

## Step 2 — Load your schema

From your machine (replace the connection string):

```bash
psql "postgresql://USER:PASSWORD@HOST/neondb?sslmode=require" -f init.sql
```

Or use the Neon SQL Editor and paste the contents of `init.sql`.

## Step 3 — Update Render environment

1. Go to [Render Dashboard](https://dashboard.render.com) → **job-tracker-api** → **Environment**.
2. Set **`DATABASE_URL`** to your Neon connection string.
3. Ensure **`NODE_ENV`** is `production`.
4. Save changes — Render will redeploy.

## Step 4 — Remove Render Postgres (optional)

Once Neon is working:

1. Confirm production API works:  
   `curl https://job-tracker-api-4anc.onrender.com/health`
2. Register/login and create a test job.
3. In Render, delete the old **job-tracker-db** service to avoid confusion.

## Step 5 — Update Blueprint (already done in repo)

`render.yaml` no longer provisions Render Postgres. `DATABASE_URL` is set manually in the Render dashboard (sync: false).

## Verify connection

Check Render logs for:

```text
✅ Database connected successfully
✅ Database schema ready
```

## Local development with Neon

Add to your local `.env` (optional — you can still use local Postgres):

```env
DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
```

When `DATABASE_URL` is set, the app uses it instead of individual `DB_*` variables.
