import { supabase } from '@/lib/supabase';
import type { Pet, PetInsert } from '@/types/pet';

export async function createPet(input: PetInsert): Promise<Pet> {
  const { data, error } = await supabase.from('pets').insert(input).select().single();
  if (error) throw error;
  return data as Pet;
}
