import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdLock, MdMedicalServices } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import FormInput from '../../components/FormInput';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    // Redirection check: once authenticated, move to dashboard
    useEffect(() => {
        if (isAuthenticated && user) {
            const role = user.role?.toLowerCase();
            if (role === 'admin') navigate('/admin/dashboard');
            else if (role === 'doctor') navigate('/doctor/dashboard');
            else if (role === 'receptionist') navigate('/receptionist/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await authService.login(formData);

            if (!data) {
                throw new Error("No response from server");
            }

            const userData = data.user || data.userData || (data.token ? data : null);
            const token = data.token;

            if (!userData || !token) {
                console.error("Incomplete login response:", data);
                throw new Error("Invalid response format from server");
            }

            // Update Context
            login(userData, token);
            toast.success('Login successful!');

            // The useEffect will handle the redirection automatically 
            // once the state updates. No need for immediate navigate here.

        } catch (error) {
            toast.error(error?.toString() || 'Invalid credentials');
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
            <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to your hospital account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="example@hospital.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-blue)', textDecoration: 'none' }}>
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.875rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Don't have an account? {' '}
                    <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: 600, textDecoration: 'none' }}>
                        Register Now
                    </Link>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Demo Credentials:</p>
                    <p>Admin: admin@hospital.com / admin123</p>
                    <p>Doctor: doctor@hospital.com / doctor123</p>
                    <p>Receptionist: rec@hospital.com / rec123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
