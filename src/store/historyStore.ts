import type { PredictionResponse } from '../types/api';

export interface PredictionHistoryRecord {
  id: string;
  patientName: string;
  patientCpf: string;
  timestamp: string;
  group: string;
  verdict: string;
  processingTimeMs: number;
  fullResponse: PredictionResponse;
}

export const saveToHistory = (record: PredictionHistoryRecord) => {
  const history = getHistory();
  history.unshift(record);
  localStorage.setItem('saude_predict_history', JSON.stringify(history));
};

export const getHistory = (): PredictionHistoryRecord[] => {
  const data = localStorage.getItem('saude_predict_history');
  return data ? JSON.parse(data) : [];
};

export const deleteFromHistory = (id: string) => {
  const history = getHistory().filter(record => record.id !== id);
  localStorage.setItem('saude_predict_history', JSON.stringify(history));
};
