import api from './api';

export const patientService = {
  getAll: async () => {
    const response = await api.get('/patients');
    // Backend returns { success: true, data: patients[] }
    const patients = response.data || [];
    return patients.map(p => ({ ...p, id: p._id }));
  },
  
  getById: async (id) => {
    const response = await api.get(`/patients/${id}`);
    const patient = response.data || response;
    if (patient) patient.id = patient._id;
    return patient;
  },

  create: async (data) => {
    const response = await api.post('/patients', data);
    return response.data || response;
  },

  update: async (id, data) => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data || response;
  },

  delete: async (id) => {
    return await api.delete(`/patients/${id}`);
  },

  getHistory: async (id) => {
    const response = await api.get(`/patients/${id}/history`);
    return response.data || { timeline: [], appointments: [], prescriptions: [] };
  },
};
