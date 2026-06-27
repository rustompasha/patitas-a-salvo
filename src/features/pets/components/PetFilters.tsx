import { FILTER_OPTIONS } from '@/constants/design';
import { cn } from '@/lib/utils';
import type { StatusFilter } from '@/types/pet';

interface PetFiltersProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
  /** Exact category sizes, shown as a badge on each tab when available. */
  counts?: { all: number; lost: number; found: number };
}

export function PetFilters({ value, onChange, counts }: PetFiltersProps) {
  return (
    <div
      role="tablist"
      aria-label="Filtrar mascotas"
      className="flex gap-1 rounded-xl border border-sand-300 bg-white p-1"
    >
      {FILTER_OPTIONS.map((opt) => {
        const active = value === opt.value;
        const count = counts?.[opt.value];
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12.5px] font-bold transition',
              active ? 'bg-forest text-white' : 'text-[#5C6670] hover:bg-sand-50',
            )}
          >
            {opt.label}
            {count !== undefined && (
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10.5px] font-extrabold tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-sand-100 text-[#5C6670]',
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
