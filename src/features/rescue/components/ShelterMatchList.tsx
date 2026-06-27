import { Link } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import { RefugeCard } from '@/features/help/components/RefugeCard';
import { FosterOfferCard } from '@/features/help/components/FosterOfferCard';
import { useRefugios, useVerifiedFosterOffers } from '@/features/help/hooks';
import { rankShelters, rankFosters } from '../matching';

/**
 * Suggested places that can take in an animal near `city`: refuges/shelters first,
 * then temporary homes. Ranked by proximity (same city → same area → newest).
 * Reused by the found-pet flow, found-pet detail and need detail.
 */
export function ShelterMatchList({
  city,
  shelterLimit = 4,
  fosterLimit = 3,
}: {
  city: string | null | undefined;
  shelterLimit?: number;
  fosterLimit?: number;
}) {
  const refugios = useRefugios();
  const fosters = useVerifiedFosterOffers();

  const loading = refugios.isLoading || fosters.isLoading;
  const shelters = rankShelters(refugios.data ?? [], city).slice(0, shelterLimit);
  const homes = rankFosters(fosters.data ?? [], city).slice(0, fosterLimit);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="h-6 w-6 text-forest" />
      </div>
    );
  }

  if (shelters.length === 0 && homes.length === 0) {
    return (
      <div className="rounded-2xl border border-sand-200 bg-white px-3.5 py-4 text-[13px] text-muted">
        Todavía no hay refugios ni hogares temporales publicados.{' '}
        <Link to="/reportar/refugio" className="font-bold text-forest">
          Registrar un refugio
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {shelters.map((s) => (
        <RefugeCard key={s.id} refuge={s} />
      ))}

      {homes.length > 0 && (
        <>
          <p className="mt-1 text-[12px] font-bold uppercase tracking-wide text-faint">
            Hogares temporales disponibles
          </p>
          {homes.map((h) => (
            <FosterOfferCard key={h.id} offer={h} />
          ))}
        </>
      )}
    </div>
  );
}
