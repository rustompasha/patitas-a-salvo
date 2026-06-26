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

// ---- Inserts (public; rows are unverified by default) ----------------------
export async function createNeedReport(input: NeedInsert): Promise<void> {
  const { error } = await supabase.from('needs').insert(input);
  if (error) throw error;
}

export async function createFosterOffer(input: FosterInsert): Promise<void> {
  const { error } = await supabase.from('foster_offers').insert(input);
  if (error) throw error;
}

export async function createVetReport(input: VetInsert): Promise<void> {
  const { error } = await supabase.from('veterinarians').insert(input);
  if (error) throw error;
}

// Refugios are stored in the centers table (any type). Inserted unverified by default.
export async function createRefugeReport(input: RefugeInsert): Promise<void> {
  const { error } = await supabase.from('centers').insert(input);
  if (error) throw error;
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
