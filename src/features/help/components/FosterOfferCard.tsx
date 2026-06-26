import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import type { FosterRow } from '@/types/help';

export function FosterOfferCard({ offer }: { offer: FosterRow }) {
  const meta = [offer.capacity && `Cap. ${offer.capacity}`, offer.availability].filter(Boolean).join(' · ');

  return (
    <article className="rounded-2xl border border-sand-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[14px] font-bold text-ink">{offer.name}</h3>
          <p className="mt-0.5 text-[12px] text-muted">{offer.city}</p>
        </div>
        {meta && (
          <span className="shrink-0 rounded-md bg-sand-100 px-2 py-1 text-[10.5px] font-bold text-[#3A4650]">
            {meta}
          </span>
        )}
      </div>

      {offer.accepts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {offer.accepts.map((a) => (
            <span key={a} className="rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
              {a}
            </span>
          ))}
        </div>
      )}
      {offer.notes && <p className="mt-2 text-[12px] leading-snug text-muted">{offer.notes}</p>}

      <div className="mt-3">
        <WhatsAppButton
          phone={offer.whatsapp}
          message={`Hola ${offer.name} 👋 Vi tu oferta de hogar temporal en Patitas a Salvo.`}
          compact
          className="w-full"
        />
      </div>
    </article>
  );
}
