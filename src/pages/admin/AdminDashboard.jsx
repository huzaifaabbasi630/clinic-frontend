import React, { useState, useEffect } from 'react';
import { MdPeople, MdPerson, MdEvent, MdAttachMoney } from 'react-icons/md';
import StatCard from '../../components/StatCard';
import { Line, Bar } from 'react-chartjs-2';
import { patientService } from '../../services/patientService';
import { authService } from '../../services/authService';
import { appointmentService } from '../../services/appointmentService';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
        revenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const patients = await patientService.getAll();
                const users = await authService.getAll();
                const appointments = await appointmentService.getAll();

                const doctorCount = Array.isArray(users) ? users.filter(u => u.role?.toLowerCase() === 'doctor').length : 0;

                setStats({
                    totalPatients: Array.isArray(patients) ? patients.length : 0,
                    totalDoctors: doctorCount,
                    totalAppointments: Array.isArray(appointments) ? appointments.length : 0,
                    revenue: (Array.isArray(appointments) ? appointments.length : 0) * 50 // Mock revenue
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Appointments',
                data: [65, 59, 80, 81, 56, stats.totalAppointments || 95],
                fill: false,
                borderColor: '#2563eb',
                tension: 0.4,
            },
        ],
    };

    const barData = {
        labels: ['Flu', 'Cold', 'COVID-19', 'Injuries', 'Diarrhea', 'Other'],
        datasets: [
            {
                label: 'Diagnosis Count',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
            },
        ],
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Admin Dashboard</h2>
                <p style={{ color: 'var(--text-muted)' }}>Overview of hospital performance</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients.toLocaleString()}
                    icon={<MdPeople />}
                    trend="+12%"
                    color="#2563eb"
                />
                <StatCard
                    title="Total Doctors"
                    value={stats.totalDoctors}
                    icon={<MdPerson />}
                    trend="+2"
                    color="#8b5cf6"
                />
                <StatCard
                    title="Monthly Appointments"
                    value={stats.totalAppointments}
                    icon={<MdEvent />}
                    trend="+5.4%"
                    color="#10b981"
                />
                <StatCard
                    title="Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    icon={<MdAttachMoney />}
                    trend="+8%"
                    color="#f59e0b"
                />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                gap: '1.5rem'
            }}>
                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Appointments Trend</h4>
                    <div style={{ height: '300px' }}>
                        <Line data={lineData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Common Diagnoses</h4>
                    <div style={{ height: '300px' }}>
                        <Bar data={barData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
