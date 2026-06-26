export type UrgencyLevel = 'bajo' | 'medio' | 'alto' | 'critico';
export type CenterTypeValue = 'centro_acopio' | 'veterinaria' | 'rescatista' | 'refugio';

export interface CenterRow {
  id: string;
  name: string;
  type: CenterTypeValue;
  city: string;
  address: string | null;
  whatsapp: string | null;
  needs: string[];
  urgency: UrgencyLevel | null;
  notes: string | null;
  verified: boolean;
  created_at: string;
}

export interface NeedRow {
  id: string;
  city: string;
  reference: string | null;
  need: string;
  quantity: string | null;
  urgency: UrgencyLevel | null;
  whatsapp: string | null;
  notes: string | null;
  verified: boolean;
  created_at: string;
}

export interface FosterRow {
  id: string;
  name: string;
  city: string;
  whatsapp: string;
  accepts: string[];
  capacity: string | null;
  availability: string | null;
  notes: string | null;
  verified: boolean;
  created_at: string;
}

export type CenterInsert = {
  name: string;
  type: CenterTypeValue;
  city: string;
  address: string | null;
  whatsapp: string | null;
  needs: string[];
  urgency: UrgencyLevel;
  notes: string | null;
};

// Refugios are stored in the centers table; a RefugeRow is a CenterRow.
export type RefugeInsert = {
  name: string;
  type: CenterTypeValue;
  city: string;
  address: string | null;
  whatsapp: string | null;
  needs: string[];
  notes: string | null;
};

export type NeedInsert = {
  city: string;
  reference: string | null;
  need: string;
  quantity: string | null;
  urgency: UrgencyLevel;
  whatsapp: string | null;
  notes: string | null;
};

export type FosterInsert = {
  name: string;
  city: string;
  whatsapp: string;
  accepts: string[];
  capacity: string | null;
  availability: string | null;
  notes: string | null;
};

export interface VetRow {
  id: string;
  name: string;
  clinic_name: string | null;
  city: string;
  whatsapp: string;
  address: string | null;
  services: string[];
  notes: string | null;
  verified: boolean;
  created_at: string;
}

export type VetInsert = {
  name: string;
  clinic_name: string | null;
  city: string;
  whatsapp: string;
  address: string | null;
  services: string[];
  notes: string | null;
};
