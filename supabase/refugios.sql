-- Patitas a Salvo — Launch cleanup: Refugios publish immediately
-- Refugios are backed by the existing public.centers table. For launch we drop the
-- verification gate so refugios are publicly readable as soon as they're registered
-- (same model as needs / foster_offers). Insert policy is unchanged.
-- Run in the Supabase SQL editor of project qbptipayhehmhhettxbl. Idempotent.

alter table public.centers enable row level security;

-- Publish IMMEDIATELY: public reads all centers (refugios), not only verified ones.
drop policy if exists "public reads verified centers" on public.centers;
drop policy if exists "public reads refugios" on public.centers;
create policy "public reads refugios"
  on public.centers for select using (true);

-- (Insert policy "public can report centers" stays as-is: public INSERT, verified=false.)
-- no update/delete policies -> denied by default
