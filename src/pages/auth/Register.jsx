import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdMedicalServices } from 'react-icons/md';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import FormInput from '../../components/FormInput';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'receptionist'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.register(formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '1rem'
    };

    return (
        <div style={containerStyle}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        backgroundColor: 'var(--primary-blue)',
                        color: 'white',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}>
                        <MdMedicalServices size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join our hospital network</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="john@hospital.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Account Type"
                        type="select"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        options={[
                            { value: 'receptionist', label: 'Receptionist' },
                            { value: 'doctor', label: 'Doctor' },
                            { value: 'admin', label: 'Admin' }
                        ]}
                        required
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.875rem', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Already have an account? {' '}
                    <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
