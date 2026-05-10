import api from './api';

const getStoredPatients = () => {
  const patients = localStorage.getItem('hospital_db_patients');
  return patients ? JSON.parse(patients) : [
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', contact: '+1234567890', createdBy: 'Receptionist A', status: 'Active' },
    { id: 2, name: 'Jane Smith', age: 32, gender: 'Female', contact: '+1987654321', createdBy: 'Receptionist B', status: 'Pending' },
    { id: 3, name: 'Robert Johnson', age: 58, gender: 'Male', contact: '+1122334455', createdBy: 'Receptionist A', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', age: 24, gender: 'Female', contact: '+1556677889', createdBy: 'Receptionist C', status: 'Active' },
  ];
};

export const patientService = {
  getAll: async () => {
    try {
      const response = await api.get('/patients');
      // Backend normalization: extract array if nested
      if (response && response.patients && Array.isArray(response.patients)) {
        return response.patients.map(p => ({ ...p, id: p.id || p._id }));
      }
      if (response && response.data && Array.isArray(response.data)) {
        return response.data.map(p => ({ ...p, id: p.id || p._id }));
      }
      if (Array.isArray(response)) {
        return response.map(p => ({ ...p, id: p.id || p._id }));
      }
      return [];
    } catch (err) {
      return getStoredPatients();
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/patients/${id}`);
      return response?.patient || response?.data || response;
    } catch (err) {
      const patients = getStoredPatients();
      return patients.find(p => p.id === parseInt(id) || p._id === id);
    }
  },
  create: async (data) => {
    try {
      const response = await api.post('/patients', data);
      return response?.patient || response?.data || response;
    } catch (err) {
      const patients = getStoredPatients();
      const newPatient = { ...data, id: Date.now(), status: 'Active' };
      patients.push(newPatient);
      localStorage.setItem('hospital_db_patients', JSON.stringify(patients));
      return newPatient;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/patients/${id}`, data);
      return response?.patient || response?.data || response;
    } catch (err) {
      const patients = getStoredPatients();
      const index = patients.findIndex(p => p.id === parseInt(id) || p._id === id);
      if (index !== -1) {
        patients[index] = { ...patients[index], ...data };
        localStorage.setItem('hospital_db_patients', JSON.stringify(patients));
        return patients[index];
      }
      throw 'Patient not found';
    }
  },
  delete: async (id) => {
    try {
      return await api.delete(`/patients/${id}`);
    } catch (err) {
      let patients = getStoredPatients();
      patients = patients.filter(p => p.id !== parseInt(id) && p._id !== id);
      localStorage.setItem('hospital_db_patients', JSON.stringify(patients));
      return { success: true };
    }
  },
  getHistory: async (id) => {
    try {
      const response = await api.get(`/patients/${id}/history`);
      return response?.data || response;
    } catch (err) {
      return { timeline: [], appointments: [], prescriptions: [], diagnosisLogs: [] };
    }
  },
};
