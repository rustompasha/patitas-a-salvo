import { supabase } from '@/lib/supabase';

export interface ImpactStats {
  pets: number;
  fosters: number;
  needs: number;
  refugios: number;
  vets: number;
  centros: number;
  volunteers: number;
}

type CountQuery = ReturnType<ReturnType<typeof supabase.from>['select']>;

/** Exact row count for a table, head-only (no rows fetched). Optional `apply`
 *  narrows the count (e.g. by type). Returns 0 on any error (e.g. a table that
 *  hasn't been migrated yet) so the homepage never breaks. */
async function countRows(table: string, apply?: (q: CountQuery) => CountQuery): Promise<number> {
  try {
    let query = supabase.from(table).select('*', { count: 'exact', head: true });
    if (apply) query = apply(query);
    const { count, error } = await query;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getImpactStats(): Promise<ImpactStats> {
  const [pets, fosters, needs, refugios, vets, centros, volunteers] = await Promise.all([
    countRows('pets'),
    countRows('foster_offers'),
    countRows('needs'),
    // Refuges and centros de acopio share the centers table — count them separately.
    countRows('centers', (q) => q.neq('type', 'centro_acopio')),
    countRows('veterinarians'),
    countRows('centers', (q) => q.eq('type', 'centro_acopio')),
    // Active volunteers; resilient if the table isn't migrated yet (returns 0).
    countRows('volunteers', (q) => q.eq('status', 'active')),
  ]);
  return { pets, fosters, needs, refugios, vets, centros, volunteers };
}
