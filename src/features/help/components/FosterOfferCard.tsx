import { Link } from 'react-router-dom';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { formatRelativeTime } from '@/lib/utils';
import type { FosterRow } from '@/types/help';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-[12.5px]">
      <span className="w-[92px] shrink-0 font-bold text-[#3A4650]">{label}</span>
      <span className="min-w-0 flex-1 text-ink">{children}</span>
    </div>
  );
}

export function FosterOfferCard({ offer }: { offer: FosterRow }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
      <Link to={`/hogar-temporal/${offer.id}`} className="block p-3.5 transition active:scale-[0.99]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold leading-tight text-ink">{offer.name}</h3>
            <p className="mt-0.5 text-[12px] text-muted">{offer.city}</p>
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-faint">
            {formatRelativeTime(offer.created_at)}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 border-t border-sand-100 pt-3">
          <Row label="Acepta">
            {offer.accepts.length > 0 ? offer.accepts.join(', ') : 'Sin especificar'}
          </Row>
          <Row label="Capacidad">
            {offer.capacity ? `${offer.capacity} ${offer.capacity === '1' ? 'mascota' : 'mascotas'}` : 'Sin especificar'}
          </Row>
          <Row label="Disponibilidad">{offer.availability || 'Sin especificar'}</Row>
          {offer.notes && <Row label="Notas">{offer.notes}</Row>}
        </div>
      </Link>

      <div className="px-3.5 pb-3.5">
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
