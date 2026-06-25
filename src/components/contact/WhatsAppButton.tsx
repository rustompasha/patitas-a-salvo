import { normalizeVePhone } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function WhatsAppButton({
  phone,
  message,
  className,
  compact,
}: {
  phone: string | null;
  message?: string;
  className?: string;
  compact?: boolean;
}) {
  const normalized = normalizeVePhone(phone);
  if (!normalized) return null;

  const href = `https://wa.me/${normalized}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl bg-whatsapp font-bold text-white transition hover:brightness-105',
        compact ? 'px-3 py-2 text-[12px]' : 'px-4 py-3 text-[13px]',
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2z" />
      </svg>
      WhatsApp
    </a>
  );
}
