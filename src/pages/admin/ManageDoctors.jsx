import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdStar } from 'react-icons/md';
import Table from '../../components/Table';
import { authService } from '../../services/authService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const ManageDoctors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const users = await authService.getAll();
            const doctorList = Array.isArray(users) ? users.filter(u => u.role === 'doctor') : [];

            const formattedDoctors = doctorList.map((d) => ({
                id: d._id || d.id,
                name: d.name,
                email: d.email,
                specializations: d.specialization || 'Medical Specialist',
                experience: d.experience || 'Not specified',
                rating: 5.0,
                status: 'Active'
            }));

            setDoctors(formattedDoctors);
        } catch (error) {
            toast.error('Failed to fetch doctors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specializations.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Doctor Name', key: 'name', render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--primary-blue)' }}>
                        {row.name.split(' ').map(n => n.startsWith('Dr.') ? '' : n[0]).join('')}
                    </div>
                    <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{row.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.specializations}</span>
                    </div>
                </div>
            )
        },
        { header: 'Experience', key: 'experience' },
        {
            header: 'Rating', key: 'rating', render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                    <MdStar /> {row.rating.toFixed(1)}
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
                    backgroundColor: row.status === 'Available' ? 'rgba(16, 185, 129, 0.1)' : row.status === 'Busy' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    color: row.status === 'Available' ? 'var(--success)' : row.status === 'Busy' ? 'var(--error)' : 'var(--text-muted)'
                }}>
                    {row.status}
                </span>
            )
        },
    ];

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Manage Doctors</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Recruit, observe and manage medical staff</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdAdd size={20} /> Add New Doctor
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
                    <div style={{
                        flex: 1,
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
                            placeholder="Search doctors by name, specialty..."
                            style={{ border: 'none', background: 'transparent', width: '100%', paddingLeft: '0.5rem', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredDoctors}
                    actions={(row) => (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{ background: 'none', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}><MdEdit size={18} /></button>
                            <button style={{ background: 'none', color: 'var(--error)', border: 'none', cursor: 'pointer' }}><MdDelete size={18} /></button>
                        </div>
                    )}
                />

                {filteredDoctors.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No doctors found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageDoctors;
