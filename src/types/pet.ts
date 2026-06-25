export type PetStatus = 'lost' | 'found';

export interface Pet {
  id: string;
  status: PetStatus;
  name: string | null;
  species: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  image_url: string | null;
  created_at: string;
}

/** Fields written when creating a report (id/created_at are server-generated). */
export type PetInsert = {
  status: PetStatus;
  name: string | null;
  species: string | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  image_url: string | null;
};

export type StatusFilter = PetStatus | 'all';

export interface PetQuery {
  status: StatusFilter;
  search: string;
}
