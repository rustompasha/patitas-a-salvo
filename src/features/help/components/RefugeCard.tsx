import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { refugeTypeLabel } from '@/constants/help';
import { formatRelativeTime } from '@/lib/utils';
import type { CenterRow } from '@/types/help';

export function RefugeCard({ refuge }: { refuge: CenterRow }) {
  const receives = refuge.needs.length ? refuge.needs.join(', ') : 'Sin especificar';
  const shareText = `🏠 ${refuge.name} (${refugeTypeLabel(refuge.type)}, ${refuge.city}) puede recibir: ${receives}. Contacta en Patitas a Salvo:`;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-bold leading-tight text-ink">{refuge.name}</h3>
          <p className="mt-0.5 text-[12px] text-muted">
            {refugeTypeLabel(refuge.type)} · {refuge.city}
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-faint">
          {formatRelativeTime(refuge.created_at)}
        </span>
      </div>

      {refuge.needs.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {refuge.needs.map((n) => (
            <span key={n} className="rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
              {n}
            </span>
          ))}
        </div>
      )}
      {refuge.address && <p className="mt-2 text-[12px] text-muted">{refuge.address}</p>}
      {refuge.notes && <p className="mt-1 text-[12px] leading-snug text-muted">{refuge.notes}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <WhatsAppButton phone={refuge.whatsapp} message={shareText} compact className="flex-1" />
        {refuge.address && <DirectionsButton query={refuge.address || refuge.city} compact />}
        <ShareButton title={refuge.name} text={shareText} compact />
      </div>
    </article>
  );
}
