import { useQuery } from '@tanstack/react-query';
import { getImpactStats } from './api';

export function useImpactStats() {
  return useQuery({ queryKey: ['impact_stats'], queryFn: getImpactStats, staleTime: 30_000 });
}
