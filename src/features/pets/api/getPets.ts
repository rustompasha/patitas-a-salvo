import { supabase } from '@/lib/supabase';
import type { Pet, PetQuery, PetStatus } from '@/types/pet';

/** Strip characters that would break a PostgREST `.or()` filter. */
function sanitize(term: string): string {
  return term.replace(/[,()%*]/g, ' ').trim();
}

/** Page size for the Mascotas listing ("Cargar más"). 24 fills the 2-col grid evenly. */
export const PETS_PAGE_SIZE = 24;

export interface PetsPage {
  rows: Pet[];
  /** Exact total matching the current filter+search (ignores pagination range). */
  count: number;
  /** Next page index, or null when everything matching is loaded. */
  nextPage: number | null;
}

/**
 * Paginated fetch for the listing page. Uses `count: 'exact'` so we get the TRUE
 * total matching the filter (not the returned-row length), and `.range()` instead
 * of a hard `.limit(100)` so every pet is reachable via "Cargar más".
 */
export async function getPetsPage({ status, search }: PetQuery, page: number): Promise<PetsPage> {
  const from = page * PETS_PAGE_SIZE;
  const to = from + PETS_PAGE_SIZE - 1;

  let query = supabase
    .from('pets')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') query = query.eq('status', status);
  const term = sanitize(search);
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `name.ilike.${like},description.ilike.${like},location.ilike.${like},species.ilike.${like}`,
    );
  }

  const { data, count, error } = await query;
  if (error) throw error;
  const rows = (data ?? []) as Pet[];
  const total = count ?? 0;
  const loaded = from + rows.length;
  return { rows, count: total, nextPage: loaded < total ? page + 1 : null };
}

/** Exact category sizes for the filter tabs (Todas / Perdidas / Encontradas).
 *  `all` = lost + found (the DB CHECK constraint allows only these two statuses). */
export async function getPetCounts(): Promise<{ all: number; lost: number; found: number }> {
  const headCount = async (status: PetStatus): Promise<number> => {
    const { count, error } = await supabase
      .from('pets')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);
    if (error) throw error;
    return count ?? 0;
  };
  const [lost, found] = await Promise.all([headCount('lost'), headCount('found')]);
  return { all: lost + found, lost, found };
}

export async function getPets({ status, search }: PetQuery): Promise<Pet[]> {
  let query = supabase
    .from('pets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const term = sanitize(search);
  if (term) {
    const like = `%${term}%`;
    query = query.or(
      `name.ilike.${like},description.ilike.${like},location.ilike.${like},species.ilike.${like}`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Pet[];
}
