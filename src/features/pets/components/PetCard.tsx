import { Link } from 'react-router-dom';
import { StatusBadge } from '@/components/ui/Badge';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { CallButton } from '@/components/contact/CallButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { formatRelativeTime } from '@/lib/utils';
import { petTitle, petEmoji, petShareText } from '../petHelpers';
import type { Pet } from '@/types/pet';

export function PetCard({ pet }: { pet: Pet }) {
  const title = petTitle(pet);
  const shareText = petShareText(pet);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white">
      {/* Clickable region -> detail page. Contact buttons stay outside this Link. */}
      <Link to={`/mascotas/${pet.id}`} className="flex flex-1 flex-col">
        <div className="relative flex h-32 items-center justify-center bg-sand-100">
          {pet.image_url ? (
            <img
              src={pet.image_url}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-5xl" aria-hidden>
              {petEmoji(pet)}
            </span>
          )}
          <span className="absolute left-2 top-2">
            <StatusBadge status={pet.status} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3 pb-0">
          <h3 className="text-[14px] font-bold leading-tight text-ink">{title}</h3>
          {pet.species && <p className="mt-0.5 text-[11.5px] font-medium text-muted">{pet.species}</p>}
          {pet.description && (
            <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">{pet.description}</p>
          )}

          <div className="mt-2 flex items-center gap-1 text-[11px] text-[#5C6670]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M12 21s-6-5-6-10a6 6 0 1112 0c0 5-6 10-6 10z" stroke="#9AA3AD" strokeWidth="1.8" />
            </svg>
            <span className="truncate">
              {pet.location || 'Ubicación no indicada'} · {formatRelativeTime(pet.created_at)}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-wrap gap-2 p-3">
        <WhatsAppButton phone={pet.phone} message={shareText} compact className="flex-1" />
        <CallButton phone={pet.phone} compact />
        <ShareButton title="Patitas a Salvo" text={shareText} compact />
      </div>
    </article>
  );
}
