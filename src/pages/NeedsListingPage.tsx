import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { NeedCard } from '@/features/help/components/NeedCard';
import { useVerifiedNeeds } from '@/features/help/hooks';

export function NeedsListingPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useVerifiedNeeds();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = data ?? [];
    if (!q) return list;
    return list.filter((n) =>
      `${n.need} ${n.category ?? ''} ${n.city} ${n.reference ?? ''}`.toLowerCase().includes(q),
    );
  }, [data, search]);

  const hasData = (data?.length ?? 0) > 0;

  return (
    <div className="space-y-5 animate-fade">
      <header>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-sand-300 bg-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#1F2933" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[21px] font-extrabold text-forest-dark">Necesidades activas</h1>
        <p className="mt-1 text-[13px] text-muted">Solicitudes de ayuda reportadas. Contacta directamente por WhatsApp.</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-7 w-7 text-forest" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !hasData ? (
        <EmptyState
          emoji="📋"
          title="No hay necesidades activas"
          message="Cuando alguien solicite ayuda, aparecerá aquí."
          action={
            <Link to="/reportar/necesidad">
              <Button>Reportar una necesidad</Button>
            </Link>
          }
        />
      ) : (
        <>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar por necesidad, tipo o ciudad…" />
          <p className="text-[13px] font-medium text-muted">
            {filtered.length} necesidad{filtered.length === 1 ? '' : 'es'}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((n) => (
              <NeedCard key={n.id} need={n} />
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
