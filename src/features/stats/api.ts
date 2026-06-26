import { supabase } from '@/lib/supabase';

export interface ImpactStats {
  pets: number;
  fosters: number;
  needs: number;
  vets: number;
}

/** Exact row count for a table, head-only (no rows fetched). Returns 0 on any error
 *  (e.g. a table that hasn't been migrated yet) so the homepage never breaks. */
async function countRows(table: string): Promise<number> {
  try {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getImpactStats(): Promise<ImpactStats> {
  const [pets, fosters, needs, vets] = await Promise.all([
    countRows('pets'),
    countRows('foster_offers'),
    countRows('needs'),
    countRows('veterinarians'),
  ]);
  return { pets, fosters, needs, vets };
}
