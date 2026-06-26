import { Link, useParams } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/ui/CopyButton';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { useRefugeNeeds, useRefugio } from '@/features/help/hooks';
import { REFUGE_STATUS_BADGE, URGENCY_DB_META, refugeTypeLabel } from '@/constants/help';
import { formatRelativeTime } from '@/lib/utils';

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <div className="text-[10px] font-extrabold uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-1 text-[13.5px] text-ink">{value}</div>
    </div>
  );
}

function DonationMethod({
  title,
  lines,
  copyText,
  copyLabel,
}: {
  title: string;
  lines: string[];
  copyText: string;
  copyLabel: string;
}) {
  return (
    <div className="rounded-xl border border-sand-200 bg-white px-3.5 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-forest-dark">{title}</div>
          {lines.map((l) => (
            <div key={l} className="mt-0.5 text-[12.5px] text-ink">
              {l}
            </div>
          ))}
        </div>
        <CopyButton text={copyText} label={copyLabel} className="shrink-0" />
      </div>
    </div>
  );
}

export function RefugioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: refuge, isLoading, isError, refetch } = useRefugio(id);
  const refugeNeeds = useRefugeNeeds(refuge?.id, refuge?.name);

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
        <PageHeading title="Refugio" />
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!refuge) {
    return (
      <div className="animate-fade">
        <PageHeading title="Refugio" />
        <EmptyState
          emoji="🏠"
          title="Refugio no encontrado"
          message="Esta publicación no existe o fue retirada."
          action={
            <Link to="/refugios">
              <Button>Ver refugios</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const receives = refuge.needs.length ? refuge.needs.join(', ') : 'Sin especificar';
  const shareText = `🏠 ${refuge.name} (${refugeTypeLabel(refuge.type)}, ${refuge.city}). Contacta en Patitas a Salvo:`;
  const activeNeeds = refugeNeeds.data ?? [];
  const needHref =
    `/reportar/necesidad?refugio=${refuge.id}` +
    `&nombre=${encodeURIComponent(refuge.name)}` +
    `&ciudad=${encodeURIComponent(refuge.city)}` +
    (refuge.whatsapp ? `&wa=${encodeURIComponent(refuge.whatsapp)}` : '');

  // "Cómo donar" — only methods that have data.
  const pmLines = [
    refuge.payment_mobile_bank && `Banco: ${refuge.payment_mobile_bank}`,
    refuge.payment_mobile_id && `Cédula: ${refuge.payment_mobile_id}`,
    refuge.payment_mobile_phone && `Teléfono: ${refuge.payment_mobile_phone}`,
  ].filter(Boolean) as string[];
  const hasPagoMovil = pmLines.length > 0;
  const hasZelle = !!refuge.zelle_email;
  const hasPaypal = !!refuge.paypal_email;
  const hasDonations = hasPagoMovil || hasZelle || hasPaypal;

  return (
    <div className="animate-fade">
      <PageHeading title={refuge.name} subtitle={`${refugeTypeLabel(refuge.type)} · ${refuge.city}`} />

      {refuge.image_url && (
        <div className="mb-4 overflow-hidden rounded-2xl border border-sand-200 bg-sand-100">
          <img src={refuge.image_url} alt={refuge.name} className="h-44 w-full object-cover" />
        </div>
      )}

      {refuge.status && (
        <span
          className={`mb-4 inline-block rounded-md px-2 py-1 text-[10px] font-extrabold uppercase ${
            REFUGE_STATUS_BADGE[refuge.status] ?? 'bg-sand-100 text-[#3A4650]'
          }`}
        >
          {refuge.status}
        </span>
      )}

      <div className="space-y-3">
        <Field label="Puede recibir" value={receives} />
        {(refuge.capacity || refuge.current_animals) && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacidad" value={refuge.capacity || 'Sin especificar'} />
            <Field label="Animales actuales" value={refuge.current_animals || 'Sin especificar'} />
          </div>
        )}
        {refuge.urgency && <Field label="Urgencia" value={URGENCY_DB_META[refuge.urgency].label} />}
        {refuge.address && <Field label="Dirección" value={refuge.address} />}
        {refuge.notes && <Field label="Notas" value={refuge.notes} />}
      </div>

      {/* Cómo donar — only shown when at least one method has data */}
      {hasDonations && (
        <section className="mt-6">
          <h2 className="mb-3 text-[16px] font-extrabold text-forest-dark">Cómo donar</h2>
          <div className="space-y-2.5">
            {hasPagoMovil && (
              <DonationMethod
                title="Pago Móvil"
                lines={pmLines}
                copyText={`Pago Móvil\n${pmLines.join('\n')}`}
                copyLabel="Copiar Pago Móvil"
              />
            )}
            {hasZelle && (
              <DonationMethod
                title="Zelle"
                lines={[refuge.zelle_email as string]}
                copyText={`Zelle: ${refuge.zelle_email}`}
                copyLabel="Copiar Zelle"
              />
            )}
            {hasPaypal && (
              <DonationMethod
                title="PayPal"
                lines={[refuge.paypal_email as string]}
                copyText={`PayPal: ${refuge.paypal_email}`}
                copyLabel="Copiar PayPal"
              />
            )}
          </div>
        </section>
      )}

      {/* Necesidades activas — needs this refuge has reported */}
      <section className="mt-6">
        <h2 className="mb-3 text-[16px] font-extrabold text-forest-dark">Necesidades activas</h2>
        {refugeNeeds.isLoading ? (
          <p className="text-[13px] text-muted">Cargando…</p>
        ) : activeNeeds.length === 0 ? (
          <p className="rounded-xl border border-sand-200 bg-white px-3.5 py-3 text-[13px] text-muted">
            No hay necesidades activas
          </p>
        ) : (
          <div className="space-y-2">
            {activeNeeds.map((n) => (
              <Link
                key={n.id}
                to={`/necesidades/${n.id}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-sand-200 bg-white px-3.5 py-2.5 transition active:scale-[0.99]"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-bold text-ink">{n.need}</span>
                  <span className="text-[11.5px] text-muted">{formatRelativeTime(n.created_at)}</span>
                </span>
                {n.urgency && (
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-[10px] font-extrabold uppercase ${URGENCY_DB_META[n.urgency].badge}`}
                  >
                    {URGENCY_DB_META[n.urgency].label}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <WhatsAppButton
          phone={refuge.whatsapp}
          message={shareText}
          label="Contactar por WhatsApp"
          className="w-full !py-4 !text-[15px]"
        />
        {refuge.address && <DirectionsButton query={refuge.address || refuge.city} className="flex-1" />}
        <ShareButton title={refuge.name} text={shareText} className="flex-1" />
      </div>

      {/* Volunteer CTA -> opens WhatsApp to the refuge with a prefilled message */}
      <WhatsAppButton
        phone={refuge.whatsapp}
        message="Hola, vi su refugio en Patitas a Salvo Venezuela y quiero aplicar como voluntario. ¿Cómo puedo ayudar?"
        label="Aplicar como voluntario para este refugio"
        className="mt-2 w-full"
      />

      {/* Create a need pre-attached to this refuge (requester fields prefilled/hidden) */}
      <Link to={needHref} className="mt-2 block">
        <Button variant="secondary" fullWidth>
          ➕ Registrar necesidad para este refugio
        </Button>
      </Link>

      <p className="mt-4 text-center text-[11.5px] text-faint">Publicado {formatRelativeTime(refuge.created_at)}</p>

      <div className="mt-4 text-center">
        <Link to="/refugios" className="text-[12.5px] font-bold text-forest">
          ← Ver todos los refugios
        </Link>
      </div>
    </div>
  );
}
