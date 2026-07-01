import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCentroAcopio,
  createFosterOffer,
  createNeedReport,
  createRefugeReport,
  createVetReport,
  createVolunteer,
  getCentrosAcopio,
  getFosterOfferById,
  getFosterOffers,
  getNeedById,
  getNeeds,
  getRefugeNeeds,
  getRefugioById,
  getRefugios,
  getVeterinarians,
  getVolunteerById,
  getVolunteers,
} from './api';

// ---- Public reads ----------------------------------------------------------
// Refugios, needs, foster offers and veterinarians all publish immediately.
export function useRefugios() {
  return useQuery({ queryKey: ['refugios'], queryFn: getRefugios, staleTime: 30_000 });
}

export function useCentrosAcopio() {
  return useQuery({ queryKey: ['centros_acopio'], queryFn: getCentrosAcopio, staleTime: 30_000 });
}

export function useVolunteers() {
  return useQuery({ queryKey: ['volunteers'], queryFn: getVolunteers, staleTime: 30_000 });
}

export function useVolunteer(id: string | undefined) {
  return useQuery({
    queryKey: ['volunteers', 'detail', id],
    queryFn: () => getVolunteerById(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useVerifiedNeeds() {
  return useQuery({ queryKey: ['needs'], queryFn: getNeeds, staleTime: 30_000 });
}

export function useNeed(id: string | undefined) {
  return useQuery({
    queryKey: ['needs', 'detail', id],
    queryFn: () => getNeedById(id as string),
    enabled: !!id,
    staleTime: 30_000,
  });
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

export function useRefugeNeeds(id: string | undefined, name: string | undefined) {
  return useQuery({
    queryKey: ['needs', 'refuge', id, name],
    queryFn: () => getRefugeNeeds(id as string, name as string),
    enabled: !!id && !!name,
    staleTime: 30_000,
  });
}

// ---- Submissions -----------------------------------------------------------
export function useCreateRefugeReport() {
  return useMutation({ mutationFn: createRefugeReport });
}

export function useCreateCentroAcopio() {
  return useMutation({ mutationFn: createCentroAcopio });
}

export function useCreateVolunteer() {
  return useMutation({ mutationFn: createVolunteer });
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
