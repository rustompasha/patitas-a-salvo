-- Patitas a Salvo — Volunteers module.
-- Publish model: public INSERT (active, unverified) + public SELECT of ACTIVE rows.
-- Run once in the Supabase SQL editor. Idempotent and non-destructive.

create table if not exists public.volunteers (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  name               text not null,
  whatsapp           text not null,
  city               text not null,
  state              text,
  area               text,
  availability       text,
  help_types         text[] not null default '{}',
  can_help_remote    boolean not null default false,
  can_help_in_person boolean not null default false,
  has_transport      boolean not null default false,
  has_experience     boolean not null default false,
  notes              text,
  status             text not null default 'active',
  verified           boolean not null default false
);

create index if not exists volunteers_created_idx  on public.volunteers (created_at desc);
create index if not exists volunteers_city_idx      on public.volunteers (city);
create index if not exists volunteers_state_idx     on public.volunteers (state);
create index if not exists volunteers_status_idx    on public.volunteers (status);
create index if not exists volunteers_verified_idx  on public.volunteers (verified);

alter table public.volunteers enable row level security;

-- Public reads only ACTIVE volunteers.
drop policy if exists "public reads active volunteers" on public.volunteers;
create policy "public reads active volunteers"
  on public.volunteers for select using (status = 'active');

-- Public can register (active, unverified). No auth required.
drop policy if exists "public can register volunteer" on public.volunteers;
create policy "public can register volunteer"
  on public.volunteers for insert
  with check (
    verified = false
    and status = 'active'
    and char_length(coalesce(name,'')) between 1 and 120
    and char_length(coalesce(notes,'')) <= 1000
  );
-- no update/delete policies -> denied by default
