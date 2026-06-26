import type { CenterTypeValue, UrgencyLevel } from '@/types/help';

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
