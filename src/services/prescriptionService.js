import api from './api';

const getStoredPrescriptions = () => {
  const data = localStorage.getItem('hospital_db_prescriptions');
  return data ? JSON.parse(data) : [];
};

export const prescriptionService = {
  create: async (data) => {
    try {
      return await api.post('/prescriptions', data);
    } catch (err) {
      const all = getStoredPrescriptions();
      const newPrescription = { ...data, id: Date.now() };
      all.push(newPrescription);
      localStorage.setItem('hospital_db_prescriptions', JSON.stringify(all));
      return newPrescription;
    }
  },
  getById: async (id) => {
    try {
      return await api.get(`/prescriptions/${id}`);
    } catch (err) {
      const all = getStoredPrescriptions();
      return all.find(p => p.id === parseInt(id));
    }
  },
  getByPatient: async (patientId) => {
    try {
      return await api.get(`/prescriptions/patient/${patientId}`);
    } catch (err) {
      const all = getStoredPrescriptions();
      return all.filter(p => p.patientId === patientId.toString());
    }
  },
};
