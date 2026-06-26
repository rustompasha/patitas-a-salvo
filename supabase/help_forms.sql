-- Patitas a Salvo — Iteration 2.3: help-form tables (centers, needs, foster_offers)
-- Moderation model:
--   centers              -> public INSERT (verified=false) + public SELECT only where verified=true
--   needs, foster_offers -> public INSERT + public SELECT of ALL rows (publishes immediately)
-- Run in the Supabase SQL editor. Idempotent.

-- ============================ centers ============================
create table if not exists public.centers (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in ('centro_acopio','veterinaria','rescatista','refugio')),
  city       text not null,
  address    text,
  whatsapp   text,
  needs      text[] not null default '{}',
  urgency    text check (urgency in ('bajo','medio','alto','critico')),
  notes      text,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists centers_verified_created_idx on public.centers (verified, created_at desc);

alter table public.centers enable row level security;

drop policy if exists "public reads verified centers" on public.centers;
create policy "public reads verified centers"
  on public.centers for select using (verified = true);

drop policy if exists "public can report centers" on public.centers;
create policy "public can report centers"
  on public.centers for insert
  with check (
    verified = false
    and char_length(coalesce(name,'')) between 1 and 160
    and char_length(coalesce(notes,'')) <= 1000
  );
-- no update/delete policies -> denied by default

-- ============================= needs =============================
create table if not exists public.needs (
  id         uuid primary key default gen_random_uuid(),
  city       text not null,
  reference  text,
  need       text not null,
  quantity   text,
  urgency    text check (urgency in ('bajo','medio','alto','critico')),
  whatsapp   text,
  notes      text,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists needs_verified_created_idx on public.needs (verified, created_at desc);

alter table public.needs enable row level security;

-- Needs publish IMMEDIATELY (no verification gate): public reads all rows.
drop policy if exists "public reads verified needs" on public.needs;
drop policy if exists "public reads needs" on public.needs;
create policy "public reads needs"
  on public.needs for select using (true);

drop policy if exists "public can report needs" on public.needs;
create policy "public can report needs"
  on public.needs for insert
  with check (
    verified = false
    and char_length(coalesce(need,'')) between 1 and 200
    and char_length(coalesce(notes,'')) <= 1000
  );

-- ========================= foster_offers =========================
create table if not exists public.foster_offers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  city         text not null,
  whatsapp     text not null,
  accepts      text[] not null default '{}',
  capacity     text,
  availability text,
  notes        text,
  verified     boolean not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists foster_verified_created_idx on public.foster_offers (verified, created_at desc);

alter table public.foster_offers enable row level security;

-- Foster offers publish IMMEDIATELY (no verification gate): public reads all rows.
drop policy if exists "public reads verified foster offers" on public.foster_offers;
drop policy if exists "public reads foster offers" on public.foster_offers;
create policy "public reads foster offers"
  on public.foster_offers for select using (true);

drop policy if exists "public can offer foster" on public.foster_offers;
create policy "public can offer foster"
  on public.foster_offers for insert
  with check (
    verified = false
    and char_length(coalesce(name,'')) between 1 and 120
    and char_length(coalesce(notes,'')) <= 1000
  );
