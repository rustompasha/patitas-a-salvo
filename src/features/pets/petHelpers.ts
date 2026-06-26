import type { Pet } from '@/types/pet';

const SPECIES_EMOJI: Record<string, string> = { Perro: '🐕', Gato: '🐈' };

export function petTitle(pet: Pet): string {
  return pet.name?.trim() || (pet.status === 'lost' ? 'Mascota perdida' : 'Mascota encontrada');
}

export function petEmoji(pet: Pet): string {
  return (pet.species && SPECIES_EMOJI[pet.species]) || '🐾';
}

/** Generic share/contact copy used by WhatsApp + Share. */
export function petShareText(pet: Pet): string {
  const title = petTitle(pet);
  return pet.status === 'lost'
    ? `🐾 Mascota perdida: ${title}${pet.location ? ` en ${pet.location}` : ''}. ¿La has visto?`
    : `🐾 Mascota encontrada${pet.location ? ` en ${pet.location}` : ''}: ${title}. ¿Es tuya o de alguien que conoces?`;
}

/** Stronger CTA message: "Creo que vi esta mascota". */
export function petSightedText(pet: Pet): string {
  const title = petTitle(pet);
  return `Hola 👋 Vi tu publicación en Patitas a Salvo sobre ${title}${
    pet.location ? ` (${pet.location})` : ''
  }. Creo que vi esta mascota y quiero darte información.`;
}
