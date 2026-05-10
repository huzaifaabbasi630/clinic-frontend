import React, { useState, useEffect } from 'react';
import { MdAdd, MdCalendarToday, MdPeople } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Table from '../../components/Table';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';

const ReceptionistDashboard = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({ patients: 0, appointments: 0 });
    const [recentQueue, setRecentQueue] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const patients = await patientService.getAll();
                const appointments = await appointmentService.getAll();

                setCounts({
                    patients: Array.isArray(patients) ? patients.length : 0,
                    appointments: Array.isArray(appointments) ? appointments.length : 0
                });

                // Real data from appointments
                setRecentQueue(Array.isArray(appointments) ? appointments : []);
            } catch (error) {
                console.error('Error fetching receptionist stats:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Receptionist Desk</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back! Manage patient flow and bookings.</p>
                </div>
                <button
                    onClick={() => navigate('/patient/add')}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <MdAdd size={20} /> Quick Register
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard title="Total Registrations" value={counts.patients} icon={<MdPeople />} color="#2563eb" />
                <StatCard title="Booked Today" value={counts.appointments} icon={<MdCalendarToday />} color="#10b981" />
            </div>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h4 style={{ margin: 0 }}>Recent Activities</h4>
                    </div>
                    <Table
                        columns={[
                            { header: 'Patient', key: 'name' },
                            { header: 'Doctor', key: 'doctor' },
                            { header: 'Time', key: 'time' },
                            { header: 'Status', key: 'status' }
                        ]}
                        data={recentQueue}
                    />
                </div>

                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem' }}>Waiting Area Map</h4>
                    <div style={{ height: '200px', backgroundColor: 'var(--bg-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <p>Visual queue representation active</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
