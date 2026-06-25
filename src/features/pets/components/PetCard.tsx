import { StatusBadge } from '@/components/ui/Badge';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { CallButton } from '@/components/contact/CallButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { formatRelativeTime } from '@/lib/utils';
import type { Pet } from '@/types/pet';

const SPECIES_EMOJI: Record<string, string> = { Perro: '🐕', Gato: '🐈' };

export function PetCard({ pet }: { pet: Pet }) {
  const title = pet.name?.trim() || (pet.status === 'lost' ? 'Mascota perdida' : 'Mascota encontrada');
  const emoji = (pet.species && SPECIES_EMOJI[pet.species]) || '🐾';

  const shareText =
    pet.status === 'lost'
      ? `🐾 Mascota perdida: ${title}${pet.location ? ` en ${pet.location}` : ''}. ¿La has visto?`
      : `🐾 Mascota encontrada${pet.location ? ` en ${pet.location}` : ''}: ${title}. ¿Es tuya o de alguien que conoces?`;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white">
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
            {emoji}
          </span>
        )}
        <span className="absolute left-2 top-2">
          <StatusBadge status={pet.status} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3">
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

        <div className="mt-3 flex flex-wrap gap-2">
          <WhatsAppButton phone={pet.phone} message={shareText} compact className="flex-1" />
          <CallButton phone={pet.phone} compact />
          <ShareButton title="Patitas a Salvo" text={shareText} compact />
        </div>
      </div>
    </article>
  );
}
