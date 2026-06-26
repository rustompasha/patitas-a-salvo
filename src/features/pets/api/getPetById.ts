import { supabase } from '@/lib/supabase';
import type { Pet } from '@/types/pet';

export async function getPetById(id: string): Promise<Pet | null> {
  const { data, error } = await supabase.from('pets').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as Pet | null) ?? null;
}
