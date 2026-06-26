-- Patitas a Salvo — Refuge → Need ownership link
-- Run once in the Supabase SQL editor of project qbptipayhehmhhettxbl. Idempotent.
-- Backward compatible: existing needs keep working (matched by requester_name);
-- new needs created from a refuge profile also store refuge_id.

alter table public.needs add column if not exists refuge_id uuid;
create index if not exists needs_refuge_idx on public.needs (refuge_id);
