-- Patitas a Salvo — Production hardening migration
-- Run once in the Supabase SQL editor of project qbptipayhehmhhettxbl. Idempotent.
-- Covers: needs.category, veterinarians table (+mobility), refugios publish policy.

-- ============================ needs.category ============================
-- Structured categorization for reported needs (filtering/prioritization).
alter table public.needs add column if not exists category text;

-- ============================ veterinarians ============================
create table if not exists public.veterinarians (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  clinic_name text,
  city        text not null,
  whatsapp    text not null,
  address     text,
  services    text[] not null default '{}',
  mobility    text,
  notes       text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);
-- Mobility/transportation (Carro / Moto / Ambos / Ninguno) — added if table pre-existed.
alter table public.veterinarians add column if not exists mobility text;
create index if not exists vets_created_idx on public.veterinarians (created_at desc);

alter table public.veterinarians enable row level security;

drop policy if exists "public reads veterinarians" on public.veterinarians;
create policy "public reads veterinarians"
  on public.veterinarians for select using (true);

drop policy if exists "public can offer vet" on public.veterinarians;
create policy "public can offer vet"
  on public.veterinarians for insert
  with check (
    verified = false
    and char_length(coalesce(name,'')) between 1 and 120
    and char_length(coalesce(notes,'')) <= 1000
  );

-- ===================== refugios publish (centers) =====================
-- Refugios are backed by the centers table; publish immediately (read all rows).
alter table public.centers enable row level security;
drop policy if exists "public reads verified centers" on public.centers;
drop policy if exists "public reads refugios" on public.centers;
create policy "public reads refugios"
  on public.centers for select using (true);

-- no update/delete policies on any table -> denied by default
