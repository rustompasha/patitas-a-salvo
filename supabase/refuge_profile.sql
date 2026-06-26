-- Patitas a Salvo — Refuge profile: logo/photo + donation methods
-- Run once in the Supabase SQL editor of project qbptipayhehmhhettxbl. Idempotent.
-- Adds nullable columns to public.centers. Does not remove or alter existing data.

-- Logo / photo (public URL of the compressed image in storage)
alter table public.centers add column if not exists image_url text;

-- Donation methods
alter table public.centers add column if not exists payment_mobile_bank text;
alter table public.centers add column if not exists payment_mobile_id text;
alter table public.centers add column if not exists payment_mobile_phone text;
alter table public.centers add column if not exists zelle_email text;
alter table public.centers add column if not exists paypal_email text;
