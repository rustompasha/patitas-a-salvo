-- Patitas a Salvo — Refugios + Needs finalization
-- Run once in the Supabase SQL editor of project qbptipayhehmhhettxbl. Idempotent.
-- Needs gain a requester identity; refuges (centers) gain permanent-entity fields.

-- Needs: who is requesting (individual | refugio | veterinaria) + org name.
alter table public.needs add column if not exists requester_type text;
alter table public.needs add column if not exists requester_name text;

-- Refuges (centers) are permanent entities: operational status + capacity.
alter table public.centers add column if not exists status text;
alter table public.centers add column if not exists capacity text;
alter table public.centers add column if not exists current_animals text;
