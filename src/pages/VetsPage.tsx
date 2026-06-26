import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { VetCard } from '@/features/help/components/VetCard';
import { useVeterinarians } from '@/features/help/hooks';

export function VetsPage() {
  const { data, isLoading, isError, refetch } = useVeterinarians();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = data ?? [];
    if (!q) return list;
    return list.filter((v) =>
      `${v.name} ${v.clinic_name ?? ''} ${v.city} ${v.services.join(' ')}`.toLowerCase().includes(q),
    );
  }, [data, search]);

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="space-y-5 animate-fade">
      <header>
        <h1 className="text-[21px] font-extrabold text-forest-dark">Veterinarios disponibles</h1>
        <p className="mt-1 text-[13px] text-muted">
          Veterinarios y clínicas que ofrecen atención durante la emergencia.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-7 w-7 text-forest" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !hasData ? (
        <EmptyState
          emoji="🏥"
          title="Aún no hay veterinarios publicados"
          message="Si eres veterinario o clínica, puedes publicar tu disponibilidad."
          action={
            <Link to="/reportar/veterinario">
              <Button>Publicarme como veterinario</Button>
            </Link>
          }
        />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, clínica, ciudad o servicio…" />
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} veterinario{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((v) => (
              <VetCard key={v.id} vet={v} />
            ))}
            {filtered.length === 0 && (
              <p className="py-4 text-center text-[13px] text-muted">Sin resultados para “{search}”.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
