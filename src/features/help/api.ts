import { supabase } from '@/lib/supabase';
import type {
  CenterRow,
  FosterInsert,
  FosterRow,
  NeedInsert,
  NeedRow,
  RefugeInsert,
  VetInsert,
  VetRow,
} from '@/types/help';

/** PostgREST code when a table isn't in the schema cache (missing/not migrated).
 *  Treated as "no data yet", NOT a failure, so the public sees a clean empty state. */
const TABLE_MISSING = 'PGRST205';

/** True when an insert failed only because a column doesn't exist yet (migration
 *  not applied). Lets newer optional fields degrade gracefully instead of breaking
 *  the form in production. */
function isMissingColumn(error: { code?: string } | null): boolean {
  return error?.code === 'PGRST204' || error?.code === '42703';
}

/** Insert `record`; if a not-yet-migrated optional column makes it fail, retry
 *  once without `optionalKeys` so the submission still succeeds. */
async function insertResilient<T extends Record<string, unknown>>(
  table: string,
  record: T,
  optionalKeys: (keyof T)[],
): Promise<void> {
  const { error } = await supabase.from(table).insert(record);
  if (!error) return;
  if (isMissingColumn(error)) {
    const stripped: Record<string, unknown> = { ...record };
    for (const k of optionalKeys) delete stripped[k as string];
    const retry = await supabase.from(table).insert(stripped);
    if (retry.error) throw retry.error;
    return;
  }
  throw error;
}

// ---- Inserts (public; rows are unverified by default) ----------------------
export async function createNeedReport(input: NeedInsert): Promise<void> {
  await insertResilient('needs', input, ['category', 'requester_type', 'requester_name']);
}

export async function createFosterOffer(input: FosterInsert): Promise<void> {
  const { error } = await supabase.from('foster_offers').insert(input);
  if (error) throw error;
}

export async function createVetReport(input: VetInsert): Promise<void> {
  await insertResilient('veterinarians', input, ['mobility']);
}

// Refugios are stored in the centers table (any type). Inserted unverified by default.
export async function createRefugeReport(input: RefugeInsert): Promise<void> {
  await insertResilient('centers', input, [
    'status',
    'capacity',
    'current_animals',
    'payment_mobile_bank',
    'payment_mobile_id',
    'payment_mobile_phone',
    'zelle_email',
    'paypal_email',
  ]);
}

// ---- Reads -----------------------------------------------------------------
// Refugios are backed by the centers table (publishes immediately once the RLS
// SELECT policy is `using(true)` — see supabase/refugios.sql).
export async function getRefugios(): Promise<CenterRow[]> {
  const { data, error } = await supabase
    .from('centers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as CenterRow[];
}

export async function getRefugioById(id: string): Promise<CenterRow | null> {
  const { data, error } = await supabase.from('centers').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as CenterRow | null) ?? null;
}

// Needs publish immediately — this returns ALL rows (no verified gate).
export async function getNeeds(): Promise<NeedRow[]> {
  const { data, error } = await supabase
    .from('needs')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as NeedRow[];
}

// Foster offers publish immediately — this returns ALL rows (no verified gate).
export async function getFosterOffers(): Promise<FosterRow[]> {
  const { data, error } = await supabase
    .from('foster_offers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as FosterRow[];
}

export async function getFosterOfferById(id: string): Promise<FosterRow | null> {
  const { data, error } = await supabase.from('foster_offers').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as FosterRow | null) ?? null;
}

// Veterinarians publish immediately — returns ALL rows (no verified gate).
// If the table isn't migrated yet (PGRST205), return [] so the public sees a
// clean empty state instead of a red error card. Real network errors still throw.
export async function getVeterinarians(): Promise<VetRow[]> {
  const { data, error } = await supabase
    .from('veterinarians')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    if (error.code === TABLE_MISSING) return [];
    throw error;
  }
  return (data ?? []) as VetRow[];
}
