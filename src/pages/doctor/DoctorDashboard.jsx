import React, { useState, useEffect } from 'react';
import { MdEventNote, MdHistory, MdGroup, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ todayAppointments: 0, totalPatients: 0 });
    const [todayAppointments, setTodayAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patients = await patientService.getAll();
                const appointments = await appointmentService.getAll(); // In real app, filter by doctor ID

                setStats({
                    totalPatients: Array.isArray(patients) ? patients.length : 0,
                    todayAppointments: Array.isArray(appointments) ? appointments.length : 0
                });

                // Mocking today's appointments if none exist
                const list = Array.isArray(appointments) && appointments.length > 0
                    ? appointments
                    : [
                        { id: 101, patient: 'John Doe', time: '10:30 AM', type: 'Follow-up', status: 'In Waiting' },
                        { id: 102, patient: 'Jane Smith', time: '11:15 AM', type: 'Checkup', status: 'Upcoming' },
                    ];
                setTodayAppointments(list);
            } catch (error) {
                console.error('Error fetching doctor stats:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Welcome, {user?.name || 'Dr. Smith'}</h2>
                <p style={{ color: 'var(--text-muted)' }}>You have {stats.todayAppointments} appointments scheduled for today.</p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard title="Today's Appointments" value={stats.todayAppointments} icon={<MdEventNote />} color="#2563eb" />
                <StatCard title="Total Patients" value={stats.totalPatients} icon={<MdGroup />} color="#10b981" />
                <StatCard title="Pending Reports" value="5" icon={<MdHistory />} color="#f59e0b" />
            </div>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h4 style={{ margin: 0 }}>Immediate Appointments</h4>
                    </div>
                    <Table
                        columns={[
                            { header: 'Patient Name', key: 'patient' },
                            { header: 'Schedule', key: 'time' },
                            { header: 'Type', key: 'type' },
                            { header: 'Status', key: 'status' },
                        ]}
                        data={todayAppointments}
                        actions={(row) => (
                            <button
                                onClick={() => navigate('/doctor/prescription', { state: { patientName: row.patient } })}
                                className="btn-primary"
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                                Treat Now
                            </button>
                        )}
                    />
                </div>

                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem' }}>Recent Notifications</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ padding: '0.75rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px', fontSize: '0.875rem' }}>
                                <p style={{ margin: 0, fontWeight: 500 }}>System update completed</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2 hours ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
