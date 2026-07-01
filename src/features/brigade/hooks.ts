import { useMutation, useQuery } from '@tanstack/react-query';
import { createBrigadeMember, getBrigadeDirectory } from './api';

// Public directory of approved/active brigadistas.
export function useBrigadeDirectory() {
  return useQuery({ queryKey: ['brigade'], queryFn: getBrigadeDirectory, staleTime: 30_000 });
}

// Application submission.
export function useCreateBrigadeMember() {
  return useMutation({ mutationFn: createBrigadeMember });
}
