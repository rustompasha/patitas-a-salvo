import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { formatRelativeTime } from '@/lib/utils';
import { BRIGADE_CONTACT_MESSAGE, brigadeCapabilities } from '@/constants/brigade';
import type { BrigadeRow } from '@/types/brigade';

export function BrigadeMemberCard({ member: m }: { member: BrigadeRow }) {
  const where = [m.municipality, m.sector].filter(Boolean).join(' · ') || m.municipality || 'Caracas';
  const caps = brigadeCapabilities(m);
  const shareText = `🦺 Brigadista de respuesta animal en ${m.municipality ?? 'Caracas'}. Equipo de campo coordinado de Patitas a Salvo:`;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-2.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FDECE4] text-lg"
            aria-hidden
          >
            🦺
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[14.5px] font-bold leading-tight text-ink">{m.full_name}</h3>
            <p className="mt-0.5 text-[12px] text-muted">{where}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {m.status === 'active' ? (
            <span className="rounded-md bg-[#DCF0EC] px-2 py-1 text-[10.5px] font-bold text-[#1F7A6D]">
              ● Activo
            </span>
          ) : (
            <span className="rounded-md bg-[#EAF3EC] px-2 py-1 text-[10.5px] font-bold text-forest">
              Aprobado
            </span>
          )}
          <span className="text-[11px] font-semibold text-faint">{formatRelativeTime(m.created_at)}</span>
        </div>
      </div>

      {(m.experience_level || m.availability) && (
        <p className="mt-2 text-[12px] text-ink">
          {m.experience_level && (
            <>
              <span className="font-semibold">Experiencia:</span> {m.experience_level}
            </>
          )}
          {m.experience_level && m.availability && ' · '}
          {m.availability && (
            <>
              <span className="font-semibold">Disponibilidad:</span> {m.availability}
            </>
          )}
        </p>
      )}

      {caps.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {caps.map((c) => (
            <span
              key={c}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                c === 'Puede ir a La Guaira'
                  ? 'bg-[#FCE7D6] text-[#C2410C]'
                  : 'bg-[#EAF3EC] text-forest'
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <WhatsAppButton phone={m.whatsapp} message={BRIGADE_CONTACT_MESSAGE} compact className="flex-1" />
        <ShareButton title={m.full_name} text={shareText} compact />
      </div>
    </article>
  );
}
