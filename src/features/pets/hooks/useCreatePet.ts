import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPet } from '../api/createPet';
import { uploadPetImage } from '../api/uploadPetImage';
import { PETS_QUERY_KEY } from '@/constants/config';
import type { PetStatus } from '@/types/pet';

export interface CreatePetInput {
  status: PetStatus;
  name: string;
  species: string;
  description: string;
  location: string;
  phone: string;
  image: File | null;
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePetInput) => {
      let imageUrl: string | null = null;
      if (input.image) {
        imageUrl = await uploadPetImage(input.image);
      }
      return createPet({
        status: input.status,
        name: input.name.trim() || null,
        species: input.species || null,
        description: input.description.trim() || null,
        location: input.location.trim() || null,
        phone: input.phone.trim() || null,
        image_url: imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PETS_QUERY_KEY] });
    },
  });
}
