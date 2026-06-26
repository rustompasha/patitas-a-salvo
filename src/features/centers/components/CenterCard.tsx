import { Link } from 'react-router-dom';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { CENTER_STATUS_META } from '@/constants/centers';
import type { Center } from '@/types/center';

export function CenterCard({ center }: { center: Center }) {
  const status = CENTER_STATUS_META[center.status];
  const needsLine = center.needs.map((n) => n.name).join(', ');
  const shareText = `🏥 ${center.name} (${center.location}) necesita: ${needsLine}. Ayuda en Patitas a Salvo:`;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
      <Link to={`/centros/${center.id}`} className="block p-3.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-bold leading-tight text-ink">{center.name}</h3>
            <p className="mt-0.5 text-[12px] text-muted">{center.type}</p>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-extrabold ${status.badge}`}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />
            {center.status}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[#5C6670]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M12 21s-6-5-6-10a6 6 0 1112 0c0 5-6 10-6 10z" stroke="#9AA3AD" strokeWidth="1.8" />
          </svg>
          {center.location}
        </div>

        <div className="mt-2.5 rounded-lg bg-sand-50 px-3 py-2 text-[12px] text-ink">
          <span className="font-semibold">Necesita:</span> {needsLine}
        </div>

        <div className="mt-2 text-right text-[11px] font-semibold text-faint">
          Actualizado {center.updated}
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 px-3.5 pb-3.5">
        <WhatsAppButton phone={center.whatsapp} message={shareText} compact className="flex-1" />
        <DirectionsButton query={center.address || center.location} compact />
        <ShareButton title={center.name} text={shareText} compact />
      </div>
    </article>
  );
}
