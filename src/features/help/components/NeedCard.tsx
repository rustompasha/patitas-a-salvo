import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { URGENCY_DB_META, needContactMessage, requesterMeta } from '@/constants/help';
import { formatRelativeTime } from '@/lib/utils';
import type { NeedRow } from '@/types/help';

export function NeedCard({ need }: { need: NeedRow }) {
  const where = need.reference ? `${need.reference}, ${need.city}` : need.city;
  const meta = requesterMeta(need.requester_type);
  const isOrg = need.requester_type === 'refugio' || need.requester_type === 'veterinaria';
  const orgName = isOrg ? need.requester_name : null;
  const contactMsg = needContactMessage(need.requester_type);
  const shareText = `${meta.emoji} ${meta.label}${orgName ? ` — ${orgName}` : ''} en ${where}: ${need.need}${
    need.quantity ? ` (${need.quantity})` : ''
  }. Ayuda en Patitas a Salvo:`;

  return (
    <article className="rounded-2xl border border-sand-200 bg-white p-3.5">
      <span
        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wide ${meta.badge}`}
      >
        <span aria-hidden>{meta.emoji}</span> {meta.label}
      </span>

      <div className="mt-2 flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-bold leading-tight text-ink">{orgName ?? need.need}</h3>
          {orgName && (
            <p className="mt-0.5 text-[13px] text-ink">
              <span className="font-semibold">Necesita:</span> {need.need}
            </p>
          )}
          <p className="mt-0.5 text-[12px] text-muted">
            {where} · {formatRelativeTime(need.created_at)}
          </p>
        </div>
        {need.urgency && (
          <span
            className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-extrabold uppercase ${URGENCY_DB_META[need.urgency].badge}`}
          >
            {URGENCY_DB_META[need.urgency].label}
          </span>
        )}
      </div>

      {need.category && (
        <span className="mt-2 inline-block rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
          {need.category}
        </span>
      )}
      {need.quantity && (
        <p className="mt-2 text-[12px] text-ink">
          <span className="font-semibold">Cantidad:</span> {need.quantity}
        </p>
      )}
      {need.notes && <p className="mt-1 text-[12px] leading-snug text-muted">{need.notes}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {need.whatsapp && (
          <WhatsAppButton
            phone={need.whatsapp}
            message={contactMsg}
            label="Contactar por WhatsApp"
            compact
            className="flex-1"
          />
        )}
        <ShareButton title="Patitas a Salvo" text={shareText} compact />
      </div>
    </article>
  );
}
