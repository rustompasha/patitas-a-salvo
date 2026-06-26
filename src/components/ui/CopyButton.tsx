import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

export function CopyButton({
  text,
  label = 'Copiar datos',
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const { toast } = useToast();

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      toast('Datos copiados');
    } catch {
      toast('No se pudo copiar');
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xl border border-sand-300 bg-white px-3 py-2 text-[12px] font-bold text-forest transition hover:bg-sand-50',
        className,
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="11" height="11" rx="2" stroke="#1F4D3A" strokeWidth="1.7" />
        <path d="M5 15V5a2 2 0 012-2h8" stroke="#1F4D3A" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
      {label}
    </button>
  );
}
