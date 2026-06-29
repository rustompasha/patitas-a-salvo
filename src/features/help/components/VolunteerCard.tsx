import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { formatRelativeTime } from '@/lib/utils';
import { VOLUNTEER_CONTACT_MESSAGE } from '@/constants/help';
import type { VolunteerRow } from '@/types/help';

function Badge({ children, tone }: { children: React.ReactNode; tone: 'green' | 'blue' | 'amber' | 'violet' }) {
  const tones: Record<string, string> = {
    green: 'bg-[#EAF3EC] text-forest',
    blue: 'bg-[#E7F0FA] text-[#1F5F8B]',
    amber: 'bg-[#FBE7C6] text-[#8A5A14]',
    violet: 'bg-[#EFE7FA] text-[#5B3B8B]',
  };
  return <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

export function VolunteerCard({ volunteer: v }: { volunteer: VolunteerRow }) {
  const where = [v.city, v.state, v.area].filter(Boolean).join(' · ') || v.city;
  const shareText = `🙌 Voluntario/a disponible en ${v.city}${
    v.help_types.length ? ` — ${v.help_types.join(', ')}` : ''
  }. En Patitas a Salvo:`;

  return (
    <article className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-3.5">
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFE7FA] text-lg" aria-hidden>
            🙌
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-[14.5px] font-bold leading-tight text-ink">{v.name}</h3>
            <p className="mt-0.5 text-[12px] text-muted">{where}</p>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-faint">{formatRelativeTime(v.created_at)}</span>
      </div>

      {v.availability && (
        <p className="mt-2 text-[12px] text-ink">
          <span className="font-semibold">Disponibilidad:</span> {v.availability}
        </p>
      )}

      {v.help_types.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {v.help_types.map((h) => (
            <span key={h} className="rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
              {h}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {v.can_help_remote && <Badge tone="violet">Remoto</Badge>}
        {v.can_help_in_person && <Badge tone="blue">Presencial</Badge>}
        {v.has_transport && <Badge tone="amber">🚗 Transporte</Badge>}
        {v.has_experience && <Badge tone="green">✓ Experiencia</Badge>}
      </div>

      {v.notes && <p className="mt-2 line-clamp-2 text-[12px] leading-snug text-muted">{v.notes}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <WhatsAppButton phone={v.whatsapp} message={VOLUNTEER_CONTACT_MESSAGE} compact className="flex-1" />
        <ShareButton title={v.name} text={shareText} compact />
      </div>
    </article>
  );
}
