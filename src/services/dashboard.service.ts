import { api } from './api';

export interface DashboardStats {
  totalPatients: number;
  totalPredictions: number;
  criticalPatients: number;
  averageAge: number;
  verdictData: { name: string; value: number; color?: string }[];
  patientTypeData: { name: string; value: number; color?: string }[];
  timelineData: { name: string; Predições: number }[];
}

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
