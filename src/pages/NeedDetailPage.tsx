import { Link, useParams } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { MatchSection } from '@/features/rescue/components/MatchSection';
import { ShelterMatchList } from '@/features/rescue/components/ShelterMatchList';
import { useNeed } from '@/features/help/hooks';
import { URGENCY_DB_META, needContactMessage, requesterMeta } from '@/constants/help';
import { formatRelativeTime, formatVePhoneDisplay, normalizeVePhone } from '@/lib/utils';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-1 text-[13.5px] text-ink">{value}</div>
    </div>
  );
}

export function NeedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: need, isLoading, isError, refetch } = useNeed(id);

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
        <PageHeading title="Necesidad" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!need) {
    return (
      <div className="animate-fade">
        <PageHeading title="Necesidad" />
        <EmptyState
          emoji="📋"
          title="Necesidad no encontrada"
          message="Esta publicación no existe o fue retirada."
          action={
            <Link to="/necesidades">
              <Button>Ver necesidades</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const meta = requesterMeta(need.requester_type);
  const isOrg = need.requester_type === 'refugio' || need.requester_type === 'veterinaria';
  const where = need.reference ? `${need.reference}, ${need.city}` : need.city;
  const contactMsg = needContactMessage(need.requester_type);
  const phoneDisplay = formatVePhoneDisplay(need.whatsapp);
  const canContact = !!normalizeVePhone(need.whatsapp);
  const shareText = `${meta.emoji} ${meta.label}${
    isOrg && need.requester_name ? ` — ${need.requester_name}` : ''
  } en ${where}: ${need.need}${need.quantity ? ` (${need.quantity})` : ''}. Ayuda en Patitas a Salvo:`;

  return (
    <div className="animate-fade">
      <PageHeading title={need.need} subtitle={where} />

      <span
        className={`mb-4 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-extrabold uppercase tracking-wide ${meta.badge}`}
      >
        <span aria-hidden>{meta.emoji}</span> {meta.label}
      </span>

      <div className="space-y-3">
        {isOrg && need.requester_name && <Field label="Solicitante" value={need.requester_name} />}
        {need.category && <Field label="Tipo de ayuda" value={need.category} />}
        {need.quantity && <Field label="Cantidad" value={need.quantity} />}
        {need.urgency && <Field label="Urgencia" value={URGENCY_DB_META[need.urgency].label} />}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ciudad" value={need.city} />
          {need.reference && <Field label="Referencia" value={need.reference} />}
        </div>
        {need.notes && <Field label="Notas" value={need.notes} />}
      </div>

      {/* Contact info shown plainly, above the WhatsApp CTA */}
      {canContact ? (
        <div className="mt-5">
          <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">WhatsApp</div>
            <a href={`tel:${normalizeVePhone(need.whatsapp)}`} className="mt-1 block text-[16px] font-bold text-forest-dark">
              {phoneDisplay}
            </a>
          </div>
          <WhatsAppButton
            phone={need.whatsapp}
            message={contactMsg}
            label="Contactar por WhatsApp"
            className="mt-3 w-full !py-4 !text-[15px]"
          />
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-[#F6D9C2] bg-[#FCEFE4] px-3.5 py-3 text-center text-[12px] text-[#9A4A1A]">
          Esta publicación no incluye un número de contacto.
        </div>
      )}

      <div className="mt-3">
        <ShareButton title="Patitas a Salvo" text={shareText} className="w-full" />
      </div>

      {/* Matching: shelters/homes near this need that may be able to help */}
      <MatchSection
        title="Refugios que pueden ayudar"
        subtitle={`Cerca de ${need.city}`}
        seeAllTo="/refugios"
      >
        <ShelterMatchList city={need.city} />
      </MatchSection>

      <p className="mt-6 text-center text-[11.5px] text-faint">Publicado {formatRelativeTime(need.created_at)}</p>

      <div className="mt-4 text-center">
        <Link to="/necesidades" className="text-[12.5px] font-bold text-forest">
          ← Ver todas las necesidades
        </Link>
      </div>
    </div>
  );
}
