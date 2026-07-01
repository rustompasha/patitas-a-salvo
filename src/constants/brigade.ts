import type { BrigadeRow } from '@/types/brigade';

// Caracas / área metropolitana only. Brigadistas reside here; coordinated
// operations may deploy toward La Guaira.
export const BRIGADE_MUNICIPALITY_OPTIONS = [
  'Libertador',
  'Chacao',
  'Baruta',
  'Sucre',
  'El Hatillo',
  'Otro (área metropolitana)',
];

export const BRIGADE_AVAILABILITY_OPTIONS = [
  'Inmediata',
  'Esta semana',
  'Fines de semana',
  'Ocasional',
];

export const BRIGADE_EXPERIENCE_OPTIONS = [
  'Sin experiencia',
  'Básica',
  'Intermedia',
  'Avanzada',
  'Profesional',
];

export const BRIGADE_EQUIPMENT_OPTIONS = [
  'Transportadoras',
  'Guantes',
  'Botiquín',
  'Linterna',
  'Cuerdas',
  'Jaulas',
  'Vehículo',
  'Otro',
];

// What a coordinated brigadista actually does — animal-focused field support,
// NOT structural rescue. Shown on the application page so expectations are clear.
export const BRIGADE_ROLE_POINTS = [
  'Disponible en Caracas y el área metropolitana',
  'Puede desplazarse hacia La Guaira cuando se coordina una operación',
  'Verificación en campo de reportes de animales',
  'Manejo seguro de animales',
  'Traslado de animales a veterinarios, refugios u hogares temporales',
  'Apoyo a veterinarios y rescatistas en el terreno',
  'Distribución de insumos urgentes',
  'Participación en operaciones organizadas de Patitas a Salvo',
];

// Explicit safety rules. Human life and official rescue operations come first.
// This module never authorizes entering damaged or unstable structures.
export const BRIGADE_SAFETY_POINTS = [
  'Nadie está autorizado a entrar en edificaciones inestables o estructuras dañadas.',
  'Nadie debe poner su vida en riesgo bajo ninguna circunstancia.',
  'Todo apoyo en campo debe ser coordinado y evaluado previamente.',
  'La prioridad es la vida humana y las operaciones oficiales de rescate.',
];

/** Prefilled WhatsApp message when coordinating with a brigadista. */
export const BRIGADE_CONTACT_MESSAGE =
  'Hola, te contacto desde la Brigada de Respuesta Animal de Patitas a Salvo para coordinar apoyo en campo.';

/** Operational capability chips derived from a brigadista's answers, for the
 *  directory card. Field/skill capabilities first, logistics last. */
export function brigadeCapabilities(m: BrigadeRow): string[] {
  const caps: string[] = [];
  if (m.can_travel_to_la_guaira) caps.push('Puede ir a La Guaira');
  if (m.first_aid_training) caps.push('Primeros auxilios');
  if (m.veterinary_training) caps.push('Formación veterinaria');
  if (m.animal_handling_experience) caps.push('Manejo de animales');
  if (m.disaster_response_experience) caps.push('Respuesta a emergencias');
  if (m.has_vehicle) caps.push(m.vehicle_type ? `Vehículo · ${m.vehicle_type}` : 'Vehículo');
  return caps;
}
