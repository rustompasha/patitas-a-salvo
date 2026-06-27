import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';
import { rankFoundPets } from '../matching';

/**
 * Found animals that still need placement near `city`, newest/closest first.
 * Each card already exposes "WhatsApp" to reach the finder. Reused by the shelter
 * onboarding, refuge detail and foster detail pages.
 */
export function AnimalsNeedingSupport({
  city,
  excludeId,
  limit = 4,
  emptyMessage = 'No hay animales encontrados esperando ubicación por ahora.',
}: {
  city?: string | null;
  excludeId?: string;
  limit?: number;
  emptyMessage?: string;
}) {
  const { data, isLoading, isError, refetch } = usePets({ status: 'found', search: '' });

  const pets = rankFoundPets(data ?? [], city)
    .filter((p) => p.id !== excludeId)
    .slice(0, limit);

  return (
    <PetGrid
      pets={isLoading ? undefined : pets}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
      emptyMessage={emptyMessage}
    />
  );
}
