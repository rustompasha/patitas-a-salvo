import { cn } from '@/lib/utils';

export function CallButton({
  phone,
  className,
  compact,
}: {
  phone: string | null;
  className?: string;
  compact?: boolean;
}) {
  if (!phone) return null;
  const href = `tel:${phone.replace(/\s+/g, '')}`;

  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      aria-label="Llamar"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl border border-sand-300 bg-white font-bold text-forest transition hover:bg-sand-50',
        compact ? 'px-3 py-2 text-[12px]' : 'px-4 py-3 text-[13px]',
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 014.5 6a2 2 0 012-2z"
          stroke="#1F4D3A"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      Llamar
    </a>
  );
}
