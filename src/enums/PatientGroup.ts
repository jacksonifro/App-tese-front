export const PatientGroup = {
  GESTANTE: 'GESTANTE',
  CRIANCA: 'CRIANCA',
  PUERPERA: 'PUERPERA'
} as const;

export type PatientGroupType = typeof PatientGroup[keyof typeof PatientGroup];
