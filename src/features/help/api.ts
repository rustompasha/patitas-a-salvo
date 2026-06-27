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

/** Extract the offending column name from a missing-column error message:
 *  PGRST204 -> "Could not find the 'X' column of 'centers' in the schema cache"
 *  42703    -> "column centers.X does not exist" */
function missingColumnName(message: string | undefined): string | null {
  if (!message) return null;
  return message.match(/'([^']+)' column/)?.[1] ?? message.match(/column \w+\.(\w+)/)?.[1] ?? null;
}

/** Insert `record`; if a not-yet-migrated column makes it fail, drop ONLY that
 *  column and retry, looping until it succeeds. This preserves every column that
 *  DOES exist (e.g. status/capacity) instead of nuking the whole optional set.
 *  `optionalKeys` is the safety net if the column can't be parsed from the error. */
async function insertResilient<T extends Record<string, unknown>>(
  table: string,
  record: T,
  optionalKeys: (keyof T)[],
): Promise<void> {
  const working: Record<string, unknown> = { ...record };
  // At most one strip per optional column, plus a final fallback pass.
  for (let attempt = 0; attempt <= optionalKeys.length; attempt++) {
    const { error } = await supabase.from(table).insert(working);
    if (!error) return;
    if (!isMissingColumn(error)) throw error;

    const col = missingColumnName(error.message);
    if (col && col in working) {
      delete working[col];
      continue;
    }
    // Couldn't identify the column -> strip the whole optional set as a fallback.
    for (const k of optionalKeys) delete working[k as string];
    const retry = await supabase.from(table).insert(working);
    if (retry.error) throw retry.error;
    return;
  }
  // Loop guard exhausted (shouldn't happen): one last attempt, surface any error.
  const final = await supabase.from(table).insert(working);
  if (final.error) throw final.error;
}

// ---- Inserts (public; rows are unverified by default) ----------------------
export async function createNeedReport(input: NeedInsert): Promise<void> {
  await insertResilient('needs', input, [
    'category',
    'requester_type',
    'requester_name',
    'refuge_id',
    'pet_id',
  ]);
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
    'image_url',
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

export async function getNeedById(id: string): Promise<NeedRow | null> {
  const { data, error } = await supabase.from('needs').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as NeedRow | null) ?? null;
}

// Active needs for a refuge — match by refuge_id first (when migrated), then fall
// back to requester_type='refugio' + requester_name (legacy/compat). Results merged
// and de-duped. Tolerates the refuge_id column not existing yet.
export async function getRefugeNeeds(id: string, name: string): Promise<NeedRow[]> {
  let byId: NeedRow[] = [];
  const idRes = await supabase
    .from('needs')
    .select('*')
    .eq('refuge_id', id)
    .order('created_at', { ascending: false });
  if (idRes.error) {
    if (!isMissingColumn(idRes.error)) throw idRes.error;
  } else {
    byId = (idRes.data ?? []) as NeedRow[];
  }

  const nameRes = await supabase
    .from('needs')
    .select('*')
    .eq('requester_type', 'refugio')
    .eq('requester_name', name)
    .order('created_at', { ascending: false });
  if (nameRes.error) throw nameRes.error;

  const merged = [...byId, ...((nameRes.data ?? []) as NeedRow[])];
  const seen = new Set<string>();
  const out: NeedRow[] = [];
  for (const n of merged) {
    if (!seen.has(n.id)) {
      seen.add(n.id);
      out.push(n);
    }
  }
  out.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return out;
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
