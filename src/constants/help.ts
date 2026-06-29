import type { CenterRow, CenterTypeValue, UrgencyLevel } from '@/types/help';

export const CENTER_TYPE_OPTIONS: { value: CenterTypeValue; label: string }[] = [
  { value: 'centro_acopio', label: 'Centro de acopio' },
  { value: 'veterinaria', label: 'Veterinaria' },
  { value: 'rescatista', label: 'Rescatista' },
  { value: 'refugio', label: 'Refugio' },
];

export const URGENCY_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' },
  { value: 'critico', label: 'Crítico' },
];

export const NEED_OPTIONS = [
  'Perrarina',
  'Gatarina',
  'Transportadoras',
  'Medicinas',
  'Atención veterinaria',
  'Hogares temporales',
  'Agua',
  'Otro',
];

export const ACCEPTS_OPTIONS = ['Perros', 'Gatos', 'Cachorros', 'Animales heridos'];
export const CAPACITY_OPTIONS = ['1', '2', '3+'];
export const TIME_OPTIONS = ['24h', '3 días', '1 semana', 'Indefinido'];

export const VET_SERVICE_OPTIONS = [
  'Atención de emergencia',
  'Respuesta en sitio',
  'Cirugía',
  'Hospitalización',
  'Medicamentos',
  'Eutanasia humanitaria',
  'Rescate de animales',
  'Traslado veterinario',
  'Consulta general',
];

// Vet transportation/mobility (single-select). Critical during disaster response.
export const VET_MOBILITY_OPTIONS = ['Carro', 'Moto', 'Ambos', 'Ninguno'];

// Structured categorization for reported needs (single-select), for filtering.
export const NEED_CATEGORY_OPTIONS = [
  'Perrarina',
  'Gatarina',
  'Medicamentos',
  'Atención veterinaria',
  'Transporte',
  'Hogar temporal',
  'Rescate',
  'Refugio',
  'Otro',
];

// Who is requesting a need (single-select). Drives the card header + contact copy.
export const REQUESTER_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'individual', label: 'Persona individual' },
  { value: 'refugio', label: 'Refugio / Organización de rescate' },
  { value: 'veterinaria', label: 'Clínica veterinaria' },
];

export const REQUESTER_META: Record<string, { emoji: string; label: string; badge: string }> = {
  individual: { emoji: '🧍', label: 'Solicitud individual', badge: 'bg-sand-100 text-[#3A4650]' },
  refugio: { emoji: '🐾', label: 'Solicitud de refugio', badge: 'bg-[#EAF3EC] text-forest' },
  veterinaria: { emoji: '🏥', label: 'Solicitud veterinaria', badge: 'bg-[#E7F0FA] text-[#1F5F8B]' },
  // Created automatically from the "encontré una mascota" guided flow.
  finder: { emoji: '🆘', label: 'Animal rescatado temporalmente', badge: 'bg-[#FCE7D6] text-[#C2410C]' },
};

// Help a finder can request from the guided found-pet flow. `category` maps the
// selection onto the existing NEED_CATEGORY_OPTIONS so cards/filters stay consistent.
export const FINDER_HELP_OPTIONS: { key: string; label: string; category: string }[] = [
  { key: 'food', label: 'Alimento', category: 'Perrarina' },
  { key: 'vet', label: 'Atención veterinaria', category: 'Atención veterinaria' },
  { key: 'home', label: 'Hogar temporal', category: 'Hogar temporal' },
  { key: 'transport', label: 'Transporte', category: 'Transporte' },
  { key: 'supplies', label: 'Insumos', category: 'Otro' },
  { key: 'volunteers', label: 'Voluntarios', category: 'Rescate' },
  { key: 'other', label: 'Otro', category: 'Otro' },
];

export function requesterMeta(type: string | null) {
  return REQUESTER_META[type ?? 'individual'] ?? REQUESTER_META.individual;
}

/** Contextual prefilled WhatsApp message by requester type (opened via wa.me). */
export function needContactMessage(type: string | null): string {
  if (type === 'refugio')
    return 'Hola, vi tu solicitud en Patitas a Salvo. Me gustaría ayudar con los insumos solicitados.';
  if (type === 'veterinaria')
    return 'Hola, vi tu solicitud veterinaria en Patitas a Salvo. ¿Cómo puedo ayudar?';
  if (type === 'finder')
    return 'Hola, vi que rescataste un animal y necesitas apoyo en Patitas a Salvo. Quiero ayudar.';
  return 'Hola, vi tu solicitud en Patitas a Salvo y me gustaría ayudar.';
}

// Refuges are permanent entities — operational status (single-select).
export const REFUGE_STATUS_OPTIONS = [
  'Activo',
  'Lleno',
  'Solo recibe insumos',
  'Sobrecupo de emergencia',
];

export const REFUGE_STATUS_BADGE: Record<string, string> = {
  Activo: 'bg-[#DCF0EC] text-[#1F7A6D]',
  Lleno: 'bg-[#FCE7D6] text-[#C2410C]',
  'Solo recibe insumos': 'bg-[#FAEAD0] text-[#9C6B12]',
  'Sobrecupo de emergencia': 'bg-[#FBE3E1] text-[#C81E1E]',
};

export const URGENCY_DB_META: Record<UrgencyLevel, { label: string; badge: string }> = {
  bajo: { label: 'Bajo', badge: 'bg-[#FAEAD0] text-[#9C6B12]' },
  medio: { label: 'Medio', badge: 'bg-[#FAEAD0] text-[#9C6B12]' },
  alto: { label: 'Alto', badge: 'bg-[#FCE7D6] text-[#C2410C]' },
  critico: { label: 'Crítico', badge: 'bg-[#FBE3E1] text-[#C81E1E]' },
};

export function centerTypeLabel(value: CenterTypeValue): string {
  return CENTER_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// ---- Refugios (backed by the centers table) --------------------------------
// Form Tipo options. Values are unique for the <Select>; 'ong' is mapped to the
// 'refugio' enum on insert (the centers.type CHECK only allows 4 values).
export const REFUGE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'refugio', label: 'Refugio' },
  { value: 'rescatista', label: 'Rescatista organizado' },
  { value: 'veterinaria', label: 'Veterinaria aliada' },
  { value: 'centro_acopio', label: 'Punto de recepción de insumos' },
  { value: 'ong', label: 'ONG' },
];

export function refugeTypeToCenterType(value: string): CenterTypeValue {
  return value === 'ong' ? 'refugio' : (value as CenterTypeValue);
}

const REFUGE_TYPE_LABEL: Record<CenterTypeValue, string> = {
  refugio: 'Refugio',
  rescatista: 'Rescatista',
  veterinaria: 'Veterinaria aliada',
  centro_acopio: 'Punto de recepción',
};

export function refugeTypeLabel(value: CenterTypeValue): string {
  return REFUGE_TYPE_LABEL[value] ?? 'Refugio';
}

export const REFUGE_RECEIVE_OPTIONS = [
  'Perros',
  'Gatos',
  'Perrarina',
  'Gatarina',
  'Medicinas',
  'Insumos',
  'Atención veterinaria',
  'Hogares temporales',
];

// ---- Volunteers ------------------------------------------------------------
export const VOLUNTEER_HELP_OPTIONS = [
  'Difusión en redes',
  'Verificación de casos',
  'Transporte',
  'Coordinación por WhatsApp',
  'Apoyo en centros de acopio',
  'Apoyo a refugios',
  'Apoyo veterinario',
  'Traslados',
  'Logística',
  'Otro',
];

export const VOLUNTEER_AVAILABILITY_OPTIONS = [
  'Hoy',
  'Esta semana',
  'Fines de semana',
  'Remoto',
  'Según disponibilidad',
];

/** Prefilled WhatsApp message when contacting a volunteer. */
export const VOLUNTEER_CONTACT_MESSAGE =
  'Hola, te contacto desde Patitas a Salvo Venezuela. Vi que estás disponible como voluntario/a y quería coordinar apoyo.';

/** Help types worth prioritizing for a given need category (matching blocks). */
export function volunteerHelpForNeedCategory(category: string | null): string[] {
  switch (category) {
    case 'Transporte':
      return ['Transporte', 'Traslados'];
    case 'Perrarina':
    case 'Gatarina':
    case 'Medicamentos':
    case 'Insumos':
      return ['Apoyo en centros de acopio', 'Logística'];
    case 'Rescate':
      return ['Verificación de casos', 'Coordinación por WhatsApp'];
    case 'Atención veterinaria':
      return ['Apoyo veterinario'];
    case 'Refugio':
      return ['Apoyo a refugios', 'Logística'];
    default:
      return [];
  }
}

/** Help types a volunteer can offer that are useful to a refuge. */
export const VOLUNTEER_REFUGE_HELP = [
  'Apoyo a refugios',
  'Logística',
  'Coordinación por WhatsApp',
  'Transporte',
];

// ---- Centros de acopio (stored in centers, type='centro_acopio') -----------
export const CENTRO_RECEIVE_OPTIONS = [
  'Perrarina',
  'Gatarina',
  'Medicinas',
  'Insumos',
  'Cobijas',
  'Transportadoras',
  'Otros',
];

/** Client-side seed example (clearly DEMO). Always shown so the section/list never
 *  looks empty; not stored in the database. */
export const DEMO_CENTRO: CenterRow = {
  id: 'demo-patitas',
  name: 'Patitas a Salvo Venezuela',
  type: 'centro_acopio',
  city: 'Caracas',
  address: 'Punto de recepción central (DEMO)',
  whatsapp: '0412-0000000',
  needs: ['Perrarina', 'Gatarina', 'Medicinas', 'Insumos'],
  urgency: null,
  status: null,
  capacity: null,
  current_animals: null,
  payment_mobile_bank: null,
  payment_mobile_id: null,
  payment_mobile_phone: null,
  zelle_email: null,
  paypal_email: null,
  image_url: null,
  notes: 'Centro de recepción y distribución de ayuda animal.',
  contact_name: 'Equipo Patitas a Salvo (DEMO)',
  maps_url: null,
  verified: false,
  created_at: '2026-06-01T12:00:00.000Z',
};
