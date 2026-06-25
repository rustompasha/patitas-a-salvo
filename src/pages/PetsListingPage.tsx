import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { PetFilters } from '@/features/pets/components/PetFilters';
import { PetGrid } from '@/features/pets/components/PetGrid';
import { usePets } from '@/features/pets/hooks/usePets';
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
  const { data, isLoading, isError, refetch } = usePets(query);

  return (
    <div className="space-y-4 animate-fade">
      <h1 className="text-[21px] font-extrabold text-forest-dark">Mascotas reportadas</h1>

      <SearchBar value={search} onChange={setSearch} />
      <PetFilters value={status} onChange={setStatus} />

      <p className="text-[13px] font-medium text-muted">
        {isLoading ? 'Buscando…' : `${data?.length ?? 0} resultado${(data?.length ?? 0) === 1 ? '' : 's'}`}
      </p>

      <PetGrid pets={data} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </div>
  );
}
