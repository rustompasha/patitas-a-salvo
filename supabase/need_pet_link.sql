-- Patitas a Salvo — link a need to the found-pet report it came from.
-- Run once in the Supabase SQL editor. Idempotent and non-destructive:
-- existing needs keep working; new needs created from the Found Pet flow store pet_id.

alter table public.needs add column if not exists pet_id uuid;
create index if not exists needs_pet_idx on public.needs (pet_id);
