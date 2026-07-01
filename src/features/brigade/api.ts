import { supabase } from '@/lib/supabase';
import type { BrigadeInsert, BrigadeRow } from '@/types/brigade';

/** PostgREST code when a table isn't in the schema cache (not migrated yet).
 *  Treated as "no data yet" so the public directory renders a clean empty state
 *  instead of an error card. */
const TABLE_MISSING = 'PGRST205';

/** Public directory — ONLY approved/active brigadistas (RLS enforces this too).
 *  Active brigadistas sort above merely-approved ones; newest first within each.
 *  If the table isn't migrated yet, returns [] so the page renders cleanly. */
export async function getBrigadeDirectory(): Promise<BrigadeRow[]> {
  const { data, error } = await supabase
    .from('brigade_members')
    .select('*')
    .in('status', ['approved', 'active'])
    .order('created_at', { ascending: false });
  if (error) {
    if (error.code === TABLE_MISSING) return [];
    throw error;
  }
  const rows = (data ?? []) as BrigadeRow[];
  const rank = (s: string) => (s === 'active' ? 0 : 1);
  return rows.sort((a, b) => {
    if (rank(a.status) !== rank(b.status)) return rank(a.status) - rank(b.status);
    return a.created_at < b.created_at ? 1 : -1;
  });
}

/** Application. `status` uses the DB default ('pending') — approval is required
 *  before the record becomes public/active. Throws until the table is migrated. */
export async function createBrigadeMember(input: BrigadeInsert): Promise<void> {
  const { error } = await supabase.from('brigade_members').insert(input);
  if (error) throw error;
}
