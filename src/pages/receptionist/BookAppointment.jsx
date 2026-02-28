import React, { useState } from 'react';
import { MdSave, MdGroup } from 'react-icons/md';
import FormInput from '../../components/FormInput';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: '',
        status: 'Pending'
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Appointment booked successfully!');
        navigate('/receptionist/dashboard');
    };

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
                            options={[
                                { value: '1', label: 'John Doe' },
                                { value: '2', label: 'Jane Smith' }
                            ]}
                            required
                        />
                        <FormInput
                            label="Assign Doctor"
                            type="select"
                            name="doctorId"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            options={[
                                { value: '1', label: 'Dr. Sarah Smith' },
                                { value: '2', label: 'Dr. James Wilson' }
                            ]}
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

                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.875rem 2rem' }}>
                        <MdSave size={20} /> Schedule Appointment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;
