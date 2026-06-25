import type { PetStatus, StatusFilter } from '@/types/pet';

export const SPECIES_OPTIONS = [
  { value: 'Perro', label: 'Perro' },
  { value: 'Gato', label: 'Gato' },
  { value: 'Otro', label: 'Otro' },
];

export const STATUS_META: Record<PetStatus, { label: string; badgeClass: string }> = {
  lost: {
    label: 'Perdida',
    badgeClass: 'bg-[#FBE3E1] text-[#C81E1E]',
  },
  found: {
    label: 'Encontrada',
    badgeClass: 'bg-[#DCF0EC] text-[#1F7A6D]',
  },
};

export const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'lost', label: 'Perdidas' },
  { value: 'found', label: 'Encontradas' },
];
