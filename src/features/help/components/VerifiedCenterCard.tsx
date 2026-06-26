import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { centerTypeLabel, URGENCY_DB_META } from '@/constants/help';
import type { CenterRow } from '@/types/help';

export function VerifiedCenterCard({ center }: { center: CenterRow }) {
  const needsLine = center.needs.length ? center.needs.join(', ') : 'Sin necesidades indicadas';
  const shareText = `🏥 ${center.name} (${center.city}) necesita: ${needsLine}. Ayuda en Patitas a Salvo:`;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-bold leading-tight text-ink">{center.name}</h3>
          <p className="mt-0.5 text-[12px] text-muted">
            {centerTypeLabel(center.type)} · {center.city}
          </p>
        </div>
        {center.urgency && (
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-extrabold uppercase ${URGENCY_DB_META[center.urgency].badge}`}
          >
            {URGENCY_DB_META[center.urgency].label}
          </span>
        )}
      </div>

      {center.needs.length > 0 && (
        <div className="mt-2.5 rounded-lg bg-sand-50 px-3 py-2 text-[12px] text-ink">
          <span className="font-semibold">Necesita:</span> {needsLine}
        </div>
      )}
      {center.address && <p className="mt-2 text-[12px] text-muted">{center.address}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {center.whatsapp && (
          <WhatsAppButton phone={center.whatsapp} message={shareText} compact className="flex-1" />
        )}
        <DirectionsButton query={center.address || center.city} compact />
        <ShareButton title={center.name} text={shareText} compact />
      </div>
    </article>
  );
}
