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
  status: string | null;
  capacity: string | null;
  current_animals: string | null;
  payment_mobile_bank: string | null;
  payment_mobile_id: string | null;
  payment_mobile_phone: string | null;
  zelle_email: string | null;
  paypal_email: string | null;
  image_url: string | null;
  notes: string | null;
  /** Centros de acopio only: responsable + Google Maps link (optional columns). */
  contact_name?: string | null;
  maps_url?: string | null;
  verified: boolean;
  created_at: string;
}

/** Centro de acopio insert (stored in `centers`, type='centro_acopio'). Description
 *  maps to `notes`, "qué reciben" to `needs`. */
export type CentroInsert = {
  name: string;
  type: 'centro_acopio';
  city: string;
  address: string | null;
  whatsapp: string | null;
  needs: string[];
  notes: string | null;
  contact_name: string | null;
  maps_url: string | null;
};

export type RequesterType = 'individual' | 'refugio' | 'veterinaria';

export interface NeedRow {
  id: string;
  city: string;
  reference: string | null;
  need: string;
  category: string | null;
  quantity: string | null;
  urgency: UrgencyLevel | null;
  requester_type: string | null;
  requester_name: string | null;
  refuge_id: string | null;
  pet_id: string | null;
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
  status: string | null;
  capacity: string | null;
  current_animals: string | null;
  payment_mobile_bank: string | null;
  payment_mobile_id: string | null;
  payment_mobile_phone: string | null;
  zelle_email: string | null;
  paypal_email: string | null;
  image_url: string | null;
  notes: string | null;
};

export type NeedInsert = {
  city: string;
  reference: string | null;
  need: string;
  category: string | null;
  quantity: string | null;
  urgency: UrgencyLevel;
  requester_type: string;
  requester_name: string | null;
  refuge_id: string | null;
  /** Optional link to the found-pet report this need came from (Found Pet flow). */
  pet_id?: string | null;
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
  mobility: string | null;
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
  mobility: string | null;
  notes: string | null;
};

export interface VolunteerRow {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  state: string | null;
  area: string | null;
  availability: string | null;
  help_types: string[];
  can_help_remote: boolean;
  can_help_in_person: boolean;
  has_transport: boolean;
  has_experience: boolean;
  notes: string | null;
  status: string;
  verified: boolean;
  created_at: string;
}

export type VolunteerInsert = {
  name: string;
  whatsapp: string;
  city: string;
  state: string | null;
  area: string | null;
  availability: string | null;
  help_types: string[];
  can_help_remote: boolean;
  can_help_in_person: boolean;
  has_transport: boolean;
  has_experience: boolean;
  notes: string | null;
};
