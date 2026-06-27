import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { PetFilters } from '@/features/pets/components/PetFilters';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { Button } from '@/components/ui/Button';
import { usePetsInfinite, usePetCounts } from '@/features/pets/hooks/usePets';
import type { StatusFilter } from '@/types/pet';

/** Debounce a fast-changing value to avoid a query per keystroke. */
function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function PetsListingPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') ?? '');
  const [status, setStatus] = useState<StatusFilter>('all');
  const debouncedSearch = useDebounced(search);

  // Keep the ?q= param in sync so results are shareable.
  useEffect(() => {
    const next = new URLSearchParams(params);
    if (debouncedSearch.trim()) next.set('q', debouncedSearch.trim());
    else next.delete('q');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const query = useMemo(() => ({ status, search: debouncedSearch }), [status, debouncedSearch]);
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePetsInfinite(query);
  const counts = usePetCounts();

  // Flatten loaded pages; the exact total lives on every page's `count`.
  const pets = data?.pages.flatMap((p) => p.rows);
  const total = data?.pages[0]?.count ?? 0;

  return (
    <div className="space-y-4 animate-fade">
      <h1 className="text-[21px] font-extrabold text-forest-dark">Mascotas reportadas</h1>

      <SearchBar value={search} onChange={setSearch} />
      <PetFilters value={status} onChange={setStatus} counts={counts.data} />

      <p className="text-[13px] font-medium text-muted">
        {isLoading ? 'Buscando…' : `${total} resultado${total === 1 ? '' : 's'}`}
      </p>

      <PetGrid
        pets={pets}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyMessage="No hay resultados todavía. Puedes reportar una necesidad para ayudar a crear el mapa."
      />

      {hasNextPage && (
        <div className="flex justify-center pt-1">
          <Button variant="secondary" onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
            Cargar más
          </Button>
        </div>
      )}
    </div>
  );
}
