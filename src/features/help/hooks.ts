import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCenterReport,
  createFosterOffer,
  createNeedReport,
  createVetReport,
  getVerifiedCenters,
  getFosterOffers,
  getNeeds,
  getVeterinarians,
} from './api';

// ---- Public reads ----------------------------------------------------------
// Centers are moderated (verified-only); needs and foster offers publish immediately.
export function useVerifiedCenters() {
  return useQuery({ queryKey: ['centers', 'verified'], queryFn: getVerifiedCenters, staleTime: 30_000 });
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

// ---- Submissions -----------------------------------------------------------
export function useCreateCenterReport() {
  return useMutation({ mutationFn: createCenterReport });
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
