import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function chipClass(active: boolean) {
  return cn(
    'rounded-xl px-3.5 py-2 text-[12.5px] font-semibold transition',
    active
      ? 'border border-forest bg-forest text-white'
      : 'border border-sand-300 bg-white text-[#3A4650]',
  );
}

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active = false, className, type = 'button', ...props }: ChipProps) {
  return <button type={type} className={cn(chipClass(active), className)} {...props} />;
}
