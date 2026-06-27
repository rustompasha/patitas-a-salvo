import { cn } from '@/lib/utils';

/** Large Sí/No-style decision button used inside guided rescue flows. */
export function ChoiceButton({
  label,
  description,
  selected,
  onClick,
  tone = 'forest',
}: {
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  tone?: 'forest' | 'ember';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border p-4 text-left transition active:scale-[0.99]',
        selected
          ? tone === 'ember'
            ? 'border-ember bg-[#FFF6F1]'
            : 'border-forest bg-[#F1F8F3]'
          : 'border-sand-200 bg-white hover:border-forest/40',
      )}
    >
      <span className="block text-[15.5px] font-extrabold leading-tight text-ink">{label}</span>
      {description && <span className="mt-1 block text-[12.5px] leading-snug text-muted">{description}</span>}
    </button>
  );
}
