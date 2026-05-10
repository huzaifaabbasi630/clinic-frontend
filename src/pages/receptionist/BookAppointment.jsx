import React, { useState, useEffect } from 'react';
import { MdSave, MdGroup } from 'react-icons/md';
import FormInput from '../../components/FormInput';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { authService } from '../../services/authService';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/Loader';

const BookAppointment = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        status: 'Scheduled'
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch patients and users separately to identify which one fails
                let patientsList = [];
                let doctorsList = [];

                try {
                    patientsList = await patientService.getAll();
                } catch (err) {
                    console.error('Error fetching patients:', err);
                    toast.error('Failed to load patients list');
                }

                try {
                    const users = await authService.getAll();
                    doctorsList = Array.isArray(users) ? users.filter(u => u.role === 'doctor') : [];
                } catch (err) {
                    console.error('Error fetching doctors:', err);
                    toast.error('Failed to load doctors list');
                }

                setPatients(patientsList);
                setDoctors(doctorsList);
            } catch (error) {
                console.error('Global fetch error:', error);
                toast.error('An unexpected error occurred while loading data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.patientId || !formData.doctorId) {
            return toast.error('Please select both a patient and a doctor');
        }

        setSubmitting(true);
        try {
            await appointmentService.create(formData);
            toast.success('Appointment booked successfully!');
            navigate('/receptionist/dashboard');
        } catch (error) {
            toast.error(error?.toString() || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Book New Appointment</h2>
                <p style={{ color: 'var(--text-muted)' }}>Schedule a visit for a registered patient</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <FormInput
                            label="Select Patient"
                            type="select"
                            name="patientId"
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            options={patients.length > 0 ? patients.map(p => ({ 
                                value: p.id || p._id, 
                                label: `${p.name} (${p.contact})` 
                            })) : [{ value: '', label: 'No patients found' }]}
                            required
                        />
                        <FormInput
                            label="Assign Doctor"
                            type="select"
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            options={doctors.length > 0 ? doctors.map(d => ({ 
                                value: d._id || d.id, 
                                label: d.name 
                            })) : [{ value: '', label: 'No doctors found' }]}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <FormInput
                            label="Date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                        <FormInput
                            label="Time"
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            required
                        />
                    </div>

                    <FormInput
                        label="Reason for Visit"
                        type="textarea"
                        name="reason"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="Briefly describe the purpose of visit..."
                        required
                    />

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={submitting}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.875rem 2rem' }}
                    >
                        <MdSave size={20} /> {submitting ? 'Scheduling...' : 'Schedule Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
