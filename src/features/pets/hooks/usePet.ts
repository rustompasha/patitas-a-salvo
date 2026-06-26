import { useQuery } from '@tanstack/react-query';
import { getPetById } from '../api/getPetById';
import { PETS_QUERY_KEY } from '@/constants/config';

export function usePet(id: string | undefined) {
  return useQuery({
    queryKey: [PETS_QUERY_KEY, 'detail', id],
    queryFn: () => getPetById(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
}
