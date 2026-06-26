import { supabase } from '@/lib/supabase';
import type {
  CenterInsert,
  CenterRow,
  FosterInsert,
  FosterRow,
  NeedInsert,
  NeedRow,
  VetInsert,
  VetRow,
} from '@/types/help';

// ---- Inserts (public; rows are unverified by default) ----------------------
export async function createCenterReport(input: CenterInsert): Promise<void> {
  const { error } = await supabase.from('centers').insert(input);
  if (error) throw error;
}

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

// ---- Reads -----------------------------------------------------------------
// Centers stay moderated: RLS returns only verified = true rows.
export async function getVerifiedCenters(): Promise<CenterRow[]> {
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

// Veterinarians publish immediately — this returns ALL rows (no verified gate).
export async function getVeterinarians(): Promise<VetRow[]> {
  const { data, error } = await supabase
    .from('veterinarians')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as VetRow[];
}
