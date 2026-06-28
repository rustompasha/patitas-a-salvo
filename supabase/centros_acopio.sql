-- Patitas a Salvo — Centros de Acopio (Phase 1).
-- Centros de acopio are stored in the existing public.centers table with
-- type = 'centro_acopio' (already an allowed value of the type CHECK constraint),
-- so NO new table and NO breaking change. These two optional columns add the only
-- fields centros need beyond what centers already has. Idempotent + non-destructive.

alter table public.centers add column if not exists contact_name text; -- responsable
alter table public.centers add column if not exists maps_url text;      -- Google Maps link
