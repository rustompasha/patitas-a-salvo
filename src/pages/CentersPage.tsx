import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { VerifiedCenterCard } from '@/features/help/components/VerifiedCenterCard';
import { useVerifiedCenters } from '@/features/help/hooks';

export function CentersPage() {
  const { data, isLoading, isError, refetch } = useVerifiedCenters();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = data ?? [];
    if (!q) return list;
    return list.filter((c) => `${c.name} ${c.city} ${c.needs.join(' ')}`.toLowerCase().includes(q));
  }, [data, search]);

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="space-y-5 animate-fade">
      <header>
        <h1 className="text-[21px] font-extrabold text-forest-dark">Centros activos</h1>
        <p className="mt-1 text-[13px] text-muted">
          Puntos de acopio, veterinarias y rescatistas verificados recibiendo ayuda.
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
          title="Aún no hay centros publicados"
          message="Cuando un centro o rescatista reporte necesidades reales, aparecerá aquí."
          action={
            <div className="flex w-full max-w-xs flex-col gap-2">
              <Link to="/reportar/centro">
                <Button fullWidth>Reportar centro / necesidad</Button>
              </Link>
              <Link to="/donar-insumos">
                <Button variant="secondary" fullWidth>
                  Quiero donar insumos
                </Button>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre, ciudad o insumo…" />
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} centro{filtered.length === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((c) => (
              <VerifiedCenterCard key={c.id} center={c} />
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
