import { Link, useParams } from 'react-router-dom';
import { usePet } from '@/features/pets/hooks/usePet';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { CallButton } from '@/components/contact/CallButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { PageHeading } from './PageHeading';
import { formatRelativeTime, normalizeVePhone } from '@/lib/utils';
import { petTitle, petEmoji, petShareText, petSightedText } from '@/features/pets/petHelpers';
import { STATUS_META } from '@/constants/design';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-1 text-[13.5px] text-ink">{value}</div>
    </div>
  );
}

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pet, isLoading, isError, refetch } = usePet(id);

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
        <PageHeading title="Detalle" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="animate-fade">
        <PageHeading title="Detalle" />
        <EmptyState
          emoji="🐾"
          title="Mascota no encontrada"
          message="Esta publicación no existe o fue retirada."
          action={
            <Link to="/mascotas">
              <Button>Ver todas las mascotas</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const title = petTitle(pet);
  const shareText = petShareText(pet);
  const sightedText = petSightedText(pet);
  const canContact = !!normalizeVePhone(pet.phone);

  return (
    <div className="animate-fade">
      <PageHeading title={title} />

      <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
        <div className="relative flex h-56 items-center justify-center bg-sand-100">
          {pet.image_url ? (
            <img src={pet.image_url} alt={title} className="h-full w-full object-cover" />
          ) : (
            <span className="text-6xl" aria-hidden>
              {petEmoji(pet)}
            </span>
          )}
          <span className="absolute left-3 top-3">
            <StatusBadge status={pet.status} />
          </span>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-[20px] font-extrabold text-forest-dark">{title}</h1>
            <span className="text-[11.5px] font-semibold text-faint">
              {formatRelativeTime(pet.created_at)}
            </span>
          </div>
          <p className="text-[12.5px] font-medium text-muted">
            {STATUS_META[pet.status].label}
            {pet.species ? ` · ${pet.species}` : ''}
          </p>

          {pet.description && (
            <Field label="Descripción y señas" value={pet.description} />
          )}
          <div className="grid grid-cols-1 gap-3">
            {pet.location && (
              <Field
                label={pet.status === 'lost' ? 'Última vez vista' : 'Dónde se encontró'}
                value={pet.location}
              />
            )}
            {pet.phone && <Field label="Contacto" value={pet.phone} />}
          </div>
        </div>
      </div>

      {/* Stronger CTA */}
      {canContact ? (
        <div className="mt-4">
          <WhatsAppButton
            phone={pet.phone}
            message={sightedText}
            label="Creo que vi esta mascota"
            className="w-full !py-4 !text-[15px]"
          />
          <p className="mt-2 text-center text-[11.5px] text-faint">
            Abre WhatsApp con la persona que publicó este reporte.
          </p>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-[#F6D9C2] bg-[#FCEFE4] px-3.5 py-3 text-center text-[12px] text-[#9A4A1A]">
          Esta publicación no incluye un número de contacto.
        </div>
      )}

      {/* Secondary contact actions */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <CallButton phone={pet.phone} className="w-full" />
        <ShareButton title="Patitas a Salvo" text={shareText} className="w-full" />
      </div>

      <div className="mt-6 text-center">
        <Link to="/mascotas" className="text-[12.5px] font-bold text-forest">
          ← Ver todas las mascotas
        </Link>
      </div>
    </div>
  );
}
