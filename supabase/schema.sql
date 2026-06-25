-- Patitas a Salvo — MVP schema
-- Run in the Supabase SQL editor (or `supabase db push`).

-- 1. Table -------------------------------------------------------------------
create table if not exists public.pets (
  id          uuid primary key default gen_random_uuid(),
  status      text not null check (status in ('lost','found')),
  name        text,
  species     text,
  description text,
  location    text,
  phone       text,
  image_url   text,
  created_at  timestamptz not null default now()
);

-- 2. Indexes -----------------------------------------------------------------
create index if not exists pets_status_created_idx on public.pets (status, created_at desc);
create index if not exists pets_created_idx on public.pets (created_at desc);

create extension if not exists pg_trgm;
create index if not exists pets_search_idx on public.pets
  using gin (
    (coalesce(name,'') || ' ' || coalesce(description,'') || ' ' ||
     coalesce(location,'') || ' ' || coalesce(species,'')) gin_trgm_ops
  );

-- 3. Row Level Security ------------------------------------------------------
alter table public.pets enable row level security;

drop policy if exists "public can read pets" on public.pets;
create policy "public can read pets"
  on public.pets for select
  using (true);

drop policy if exists "anyone can report a pet" on public.pets;
create policy "anyone can report a pet"
  on public.pets for insert
  with check (
    status in ('lost','found')
    and char_length(coalesce(description,'')) <= 1000
    and char_length(coalesce(phone,'')) <= 25
  );
-- No update/delete policies -> those operations are denied by default.

-- 4. Storage bucket ----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pet-images', 'pet-images', true)
on conflict (id) do nothing;

drop policy if exists "public can read pet images" on storage.objects;
create policy "public can read pet images"
  on storage.objects for select
  using (bucket_id = 'pet-images');

drop policy if exists "anyone can upload pet images" on storage.objects;
create policy "anyone can upload pet images"
  on storage.objects for insert
  with check (bucket_id = 'pet-images');
