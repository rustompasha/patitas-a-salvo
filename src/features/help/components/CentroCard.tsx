import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { formatRelativeTime } from '@/lib/utils';
import type { CenterRow } from '@/types/help';

/**
 * Centro de acopio card — amber/orange identity + 📦 so it reads distinctly from
 * refugios (green), hogares temporales and veterinarios. Self-contained (no detail
 * page in Phase 1): contact happens right here via WhatsApp / Cómo llegar / Compartir.
 */
export function CentroCard({ centro, demo }: { centro: CenterRow; demo?: boolean }) {
  const receives = centro.needs.length ? centro.needs.join(', ') : 'Sin especificar';
  const shareText = `📦 Centro de acopio ${centro.name} (${centro.city}) recibe: ${receives}. En Patitas a Salvo:`;
  const directionsQuery = centro.address ? `${centro.address}, ${centro.city}` : centro.city;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#F2D7A8] bg-[#FFF9EF]">
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-start gap-2.5">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FBE7C6] text-lg"
              aria-hidden
            >
              📦
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-[14.5px] font-bold leading-tight text-[#7A4E12]">
                  {centro.name}
                </h3>
                {demo && (
                  <span className="shrink-0 rounded bg-[#F0C975] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#5C3B07]">
                    Demo
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[12px] font-semibold text-[#B07A2B]">
                Centro de acopio · {centro.city}
              </p>
            </div>
          </div>
          {!demo && (
            <span className="shrink-0 text-[11px] font-semibold text-[#C29A5B]">
              {formatRelativeTime(centro.created_at)}
            </span>
          )}
        </div>

        {centro.contact_name && (
          <p className="mt-2 text-[12px] text-[#6B5B3E]">
            <span className="font-semibold">Responsable:</span> {centro.contact_name}
          </p>
        )}
        {centro.notes && <p className="mt-1.5 text-[12.5px] leading-snug text-[#5C5340]">{centro.notes}</p>}

        {centro.needs.length > 0 && (
          <div className="mt-2.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-[#B07A2B]">Recibe</div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {centro.needs.map((n) => (
                <span
                  key={n}
                  className="rounded-md bg-[#FBE7C6] px-2 py-1 text-[11px] font-semibold text-[#8A5A14]"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
        {centro.address && <p className="mt-2 text-[12px] text-[#8A7B5E]">{centro.address}</p>}
      </div>

      <div className="flex flex-wrap gap-2 px-3.5 pb-3.5">
        <WhatsAppButton phone={centro.whatsapp} message={shareText} compact className="flex-1" />
        <DirectionsButton query={directionsQuery} href={centro.maps_url} compact />
        <ShareButton title={centro.name} text={shareText} compact />
      </div>
    </article>
  );
}
