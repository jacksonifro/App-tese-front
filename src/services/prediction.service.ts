import { api } from './api';
import type { NovaPredicaoRequest, PredictionResponse, Predicao } from '../types/api';

export const predictionService = {
  predictEpisode: async (data: NovaPredicaoRequest) => {
    const response = await api.post<PredictionResponse>('/predict/episode', data);
    return response.data;
  },

  getHistoryByPatient: async (patientId: number) => {
    const response = await api.get<Predicao[]>(`/historico/paciente/${patientId}`);
    return response.data;
  },

  getAllHistory: async () => {
    const response = await api.get<Predicao[]>('/historico');
    return response.data;
  },

  getHistoryById: async (id: number) => {
    const response = await api.get<Predicao>(`/historico/${id}`);
    return response.data;
  }
};
