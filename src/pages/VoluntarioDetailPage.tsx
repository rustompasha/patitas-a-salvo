import { Link, useParams } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { VolunteerAvatar } from '@/features/help/components/VolunteerAvatar';
import { useVolunteer } from '@/features/help/hooks';
import { MODALITY_LABEL, VOLUNTEER_CONTACT_MESSAGE, resolveModality } from '@/constants/help';
import { formatRelativeTime } from '@/lib/utils';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-1 text-[13.5px] text-ink">{value}</div>
    </div>
  );
}

export function VoluntarioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: v, isLoading, isError, refetch } = useVolunteer(id);

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
        <PageHeading title="Voluntario" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!v) {
    return (
      <div className="animate-fade">
        <PageHeading title="Voluntario" />
        <EmptyState
          emoji="🙌"
          title="Voluntario no encontrado"
          message="Este perfil no existe o no está activo."
          action={
            <Link to="/voluntarios">
              <Button>Ver voluntarios</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const modality = MODALITY_LABEL[resolveModality(v)];
  const where = [v.city, v.state, v.country].filter(Boolean).join(', ') || v.city;
  const shareText = `🙌 ${v.name}, voluntario/a de Patitas a Salvo en ${where}. Conoce nuestra red de apoyo:`;

  return (
    <div className="animate-fade">
      <PageHeading title="Perfil de voluntario" />

      <div className="flex flex-col items-center rounded-2xl border border-sand-200 bg-white px-5 py-6 text-center">
        <VolunteerAvatar name={v.name} photoUrl={v.photo_url} className="h-24 w-24" textClassName="text-[28px]" />
        <h1 className="mt-3 text-[20px] font-extrabold text-forest-dark">{v.name}</h1>
        <p className="mt-1 text-[13px] text-muted">{where}</p>
        <span className="mt-2 inline-block rounded-md bg-[#EFE7FA] px-2.5 py-1 text-[11.5px] font-bold text-[#5B3B8B]">
          {modality}
        </span>
        <p className="mt-2 text-[11px] font-semibold text-faint">
          En la red desde {formatRelativeTime(v.created_at)}
        </p>
      </div>

      {v.help_types.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-faint">Cómo ayuda</h2>
          <div className="flex flex-wrap gap-1.5">
            {v.help_types.map((h) => (
              <span key={h} className="rounded-md bg-[#EAF3EC] px-2.5 py-1 text-[12px] font-semibold text-forest">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Field label="Modalidad" value={modality} />
        <Field label="Disponibilidad" value={v.availability || 'No especificada'} />
        <Field label="Transporte" value={v.has_transport ? 'Sí' : 'No'} />
        <Field label="Experiencia" value={v.has_experience ? 'Sí' : 'No'} />
      </div>

      {v.notes && (
        <div className="mt-4 rounded-xl border border-sand-200 bg-white px-3.5 py-3">
          <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">Notas</div>
          <p className="mt-1 whitespace-pre-line text-[13.5px] leading-relaxed text-ink">{v.notes}</p>
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <WhatsAppButton phone={v.whatsapp} message={VOLUNTEER_CONTACT_MESSAGE} className="flex-1" />
        <ShareButton title={v.name} text={shareText} compact />
      </div>

      <p className="mt-4 rounded-xl bg-sand-50 px-3.5 py-3 text-[11.5px] leading-relaxed text-muted">
        🔒 Coordina siempre por canales seguros y confirma la identidad antes de compartir datos
        sensibles o direcciones. Esta persona se registró de forma voluntaria; Patitas a Salvo no
        garantiza ni supervisa acuerdos individuales.
      </p>
    </div>
  );
}
