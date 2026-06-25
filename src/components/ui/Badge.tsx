import { STATUS_META } from '@/constants/design';
import type { PetStatus } from '@/types/pet';
import { cn } from '@/lib/utils';

export function StatusBadge({ status, className }: { status: PetStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide',
        meta.badgeClass,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
