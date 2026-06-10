<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CanteenLY

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/cea448f3-d6c6-49fa-a995-01634bff1ed6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create a Supabase project.
3. Run [`supabase/schema.sql`](supabase/schema.sql) and then [`supabase/seed.sql`](supabase/seed.sql) in the Supabase SQL editor.
4. Copy `.env.example` to `.env` and set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `JWT_SECRET`. Use the Supabase backend secret (`sb_secret_...`) or legacy service-role key, not the publishable key. Backend secrets must never be exposed to the browser.
5. Run the app:
   `npm run dev`

## Seed accounts

- Admin: `admin@canteenly.com` / `admin123`
- Student: `user@canteenly.com` / `user123`

The Express API keeps the frontend-compatible response shape while persisting normalized data in Supabase Postgres.
