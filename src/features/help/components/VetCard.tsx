import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { formatRelativeTime } from '@/lib/utils';
import type { VetRow } from '@/types/help';

export function VetCard({ vet }: { vet: VetRow }) {
  const servicesLine = vet.services.length ? vet.services.join(', ') : 'Servicios no indicados';
  const shareText = `🏥 Veterinario disponible: ${vet.name}${
    vet.clinic_name ? ` (${vet.clinic_name})` : ''
  } en ${vet.city}. Servicios: ${servicesLine}. En Patitas a Salvo:`;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <h3 className="text-[14.5px] font-bold leading-tight text-ink">{vet.name}</h3>
          <p className="mt-0.5 text-[12px] text-muted">
            {vet.clinic_name ? `${vet.clinic_name} · ` : ''}
            {vet.city}
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-faint">
          {formatRelativeTime(vet.created_at)}
        </span>
      </div>

      {vet.services.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {vet.services.map((s) => (
            <span key={s} className="rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
              {s}
            </span>
          ))}
        </div>
      )}
      {vet.mobility && (
        <p className="mt-2 text-[12px] text-ink">
          <span className="font-semibold">Movilidad:</span> {vet.mobility}
        </p>
      )}
      {vet.address && <p className="mt-2 text-[12px] text-muted">{vet.address}</p>}
      {vet.notes && <p className="mt-1 text-[12px] leading-snug text-muted">{vet.notes}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <WhatsAppButton phone={vet.whatsapp} message={shareText} compact className="flex-1" />
        {vet.address && <DirectionsButton query={vet.address || vet.city} compact />}
        <ShareButton title={vet.name} text={shareText} compact />
      </div>
    </article>
  );
}
