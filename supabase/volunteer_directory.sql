-- Patitas a Salvo — Volunteers → people directory upgrade.
-- Adds profile photo + location/modality fields, indexes, and a public
-- volunteer-photos storage bucket. Non-destructive and idempotent.
--
-- Security model is UNCHANGED and deliberate:
--   * public SELECT: only ACTIVE volunteers.
--   * public INSERT: new volunteers (verified=false, status='active').
--   * NO public UPDATE / DELETE — existing rows can't be edited or sabotaged.
-- New volunteers submit their photo once at registration (upload-first, then the
-- row is inserted with photo_url/photo_path). Existing volunteers get photos only
-- via admin/manual process. Run once in the Supabase SQL editor.

-- 1. Columns -----------------------------------------------------------------
alter table public.volunteers add column if not exists photo_url         text;
alter table public.volunteers add column if not exists photo_path        text;
alter table public.volunteers add column if not exists photo_uploaded_at timestamptz;
alter table public.volunteers add column if not exists country           text not null default 'Venezuela';
alter table public.volunteers add column if not exists modality          text;

-- modality is optional (legacy rows derive it from can_help_remote/in_person in
-- the UI), but when present it must be one of the three known values.
alter table public.volunteers drop constraint if exists volunteers_modality_check;
alter table public.volunteers add constraint volunteers_modality_check
  check (modality is null or modality in ('remote', 'in_person', 'both'));

-- 2. Indexes -----------------------------------------------------------------
create index if not exists volunteers_country_idx on public.volunteers (country);
create index if not exists volunteers_state_idx   on public.volunteers (state);
create index if not exists volunteers_city_idx    on public.volunteers (city);
create index if not exists volunteers_status_idx  on public.volunteers (status);

-- 3. RLS ---------------------------------------------------------------------
-- (Re-asserted for clarity — same as volunteers.sql. No UPDATE/DELETE policy is
--  created, so those operations stay denied by default. The new columns are
--  insertable because the INSERT check below doesn't restrict them.)
alter table public.volunteers enable row level security;

drop policy if exists "public reads active volunteers" on public.volunteers;
create policy "public reads active volunteers"
  on public.volunteers for select using (status = 'active');

drop policy if exists "public can register volunteer" on public.volunteers;
create policy "public can register volunteer"
  on public.volunteers for insert
  with check (
    verified = false
    and status = 'active'
    and char_length(coalesce(name, '')) between 1 and 120
    and char_length(coalesce(notes, '')) <= 1000
  );

-- 4. Storage bucket: volunteer-photos ----------------------------------------
insert into storage.buckets (id, name, public)
values ('volunteer-photos', 'volunteer-photos', true)
on conflict (id) do nothing;

-- Public can READ photos (bucket is public).
drop policy if exists "public can read volunteer photos" on storage.objects;
create policy "public can read volunteer photos"
  on storage.objects for select
  using (bucket_id = 'volunteer-photos');

-- Public can UPLOAD a new photo (registration). No update/delete policy exists,
-- and uploads use upsert:false + unique paths, so nobody can overwrite/replace
-- an existing volunteer's photo.
drop policy if exists "anyone can upload volunteer photos" on storage.objects;
create policy "anyone can upload volunteer photos"
  on storage.objects for insert
  with check (bucket_id = 'volunteer-photos');
