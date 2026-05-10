import api from './api';

export const aiService = {
  checkSymptoms: (data) => api.post('/ai/symptom-check', data),
  explainPrescription: (prescriptionId) => api.post('/ai/prescription-explain', { prescriptionId }),
  flagRisk: (patientId, history) => api.post('/ai/risk-flag', { patientId, history })
};
