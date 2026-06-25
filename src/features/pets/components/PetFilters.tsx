import { FILTER_OPTIONS } from '@/constants/design';
import { cn } from '@/lib/utils';
import type { StatusFilter } from '@/types/pet';

interface PetFiltersProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function PetFilters({ value, onChange }: PetFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar mascotas"
      className="flex gap-1 rounded-xl border border-sand-300 bg-white p-1"
    >
      {FILTER_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 rounded-lg px-3 py-2 text-[12.5px] font-bold transition',
              active ? 'bg-forest text-white' : 'text-[#5C6670] hover:bg-sand-50',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
