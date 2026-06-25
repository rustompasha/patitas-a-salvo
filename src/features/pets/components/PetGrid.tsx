import { Link } from 'react-router-dom';
import { PetCard } from './PetCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import type { Pet } from '@/types/pet';

interface PetGridProps {
  pets: Pet[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
      <div className="h-32 animate-pulse bg-sand-100" />
      <div className="space-y-2 p-3">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-sand-100" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-sand-100" />
        <div className="h-8 w-full animate-pulse rounded bg-sand-100" />
      </div>
    </div>
  );
}

export function PetGrid({ pets, isLoading, isError, onRetry, emptyMessage }: PetGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (!pets || pets.length === 0) {
    return (
      <EmptyState
        emoji="🔍"
        title="Sin resultados"
        message={emptyMessage ?? 'Aún no hay mascotas que coincidan. Prueba con otra búsqueda o reporta una.'}
        action={
          <Link to="/reportar/perdida">
            <Button>Reportar una mascota</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {pets.map((pet) => (
        <PetCard key={pet.id} pet={pet} />
      ))}
    </div>
  );
}
