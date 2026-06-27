import { useRefugios } from '@/features/help/hooks';
import { usePets } from '@/features/pets/hooks/usePets';
import { RefugeCard } from '@/features/help/components/RefugeCard';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { MatchSection } from './MatchSection';
import { rankShelters, rankFoundPets, isShelterAvailable } from '../matching';

/**
 * "The network is alive" home blocks: found animals that still need placement and
 * refuges that currently have room. Each section hides itself when there's no data,
 * so the homepage never shows empty scaffolding. Urgent supply requests already
 * live in <UrgentNeeds/>.
 */
export function HomeRescueBoard() {
  const refugios = useRefugios();
  const found = usePets({ status: 'found', search: '' });

  const availableShelters = rankShelters(
    (refugios.data ?? []).filter(isShelterAvailable),
    null,
  ).slice(0, 3);
  const foundPets = rankFoundPets(found.data ?? [], null).slice(0, 4);

  return (
    <>
      {foundPets.length > 0 && (
        <MatchSection
          title="Animales que buscan lugar"
          subtitle="Encontrados recientemente — ayúdalos a conseguir refugio"
          seeAllTo="/mascotas"
        >
          <PetGrid pets={foundPets} isLoading={false} isError={false} />
        </MatchSection>
      )}

      {availableShelters.length > 0 && (
        <MatchSection title="Refugios con cupo disponible" seeAllTo="/refugios">
          <div className="flex flex-col gap-3">
            {availableShelters.map((s) => (
              <RefugeCard key={s.id} refuge={s} />
            ))}
          </div>
        </MatchSection>
      )}
    </>
  );
}
