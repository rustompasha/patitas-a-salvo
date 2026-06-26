import { Link, useParams } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { useFosterOffer } from '@/features/help/hooks';
import { formatRelativeTime, formatVePhoneDisplay, normalizeVePhone } from '@/lib/utils';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-1 text-[13.5px] text-ink">{value}</div>
    </div>
  );
}

export function FosterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: offer, isLoading, isError, refetch } = useFosterOffer(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7 text-forest" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="animate-fade">
        <PageHeading title="Hogar temporal" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="animate-fade">
        <PageHeading title="Hogar temporal" />
        <EmptyState
          emoji="🏠"
          title="Hogar temporal no encontrado"
          message="Esta publicación no existe o fue retirada."
          action={
            <Link to="/puedo-ser-hogar-temporal">
              <Button>Ver hogares temporales</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const phoneDisplay = formatVePhoneDisplay(offer.whatsapp);
  const canContact = !!normalizeVePhone(offer.whatsapp);
  const message = `Hola ${offer.name} 👋 Vi tu oferta de hogar temporal en Patitas a Salvo.`;

  return (
    <div className="animate-fade">
      <PageHeading title={offer.name} subtitle={offer.city} />

      <div className="space-y-3">
        <Field label="Acepta" value={offer.accepts.length > 0 ? offer.accepts.join(', ') : 'Sin especificar'} />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Capacidad"
            value={offer.capacity ? `${offer.capacity} ${offer.capacity === '1' ? 'mascota' : 'mascotas'}` : 'Sin especificar'}
          />
          <Field label="Disponibilidad" value={offer.availability || 'Sin especificar'} />
        </div>
        {offer.notes && <Field label="Notas" value={offer.notes} />}
      </div>

      {/* Phone shown so emergency users can call manually, above the WhatsApp CTA */}
      {canContact ? (
        <div className="mt-5">
          <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">WhatsApp</div>
            <a href={`tel:${normalizeVePhone(offer.whatsapp)}`} className="mt-1 block text-[16px] font-bold text-forest-dark">
              {phoneDisplay}
            </a>
          </div>
          <WhatsAppButton
            phone={offer.whatsapp}
            message={message}
            label="Contactar por WhatsApp"
            className="mt-3 w-full !py-4 !text-[15px]"
          />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-[#F6D9C2] bg-[#FCEFE4] px-3.5 py-3 text-center text-[12px] text-[#9A4A1A]">
          Esta publicación no incluye un número de contacto.
        </div>
      )}

      <p className="mt-4 text-center text-[11.5px] text-faint">
        Publicado {formatRelativeTime(offer.created_at)}
      </p>

      <div className="mt-4 text-center">
        <Link to="/puedo-ser-hogar-temporal" className="text-[12.5px] font-bold text-forest">
          ← Ver todos los hogares temporales
        </Link>
      </div>
    </div>
  );
}
