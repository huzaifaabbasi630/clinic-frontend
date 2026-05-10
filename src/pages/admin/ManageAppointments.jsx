import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdEventAvailable, MdHistory } from 'react-icons/md';
import Table from '../../components/Table';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const data = await appointmentService.getAll();
                setAppointments(data);
            } catch (error) {
                toast.error('Failed to fetch appointments');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Patient', key: 'patient' },
        { header: 'Doctor', key: 'doctor' },
        {
            header: 'Date & Time', key: 'date', render: (row) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{new Date(row.date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.time}</div>
                </div>
            )
        },
        {
            header: 'Status', key: 'status', render: (row) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor:
                        ['Confirmed', 'confirmed', 'Scheduled', 'scheduled'].includes(row.status) ? 'rgba(37, 99, 235, 0.1)' :
                            ['Completed', 'completed'].includes(row.status) ? 'rgba(16, 185, 129, 0.1)' :
                                ['Cancelled', 'cancelled'].includes(row.status) ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color:
                        ['Confirmed', 'confirmed', 'Scheduled', 'scheduled'].includes(row.status) ? 'var(--primary-blue)' :
                            ['Completed', 'completed'].includes(row.status) ? 'var(--success)' :
                                ['Cancelled', 'cancelled'].includes(row.status) ? 'var(--error)' : '#f59e0b'
                }}>
                    {row.status}
                </span>
            )
        },
    ];

    if (loading) return <Loader />;

    const filtered = appointments.filter(a => 
        a.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Manage Appointments</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor and schedule system-wide visits</p>
                </div>
                <button 
                    onClick={() => navigate('/receptionist/book')} 
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <MdAdd size={20} /> New Appointment
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{
                        flex: 1,
                        minWidth: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-light)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <MdSearch color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Search appointments..." 
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', paddingLeft: '0.5rem' }} 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filtered}
                    actions={(row) => (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                onClick={() => navigate(`/patient/${row.patientId?._id || row.patientId}`)}
                                style={{ background: 'none', color: 'var(--primary-blue)', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
                            >
                                View Patient
                            </button>
                        </div>
                    )}
                />
                
                {filtered.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No appointments found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
