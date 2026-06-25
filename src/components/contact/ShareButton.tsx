import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export function ShareButton({
  title,
  text,
  url,
  className,
  compact,
}: {
  title: string;
  text: string;
  url?: string;
  className?: string;
  compact?: boolean;
}) {
  const { toast } = useToast();
  const shareUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '');

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const data = { title, text, url: shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(`${text} ${shareUrl}`.trim());
      toast('Enlace copiado');
    } catch (err) {
      // User cancelled the native share sheet — ignore. Other errors fall back to clipboard.
      if (err instanceof Error && err.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(`${text} ${shareUrl}`.trim());
        toast('Enlace copiado');
      } catch {
        toast('No se pudo compartir');
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Compartir"
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl border border-sand-300 bg-white font-bold text-forest transition hover:bg-sand-50',
        compact ? 'px-3 py-2 text-[12px]' : 'px-4 py-3 text-[13px]',
        className,
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 8a3 3 0 10-2.8-4M6 12a3 3 0 100 .1M18 16a3 3 0 10-2.8 4M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"
          stroke="#1F4D3A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      Compartir
    </button>
  );
}
