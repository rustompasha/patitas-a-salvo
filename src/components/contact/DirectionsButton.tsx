import { cn } from '@/lib/utils';

export function DirectionsButton({
  query,
  className,
  compact,
}: {
  query: string;
  className?: string;
  compact?: boolean;
}) {
  if (!query) return null;
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label="Cómo llegar"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl border border-sand-300 bg-white font-bold text-forest transition hover:bg-sand-50',
        compact ? 'px-3 py-2 text-[12px]' : 'px-4 py-3 text-[13px]',
        className,
      )}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M12 21s-6-5-6-10a6 6 0 1112 0c0 5-6 10-6 10z" stroke="#1F4D3A" strokeWidth="1.8" />
        <circle cx="12" cy="11" r="2.2" stroke="#1F4D3A" strokeWidth="1.8" />
      </svg>
      Cómo llegar
    </a>
  );
}
