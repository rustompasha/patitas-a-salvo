import { Link } from 'react-router-dom';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { REFUGE_STATUS_BADGE, refugeTypeLabel } from '@/constants/help';
import { formatRelativeTime } from '@/lib/utils';
import type { CenterRow } from '@/types/help';

export function RefugeCard({ refuge }: { refuge: CenterRow }) {
  const receives = refuge.needs.length ? refuge.needs.join(', ') : 'Sin especificar';
  const shareText = `🏠 ${refuge.name} (${refugeTypeLabel(refuge.type)}, ${refuge.city}) puede recibir: ${receives}. Contacta en Patitas a Salvo:`;
  const capacityLine = [
    refuge.current_animals && `${refuge.current_animals} animales`,
    refuge.capacity && `cap. ${refuge.capacity}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const hasDonations =
    !!refuge.payment_mobile_bank ||
    !!refuge.payment_mobile_id ||
    !!refuge.payment_mobile_phone ||
    !!refuge.zelle_email ||
    !!refuge.paypal_email;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
      <Link to={`/refugios/${refuge.id}`} className="block p-3.5 transition active:scale-[0.99]">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-start gap-2.5">
            {refuge.image_url ? (
              <img
                src={refuge.image_url}
                alt={refuge.name}
                loading="lazy"
                decoding="async"
                className="h-11 w-11 shrink-0 rounded-xl border border-sand-200 object-cover"
              />
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand-100 text-lg" aria-hidden>
                🏠
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-[14.5px] font-bold leading-tight text-ink">{refuge.name}</h3>
              <p className="mt-0.5 text-[12px] text-muted">
                {refugeTypeLabel(refuge.type)} · {refuge.city}
              </p>
            </div>
          </div>
          {refuge.status ? (
            <span
              className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-extrabold uppercase ${
                REFUGE_STATUS_BADGE[refuge.status] ?? 'bg-sand-100 text-[#3A4650]'
              }`}
            >
              {refuge.status}
            </span>
          ) : (
            <span className="shrink-0 text-[11px] font-semibold text-faint">
              {formatRelativeTime(refuge.created_at)}
            </span>
          )}
        </div>

        {capacityLine && <p className="mt-2 text-[12px] text-ink">{capacityLine}</p>}

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

        {hasDonations && (
          <p className="mt-2 inline-block rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
            💜 Recibe donaciones
          </p>
        )}
      </Link>

      <div className="flex flex-wrap gap-2 px-3.5 pb-3.5">
        <WhatsAppButton phone={refuge.whatsapp} message={shareText} compact className="flex-1" />
        {refuge.address && <DirectionsButton query={refuge.address || refuge.city} compact />}
        <ShareButton title={refuge.name} text={shareText} compact />
      </div>
    </article>
  );
}
