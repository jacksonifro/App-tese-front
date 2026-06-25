import type { PacienteDTO } from '../types/api';

export const calculateAge = (birthDateString: string): number => {
  if (!birthDateString) return -1;
  const hoje = new Date();
  const nasc = new Date(birthDateString);
  const nascLocal = new Date(nasc.getTime() + Math.abs(nasc.getTimezoneOffset() * 60000));
  let idade = hoje.getFullYear() - nascLocal.getFullYear();
  const m = hoje.getMonth() - nascLocal.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascLocal.getDate())) {
    idade--;
  }
  return idade;
};

export const getPatientType = (patient: PacienteDTO | null | undefined): string => {
  if (!patient) return '';
  
  if (patient.puerpera === 'Sim') {
    return 'Puérpera';
  }
  
  if (patient.gestante === 'Sim') {
    return 'Gestante';
  }
  
  const age = calculateAge(patient.dataNascimento);
  if (age >= 0 && age <= 3) {
    return 'Criança (0 a 3 anos)';
  }
  
  return 'Adulto';
};
