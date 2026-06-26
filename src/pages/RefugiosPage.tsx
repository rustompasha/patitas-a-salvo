import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { RefugeCard } from '@/features/help/components/RefugeCard';
import { useRefugios } from '@/features/help/hooks';

export function RefugiosPage() {
  const { data, isLoading, isError, refetch } = useRefugios();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = data ?? [];
    if (!q) return list;
    return list.filter((r) => `${r.name} ${r.city} ${r.needs.join(' ')}`.toLowerCase().includes(q));
  }, [data, search]);

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="space-y-5 animate-fade">
      <header>
        <h1 className="text-[21px] font-extrabold text-forest-dark">Refugios y puntos de ayuda</h1>
        <p className="mt-1 text-[13px] text-muted">
          Lugares y personas organizadas que pueden recibir animales o insumos.
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
          emoji="🏠"
          title="Aún no hay refugios publicados"
          message="Si tienes un refugio, eres rescatista organizado o puedes recibir insumos, publícalo aquí."
          action={
            <Link to="/reportar/refugio">
              <Button>Registrar refugio</Button>
            </Link>
          }
        />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, ciudad o insumo…" />
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} refugio{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <RefugeCard key={r.id} refuge={r} />
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
