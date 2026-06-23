import { api } from './api';
import type { PacienteDTO } from '../types/api';

export const patientService = {
  findAll: async (page = 0, size = 10, search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search) params.append('search', search);

    const response = await api.get<{ content: PacienteDTO[], totalElements: number }>('/pacientes', { params });
    return response.data;
  },

  findById: async (id: number) => {
    const response = await api.get<PacienteDTO>(`/pacientes/${id}`);
    return response.data;
  },

  create: async (data: PacienteDTO) => {
    const response = await api.post<PacienteDTO>('/pacientes', data);
    return response.data;
  },

  update: async (id: number, data: PacienteDTO) => {
    const response = await api.put<PacienteDTO>(`/pacientes/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/pacientes/${id}`);
  }
};
