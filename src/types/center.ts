export type Urgency = 'Crítico' | 'Alto' | 'Medio';

export type CenterStatus = 'Activo' | 'Recibiendo emergencias' | 'Saturado';

export type CenterType = 'Centro de acopio' | 'Veterinaria' | 'Rescatistas';

export interface CenterNeed {
  name: string;
  urgency: Urgency;
  got: number;
  need: number;
  unit: string;
}

export interface CenterDelivery {
  txt: string;
  t: string;
}

export interface Center {
  id: string;
  name: string;
  type: CenterType;
  location: string;
  address: string;
  status: CenterStatus;
  updated: string;
  whatsapp: string;
  trust: string;
  capacityPct: number;
  slots: string;
  needs: CenterNeed[];
  received: CenterDelivery[];
}

export interface UrgentNeed {
  key: string;
  label: string;
  emoji: string;
  urgency: Urgency;
  centers: number;
}
