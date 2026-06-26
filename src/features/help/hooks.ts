import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createFosterOffer,
  createNeedReport,
  createRefugeReport,
  createVetReport,
  getFosterOfferById,
  getFosterOffers,
  getNeeds,
  getRefugioById,
  getRefugios,
  getVeterinarians,
} from './api';

// ---- Public reads ----------------------------------------------------------
// Refugios, needs, foster offers and veterinarians all publish immediately.
export function useRefugios() {
  return useQuery({ queryKey: ['refugios'], queryFn: getRefugios, staleTime: 30_000 });
}

export function useVerifiedNeeds() {
  return useQuery({ queryKey: ['needs'], queryFn: getNeeds, staleTime: 30_000 });
}

export function useVerifiedFosterOffers() {
  return useQuery({
    queryKey: ['foster_offers'],
    queryFn: getFosterOffers,
    staleTime: 30_000,
  });
}

export function useVeterinarians() {
  return useQuery({ queryKey: ['veterinarians'], queryFn: getVeterinarians, staleTime: 30_000 });
}

export function useFosterOffer(id: string | undefined) {
  return useQuery({
    queryKey: ['foster_offers', 'detail', id],
    queryFn: () => getFosterOfferById(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useRefugio(id: string | undefined) {
  return useQuery({
    queryKey: ['refugios', 'detail', id],
    queryFn: () => getRefugioById(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
}

// ---- Submissions -----------------------------------------------------------
export function useCreateRefugeReport() {
  return useMutation({ mutationFn: createRefugeReport });
}

export function useCreateNeedReport() {
  return useMutation({ mutationFn: createNeedReport });
}

export function useCreateFosterOffer() {
  return useMutation({ mutationFn: createFosterOffer });
}

export function useCreateVetReport() {
  return useMutation({ mutationFn: createVetReport });
}
