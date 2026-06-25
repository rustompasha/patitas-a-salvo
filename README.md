# Patitas a Salvo 🐾

Mobile-first web app to report and find **lost & found pets** after the earthquake in Venezuela.

MVP scope: Home, Report Lost, Report Found, Listing, Search, Filters, image upload to
Supabase Storage, and WhatsApp / Call / Share contact actions.

## Stack

React + Vite + TypeScript · Tailwind CSS · Supabase (Postgres + Storage) ·
TanStack Query · React Hook Form + Zod · deployed on Cloudflare Pages.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

### Environment variables

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key (safe to ship; protected by RLS) |
| `VITE_SUPABASE_STORAGE_BUCKET` | Storage bucket name (default `pet-images`) |

### Database setup

Run `supabase/schema.sql` in the Supabase SQL editor. It creates the `pets` table,
indexes, RLS policies (public read + public insert only), and the public `pet-images`
storage bucket with upload/read policies.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | Type-check only |

## Deploy — Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Environment variables:** set the three `VITE_*` vars (Production + Preview)
- SPA routing is handled by `public/_redirects` (`/* /index.html 200`)

## Project structure

```
src/
  components/     ui primitives, layout shell, contact buttons
  features/pets/  api · hooks · components (cards, grid, form, search, filters)
  pages/          Home, ReportLost, ReportFound, Listing, NotFound
  lib/            supabase client, env validation, utils
  constants/      design tokens, config
  types/          Pet types
```

## Not in this MVP

Centers, inventory, volunteers, vets, dashboards, maps, QR, auth, admin panels.
Anti-spam (Cloudflare Turnstile) is intentionally deferred.
