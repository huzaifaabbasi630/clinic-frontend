import React, { useState, useEffect } from 'react';
import { MdAdd, MdSearch, MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { patientService } from '../../services/patientService';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const ManagePatients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await patientService.getAll();
            setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Failed to fetch patients');
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient record?')) {
            try {
                await patientService.delete(id);
                toast.success('Patient deleted successfully');
                fetchPatients();
            } catch (error) {
                toast.error('Failed to delete patient');
            }
        }
    };

    const filteredPatients = (Array.isArray(patients) ? patients : []).filter(p =>
        p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p?.contact?.includes(searchTerm)
    );

    const columns = [
        {
            header: 'Patient Name', key: 'name', render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: 'var(--primary-blue)', fontSize: '0.75rem' }}>
                        {row?.name ? row.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'P'}
                    </div>
                    <span style={{ fontWeight: 500 }}>{row?.name || 'Unknown Patient'}</span>
                </div>
            )
        },
        { header: 'Age', key: 'age' },
        { header: 'Gender', key: 'gender' },
        { header: 'Contact', key: 'contact' },
        {
            header: 'Status', key: 'status', render: (row) => (
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: row.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: row.status === 'Active' ? 'var(--success)' : '#f59e0b'
                }}>
                    {row.status}
                </span>
            )
        },
    ];

    const actions = (row) => {
        const patientId = row.id || row._id;
        return (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={() => navigate(`/patient/${patientId}`)}
                    style={{ background: 'none', color: 'var(--primary-blue)', border: 'none', cursor: 'pointer', padding: '4px' }}
                    title="View"
                >
                    <MdVisibility size={18} />
                </button>
                <button
                    onClick={() => navigate(`/patient/edit/${patientId}`)}
                    style={{ background: 'none', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', padding: '4px' }}
                    title="Edit"
                >
                    <MdEdit size={18} />
                </button>
                <button
                    onClick={() => handleDelete(patientId)}
                    style={{ background: 'none', color: 'var(--error)', border: 'none', cursor: 'pointer', padding: '4px' }}
                    title="Delete"
                >
                    <MdDelete size={18} />
                </button>
            </div>
        );
    };

    if (loading) return <Loader />;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Manage Patients</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Search and manage patient registrations</p>
                </div>
                <button
                    onClick={() => navigate('/patient/add')}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <MdAdd size={20} /> Add New Patient
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
                            placeholder="Search patients by name or contact..."
                            style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', paddingLeft: '0.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table columns={columns} data={filteredPatients} actions={actions} />

                {filteredPatients.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No patients found matching your search.
                    </div>
                )}

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    <span>Showing {filteredPatients.length} entries</span>
                </div>
            </div>
        </div>
    );
};

export default ManagePatients;
