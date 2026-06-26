-- Patitas a Salvo — Iteration 2.4: veterinarians table
-- Publish model (same as needs / foster_offers):
--   public INSERT (verified=false) + public SELECT of ALL rows (publishes immediately)
-- Run in the Supabase SQL editor. Idempotent.

-- ========================= veterinarians =========================
create table if not exists public.veterinarians (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  clinic_name text,
  city        text not null,
  whatsapp    text not null,
  address     text,
  services    text[] not null default '{}',
  notes       text,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists vets_created_idx on public.veterinarians (created_at desc);

alter table public.veterinarians enable row level security;

-- Veterinarians publish IMMEDIATELY (no verification gate): public reads all rows.
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
-- no update/delete policies -> denied by default
