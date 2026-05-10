import api from './api';

export const patientService = {
  getAll: async () => {
    try {
      const response = await api.get('/patients');
      // Backend returns { success: true, data: patients[] }
      const patients = response.data || response || [];
      return Array.isArray(patients) ? patients.map(p => ({ ...p, id: p._id })) : [];
    } catch (error) {
      console.error('Error in patientService.getAll:', error);
      throw error;
    }
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
