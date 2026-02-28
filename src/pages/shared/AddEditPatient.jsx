import React, { useState, useEffect } from 'react';
import { MdSave } from 'react-icons/md';
import FormInput from '../../components/FormInput';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';

const AddEditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contact: '',
        email: '',
        address: '',
        bloodGroup: '',
        emergencyContact: ''
    });

    useEffect(() => {
        if (id) {
            const fetchPatient = async () => {
                setFetching(true);
                try {
                    const data = await patientService.getById(id);
                    if (data) {
                        setFormData(data);
                    } else {
                        toast.error('Patient not found');
                        navigate('/patients');
                    }
                } catch (error) {
                    toast.error('Error fetching patient data');
                } finally {
                    setFetching(false);
                }
            };
            fetchPatient();
        }
    }, [id, navigate]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await patientService.update(id, formData);
                toast.success('Patient updated successfully!');
            } else {
                await patientService.create(formData);
                toast.success('Patient registered successfully!');
            }
            navigate('/patients');
        } catch (error) {
            toast.error(error?.toString() || 'Failed to save patient');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <Loader fullScreen />;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>{id ? 'Edit Patient' : 'Register New Patient'}</h2>
                <p style={{ color: 'var(--text-muted)' }}>Fill in the details to {id ? 'update' : 'create'} patient record</p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <h4 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Personal Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <FormInput
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormInput
                                label="Age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                required
                            />
                            <FormInput
                                label="Gender"
                                type="select"
                                name="gender"
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <FormInput
                            label="Contact Number"
                            name="contact"
                            value={formData.contact}
                            onChange={(e) => handleChange('contact', e.target.value)}
                            required
                        />
                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1.5rem 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Medical Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <FormInput
                            label="Blood Group"
                            type="select"
                            name="bloodGroup"
                            value={formData.bloodGroup}
                            onChange={(e) => handleChange('bloodGroup', e.target.value)}
                            options={[
                                { value: 'A+', label: 'A+' },
                                { value: 'O+', label: 'O+' },
                                { value: 'B+', label: 'B+' },
                                { value: 'AB+', label: 'AB+' },
                                { value: 'A-', label: 'A-' },
                                { value: 'O-', label: 'O-' },
                                { value: 'B-', label: 'B-' },
                                { value: 'AB-', label: 'AB-' },
                            ]}
                        />
                        <FormInput
                            label="Emergency Contact"
                            name="emergencyContact"
                            placeholder="Name & Relationship - Phone"
                            value={formData.emergencyContact}
                            onChange={(e) => handleChange('emergencyContact', e.target.value)}
                        />
                    </div>

                    <FormInput
                        label="Permanent Address"
                        type="textarea"
                        name="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2.5rem', marginTop: '1rem' }}
                    >
                        <MdSave size={20} /> {loading ? 'Saving...' : (id ? 'Save Changes' : 'Register Patient')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEditPatient;
