import type { Center, CenterStatus, UrgentNeed, Urgency } from '@/types/center';

// ---- Visual meta (reused once real, user-generated data exists) ------------
export const URGENCY_META: Record<Urgency, { badge: string; bar: string }> = {
  Crítico: { badge: 'bg-[#FBE3E1] text-[#C81E1E]', bar: '#D62828' },
  Alto: { badge: 'bg-[#FCE7D6] text-[#C2410C]', bar: '#FF6B2C' },
  Medio: { badge: 'bg-[#FAEAD0] text-[#9C6B12]', bar: '#F4A261' },
};

export const CENTER_STATUS_META: Record<CenterStatus, { badge: string; dot: string }> = {
  Activo: { badge: 'bg-[#DCF0EC] text-[#1F7A6D]', dot: '#2A9D8F' },
  'Recibiendo emergencias': { badge: 'bg-[#FBE3E1] text-[#C81E1E]', dot: '#D62828' },
  Saturado: { badge: 'bg-[#FCE7D6] text-[#C2410C]', dot: '#FF6B2C' },
};

// NO demo/seed data. Centers and urgent needs stay empty until they come from
// real, user-generated submissions (a future Supabase-backed iteration).
// Only pets (Supabase) are real data in the app today.
export const URGENT_NEEDS: UrgentNeed[] = [];

export const CENTERS: Center[] = [];

export function getCenterById(id: string | undefined): Center | undefined {
  return CENTERS.find((c) => c.id === id);
}
