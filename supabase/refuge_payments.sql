-- Patitas a Salvo — Refugio donation / payment methods
-- Run once in the Supabase SQL editor of project qbptipayhehmhhettxbl. Idempotent.
-- Lets refugios publish payment info so people can donate directly.

alter table public.centers add column if not exists payment_mobile_bank text;
alter table public.centers add column if not exists payment_mobile_id text;
alter table public.centers add column if not exists payment_mobile_phone text;
alter table public.centers add column if not exists zelle_email text;
alter table public.centers add column if not exists paypal_email text;
