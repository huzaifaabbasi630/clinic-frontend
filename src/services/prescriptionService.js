import api from './api';

export const prescriptionService = {
  create: async (data) => {
    return await api.post('/prescriptions', data);
  },
  getById: async (id) => {
    return await api.get(`/prescriptions/${id}`);
  },
  getByPatient: async (patientId) => {
    return await api.get(`/prescriptions/patient/${patientId}`);
  },
};
