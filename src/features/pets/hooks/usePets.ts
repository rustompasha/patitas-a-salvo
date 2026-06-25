import { useQuery } from '@tanstack/react-query';
import { getPets } from '../api/getPets';
import { PETS_QUERY_KEY } from '@/constants/config';
import type { PetQuery } from '@/types/pet';

export function usePets(query: PetQuery) {
  return useQuery({
    queryKey: [PETS_QUERY_KEY, query.status, query.search],
    queryFn: () => getPets(query),
    staleTime: 30_000,
  });
}
