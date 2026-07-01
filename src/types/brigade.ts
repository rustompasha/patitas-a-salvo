// Brigada de Respuesta Animal — approval-gated field-response team (Caracas,
// deploys toward La Guaira when coordinated). Backed by the brigade_members table.
export type BrigadeStatus = 'pending' | 'pre_evaluated' | 'approved' | 'active' | 'suspended';

export interface BrigadeRow {
  id: string;
  created_at: string;
  full_name: string;
  whatsapp: string;
  municipality: string | null;
  sector: string | null;
  age: number | null;
  occupation: string | null;
  can_travel_to_la_guaira: boolean;
  has_vehicle: boolean;
  vehicle_type: string | null;
  availability: string | null;
  experience_level: string | null;
  first_aid_training: boolean;
  veterinary_training: boolean;
  animal_handling_experience: boolean;
  disaster_response_experience: boolean;
  rescue_experience_description: string | null;
  equipment_available: string[];
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  motivation: string | null;
  status: BrigadeStatus;
}

// Application insert. `status` is intentionally omitted — the DB default ('pending')
// applies and the RLS INSERT check enforces it (approval required before active).
export type BrigadeInsert = {
  full_name: string;
  whatsapp: string;
  municipality: string | null;
  sector: string | null;
  age: number | null;
  occupation: string | null;
  can_travel_to_la_guaira: boolean;
  has_vehicle: boolean;
  vehicle_type: string | null;
  availability: string | null;
  experience_level: string | null;
  first_aid_training: boolean;
  veterinary_training: boolean;
  animal_handling_experience: boolean;
  disaster_response_experience: boolean;
  rescue_experience_description: string | null;
  equipment_available: string[];
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  motivation: string | null;
};
