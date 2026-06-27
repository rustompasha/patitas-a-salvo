import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPets, getPetsPage, getPetCounts } from '../api/getPets';
import { PETS_QUERY_KEY } from '@/constants/config';
import type { PetQuery } from '@/types/pet';

export function usePets(query: PetQuery) {
  return useQuery({
    queryKey: [PETS_QUERY_KEY, query.status, query.search],
    queryFn: () => getPets(query),
    staleTime: 30_000,
  });
}

/** Paginated listing with "Cargar más"; pages carry the exact total `count`. */
export function usePetsInfinite(query: PetQuery) {
  return useInfiniteQuery({
    queryKey: [PETS_QUERY_KEY, 'page', query.status, query.search],
    queryFn: ({ pageParam }) => getPetsPage(query, pageParam),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextPage,
    staleTime: 30_000,
  });
}

/** Exact category sizes for the filter tabs (Todas / Perdidas / Encontradas). */
export function usePetCounts() {
  return useQuery({
    queryKey: [PETS_QUERY_KEY, 'counts'],
    queryFn: getPetCounts,
    staleTime: 30_000,
  });
}
