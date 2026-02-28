import api from './api';

const getStoredAppointments = () => {
  const data = localStorage.getItem('hospital_db_appointments');
  return data ? JSON.parse(data) : [
    { id: 101, name: 'John Doe', doctor: 'Dr. Sarah', time: '10:30 AM', type: 'Consultation', status: 'Waiting' },
    { id: 102, name: 'Jane Smith', doctor: 'Dr. James', time: '11:15 AM', type: 'Checkup', status: 'Upcoming' }
  ];
};

export const appointmentService = {
  getAll: async () => {
    try {
      const response = await api.get('/appointments');
      if (response && response.appointments && Array.isArray(response.appointments)) {
        return response.appointments.map(a => ({ ...a, id: a.id || a._id }));
      }
      if (response && response.data && Array.isArray(response.data)) {
        return response.data.map(a => ({ ...a, id: a.id || a._id }));
      }
      if (Array.isArray(response)) {
        return response.map(a => ({ ...a, id: a.id || a._id }));
      }
      return [];
    } catch (err) {
      return getStoredAppointments();
    }
  },
  getByDoctor: async (doctorId) => {
    try {
      return await api.get(`/appointments/doctor/${doctorId}`);
    } catch (err) {
      return getStoredAppointments();
    }
  },
  create: async (data) => {
    try {
      return await api.post('/appointments', data);
    } catch (err) {
      const all = getStoredAppointments();
      const newAppt = { ...data, id: Date.now(), status: 'Scheduled' };
      all.push(newAppt);
      localStorage.setItem('hospital_db_appointments', JSON.stringify(all));
      return newAppt;
    }
  },
  updateStatus: async (id, status) => {
    try {
      return await api.patch(`/appointments/${id}`, { status });
    } catch (err) {
      const all = getStoredAppointments();
      const index = all.findIndex(a => a.id === parseInt(id));
      if (index !== -1) {
        all[index].status = status;
        localStorage.setItem('hospital_db_appointments', JSON.stringify(all));
        return all[index];
      }
      throw 'Appointment not found';
    }
  },
};
