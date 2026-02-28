import React, { useState, useEffect } from 'react';
import { MdSearch, MdEventAvailable, MdHistory, MdMedicalServices, MdVisibility, MdAssignment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const MyAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const data = await appointmentService.getAll();
                // If data is from real backend, it should have been normalized by the service
                setAppointments(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error('Failed to fetch appointments');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(appt =>
        appt?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt?.patient?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>My Schedule</h2>
                    <p style={{ color: 'var(--text-muted)' }}>View and manage your appointments for today</p>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-light)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        maxWidth: '400px'
                    }}>
                        <MdSearch color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', paddingLeft: '0.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={[
                        { header: 'Patient', key: 'name', render: (row) => row.name || row.patient },
                        { header: 'Reason', key: 'type', render: (row) => row.type || row.reason },
                        { header: 'Time', key: 'time' },
                        {
                            header: 'Status', key: 'status', render: (row) => (
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    backgroundColor: row.status === 'Waiting' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                                    color: row.status === 'Waiting' ? '#f59e0b' : 'var(--primary-blue)'
                                }}>
                                    {row.status}
                                </span>
                            )
                        }
                    ]}
                    data={filteredAppointments}
                    actions={(row) => (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => navigate('/doctor/prescription', { state: { patientName: row.name || row.patient } })}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    color: 'var(--success)',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600
                                }}
                            >
                                <MdAssignment size={14} /> Treat
                            </button>
                            <button
                                onClick={() => navigate(`/patient/${row.id}`)}
                                style={{
                                    background: 'none',
                                    color: 'var(--primary-blue)',
                                    fontSize: '0.8rem',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Profile
                            </button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default MyAppointments;
