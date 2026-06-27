import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { useToast } from '@/components/ui/Toast';
import { SPECIES_OPTIONS } from '@/constants/design';
import { useCreatePet } from '../hooks/useCreatePet';
import type { Pet, PetStatus } from '@/types/pet';

const schema = z.object({
  species: z.string().min(1, 'Selecciona el tipo de animal'),
  name: z.string().max(80).optional().or(z.literal('')),
  description: z
    .string()
    .min(5, 'Describe la mascota (color, señas, estado)')
    .max(1000, 'Máximo 1000 caracteres'),
  location: z.string().min(2, 'Indica una zona o referencia').max(160),
  phone: z
    .string()
    .min(7, 'Ingresa un número de contacto válido')
    .max(25)
    .regex(/^[0-9+\-\s()]+$/, 'Solo números y símbolos de teléfono'),
});

type FormValues = z.infer<typeof schema>;

interface PetFormProps {
  status: PetStatus;
  /** Override the submit button label (e.g. rescue-flow wording). */
  submitLabel?: string;
  /** Prefill the location field (e.g. the zone gathered earlier in a guided flow). */
  defaultLocation?: string;
  /** When provided, called with the created pet instead of the default toast+redirect.
   *  Lets a guided flow chain follow-up actions (e.g. create a need, show next steps). */
  onPublished?: (pet: Pet) => void;
}

const COPY: Record<PetStatus, { submit: string; variant: 'danger' | 'primary'; namePlaceholder: string; descPlaceholder: string; locPlaceholder: string; notice?: string }> = {
  lost: {
    submit: 'Publicar búsqueda',
    variant: 'danger',
    namePlaceholder: 'Ej: Luna',
    descPlaceholder: 'Ej: Blanca con manchas marrones, collar rojo',
    locPlaceholder: 'Ej: Macuto, cerca de la plaza',
  },
  found: {
    submit: 'Publicar mascota encontrada',
    variant: 'primary',
    namePlaceholder: 'Nombre (si lo sabes)',
    descPlaceholder: 'Ej: Gato naranja adulto, asustado pero sin heridas visibles',
    locPlaceholder: 'Ej: Los Palos Grandes, esquina con…',
    notice:
      'No entres a estructuras dañadas para rescatar animales. Reporta la ubicación y deja que un equipo actúe con seguridad.',
  },
};

export function PetForm({ status, submitLabel, onPublished, defaultLocation }: PetFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPet = useCreatePet();
  const [image, setImage] = useState<File | null>(null);
  const copy = COPY[status];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { species: '', name: '', description: '', location: defaultLocation ?? '', phone: '' },
  });

  function onSubmit(values: FormValues) {
    createPet.mutate(
      {
        status,
        species: values.species,
        name: values.name ?? '',
        description: values.description,
        location: values.location,
        phone: values.phone,
        image,
      },
      {
        onSuccess: (pet) => {
          if (onPublished) {
            onPublished(pet);
            return;
          }
          toast(status === 'lost' ? 'Búsqueda publicada' : 'Mascota reportada');
          navigate('/mascotas');
        },
        onError: () => {
          toast('No se pudo publicar. Inténtalo de nuevo.');
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {copy.notice && (
        <div className="rounded-xl border border-[#D4E7D8] bg-[#EAF3EC] px-3.5 py-3 text-[12px] leading-snug text-forest">
          {copy.notice}
        </div>
      )}

      <ImageUpload value={image} onChange={setImage} />

      <Controller
        control={control}
        name="species"
        render={({ field }) => (
          <Select
            label="Tipo de animal"
            placeholder="Selecciona…"
            options={SPECIES_OPTIONS}
            error={errors.species?.message}
            {...field}
          />
        )}
      />

      <Input label="Nombre (opcional)" placeholder={copy.namePlaceholder} error={errors.name?.message} {...register('name')} />

      <Textarea
        label="Color y señas particulares"
        placeholder={copy.descPlaceholder}
        error={errors.description?.message}
        {...register('description')}
      />

      <Input
        label={status === 'lost' ? 'Última vez vista' : '¿Dónde la encontraste?'}
        placeholder={copy.locPlaceholder}
        error={errors.location?.message}
        {...register('location')}
      />

      <Input
        label="Tu WhatsApp / teléfono"
        placeholder="0412…"
        inputMode="tel"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Button type="submit" variant={copy.variant} fullWidth loading={createPet.isPending}>
        {submitLabel ?? copy.submit}
      </Button>

      {createPet.isError && (
        <p className="text-center text-sm font-medium text-lost">
          Ocurrió un error al publicar. Revisa tu conexión e inténtalo de nuevo.
        </p>
      )}
    </form>
  );
}
