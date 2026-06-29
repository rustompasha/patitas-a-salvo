import { MatchSection } from './MatchSection';
import { VolunteerCard } from '@/features/help/components/VolunteerCard';
import { useVolunteers } from '@/features/help/hooks';
import { rankVolunteers } from '../matching';

/**
 * Compact "volunteers who can help here" block. Self-contained: renders its own
 * MatchSection and returns null when there are no volunteers, so pages stay clean.
 * Ranks by proximity (city/state) then by `preferredHelpTypes` relevance.
 */
export function VolunteerMatchList({
  city,
  title,
  preferredHelpTypes = [],
  limit = 3,
}: {
  city: string | null | undefined;
  title: string;
  preferredHelpTypes?: string[];
  limit?: number;
}) {
  const { data } = useVolunteers();
  const list = rankVolunteers(data ?? [], city, preferredHelpTypes).slice(0, limit);
  if (list.length === 0) return null;

  return (
    <MatchSection title={title} seeAllTo="/voluntarios" seeAllLabel="Ver todos">
      <div className="flex flex-col gap-3">
        {list.map((v) => (
          <VolunteerCard key={v.id} volunteer={v} />
        ))}
      </div>
    </MatchSection>
  );
}
