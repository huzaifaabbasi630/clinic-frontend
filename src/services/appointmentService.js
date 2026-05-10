import api from './api';

export const appointmentService = {
  getAll: async () => {
    const response = await api.get('/appointments');
    const appointments = response.data || [];
    return appointments.map(a => ({ 
        ...a, 
        id: a._id,
        patient: a.patientId?.name || 'Unknown',
        patientRealId: a.patientId?._id || a.patientId,
        doctor: a.doctorId?.name || 'N/A'
    }));
  },

  getByDoctor: async (doctorId) => {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    const appointments = response.data || [];
    return appointments.map(a => ({ ...a, id: a._id }));
  },

  create: async (data) => {
    return await api.post('/appointments', data);
  },

  updateStatus: async (id, status) => {
    return await api.patch(`/appointments/${id}`, { status });
  },
};
