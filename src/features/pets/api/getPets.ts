import { supabase } from '@/lib/supabase';
import type { Pet, PetQuery } from '@/types/pet';

/** Strip characters that would break a PostgREST `.or()` filter. */
function sanitize(term: string): string {
  return term.replace(/[,()%*]/g, ' ').trim();
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
