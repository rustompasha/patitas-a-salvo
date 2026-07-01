-- Patitas a Salvo — Brigada de Respuesta Animal.
-- A filtered, APPROVED field-response team based in Caracas, able to support
-- coordinated animal operations focused on La Guaira. This is NOT a structural
-- rescue team: brigadistas never enter unstable buildings. Distinct from the
-- general volunteers table (see volunteers.sql).
--
-- Publish model (approval-gated, safety-first):
--   public INSERT (forced status='pending') + public SELECT of APPROVED/ACTIVE rows only.
--   Applications are NOT public until an admin promotes them (approved/active) from
--   the Supabase dashboard (service role bypasses RLS). No public update/delete.
-- Run once in the Supabase SQL editor. Idempotent and non-destructive.

create table if not exists public.brigade_members (
  id                            uuid primary key default gen_random_uuid(),
  created_at                    timestamptz not null default now(),
  full_name                     text not null,
  whatsapp                      text not null,
  municipality                  text,
  sector                        text,
  age                           integer,
  occupation                    text,
  can_travel_to_la_guaira       boolean not null default false,
  has_vehicle                   boolean not null default false,
  vehicle_type                  text,
  availability                  text,
  experience_level              text,
  first_aid_training            boolean not null default false,
  veterinary_training           boolean not null default false,
  animal_handling_experience    boolean not null default false,
  disaster_response_experience  boolean not null default false,
  rescue_experience_description text,
  equipment_available           text[] not null default '{}',
  emergency_contact_name        text,
  emergency_contact_phone       text,
  motivation                    text,
  status                        text not null default 'pending'
);

create index if not exists brigade_created_idx      on public.brigade_members (created_at desc);
create index if not exists brigade_status_idx       on public.brigade_members (status);
create index if not exists brigade_municipality_idx on public.brigade_members (municipality);
create index if not exists brigade_laguaira_idx     on public.brigade_members (can_travel_to_la_guaira);

-- Keep status within the allowed lifecycle.
alter table public.brigade_members drop constraint if exists brigade_status_check;
alter table public.brigade_members add constraint brigade_status_check
  check (status in ('pending', 'pre_evaluated', 'approved', 'active', 'suspended'));

alter table public.brigade_members enable row level security;

-- Public reads ONLY approved/active brigadistas.
-- pending / pre_evaluated / suspended stay private (admin-only via the dashboard).
drop policy if exists "public reads active brigade" on public.brigade_members;
create policy "public reads active brigade"
  on public.brigade_members for select
  using (status in ('approved', 'active'));

-- Public can apply — the row is FORCED into 'pending' (approval required before it
-- becomes public/active). Column default 'pending' applies, then this check runs.
drop policy if exists "public can apply to brigade" on public.brigade_members;
create policy "public can apply to brigade"
  on public.brigade_members for insert
  with check (
    status = 'pending'
    and char_length(coalesce(full_name, '')) between 1 and 120
    and char_length(coalesce(whatsapp, '')) between 1 and 40
    and char_length(coalesce(rescue_experience_description, '')) <= 2000
    and char_length(coalesce(motivation, '')) <= 2000
  );
-- no update/delete policies -> denied by default (admin uses the dashboard / service role)
