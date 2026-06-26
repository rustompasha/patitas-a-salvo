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

export const URGENCY_DB_META: Record<UrgencyLevel, { label: string; badge: string }> = {
  bajo: { label: 'Bajo', badge: 'bg-[#FAEAD0] text-[#9C6B12]' },
  medio: { label: 'Medio', badge: 'bg-[#FAEAD0] text-[#9C6B12]' },
  alto: { label: 'Alto', badge: 'bg-[#FCE7D6] text-[#C2410C]' },
  critico: { label: 'Crítico', badge: 'bg-[#FBE3E1] text-[#C81E1E]' },
};

export function centerTypeLabel(value: CenterTypeValue): string {
  return CENTER_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}
