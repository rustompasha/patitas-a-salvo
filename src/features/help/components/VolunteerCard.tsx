import { Link } from 'react-router-dom';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { formatRelativeTime } from '@/lib/utils';
import { MODALITY_LABEL, VOLUNTEER_CONTACT_MESSAGE, resolveModality } from '@/constants/help';
import type { VolunteerRow } from '@/types/help';
import { VolunteerAvatar } from './VolunteerAvatar';

const MODALITY_BADGE: Record<string, string> = {
  Remoto: 'bg-[#EFE7FA] text-[#5B3B8B]',
  Presencial: 'bg-[#E7F0FA] text-[#1F5F8B]',
  'Presencial + Remoto': 'bg-[#EAF3EC] text-forest',
};

export function VolunteerCard({ volunteer: v }: { volunteer: VolunteerRow }) {
  const where = [v.city, v.state, v.country].filter(Boolean).join(' · ') || v.city;
  const modality = MODALITY_LABEL[resolveModality(v)];

  return (
    <Link
      to={`/voluntarios/${v.id}`}
      className="block overflow-hidden rounded-2xl border border-sand-200 bg-white p-3.5 transition hover:border-forest/40 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex min-w-0 items-start gap-2.5">
          <VolunteerAvatar name={v.name} photoUrl={v.photo_url} className="h-12 w-12" />
          <div className="min-w-0">
            <h3 className="truncate text-[14.5px] font-bold leading-tight text-ink">{v.name}</h3>
            <p className="mt-0.5 truncate text-[12px] text-muted">{where}</p>
            <span
              className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10.5px] font-bold ${
                MODALITY_BADGE[modality] ?? 'bg-sand-100 text-[#3A4650]'
              }`}
            >
              {modality}
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[11px] font-semibold text-faint">
          {formatRelativeTime(v.created_at)}
        </span>
      </div>

      {v.availability && (
        <p className="mt-2 text-[12px] text-ink">
          <span className="font-semibold">Disponibilidad:</span> {v.availability}
        </p>
      )}

      {v.help_types.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {v.help_types.slice(0, 4).map((h) => (
            <span key={h} className="rounded-md bg-[#EAF3EC] px-2 py-1 text-[11px] font-semibold text-forest">
              {h}
            </span>
          ))}
          {v.help_types.length > 4 && (
            <span className="rounded-md bg-sand-100 px-2 py-1 text-[11px] font-semibold text-muted">
              +{v.help_types.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <WhatsAppButton phone={v.whatsapp} message={VOLUNTEER_CONTACT_MESSAGE} compact className="flex-1" />
        <span className="inline-flex items-center gap-1 rounded-xl border border-sand-300 px-3 py-2 text-[12px] font-bold text-forest">
          Ver perfil
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="#1F4D3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
