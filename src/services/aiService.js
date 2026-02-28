import api from './api';

export const aiService = {
  checkSymptoms: (data) => api.post('/ai/symptom-check', data),
  getMedicationAdvice: (symptoms) => api.post('/ai/medication-suggest', { symptoms }),
};
