import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdHistory, MdAssignment, MdVisibility, MdEvent, MdArrowBack } from 'react-icons/md';
import Table from '../../components/Table';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [patient, setPatient] = useState(null);
    const [historyData, setHistoryData] = useState({ appointments: [], prescriptions: [], timeline: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const [patientRes, historyRes] = await Promise.all([
                    patientService.getById(id),
                    patientService.getHistory(id)
                ]);

                if (patientRes) {
                    setPatient(patientRes);
                } else {
                    toast.error('Patient not found');
                    navigate('/patients');
                }

                if (historyRes) {
                    setHistoryData(historyRes);
                }
            } catch (error) {
                toast.error('Error fetching patient data');
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id, navigate]);

    const tabs = ['Overview', 'Appointment History', 'Prescription History', 'Diagnosis Timeline'];

    if (loading) return <Loader fullScreen />;
    if (!patient) return null;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}
            >
                <MdArrowBack /> Back to Patients
            </button>

            <div className="card" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                    {patient.name?.split(' ').map(n => n[0]).join('') || 'P'}
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>{patient.name || 'Unknown'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ID: {patient._id} | Age: {patient.age || 'N/A'} | Gender: {patient.gender || 'N/A'}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '0.875rem' }}><strong>Blood:</strong> {patient.bloodGroup || 'N/A'}</span>
                        <span style={{ fontSize: '0.875rem' }}><strong>Contact:</strong> {patient.contact || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '1rem',
                            background: 'none',
                            color: activeTab === tab ? 'var(--primary-blue)' : 'var(--text-muted)',
                            borderBottom: activeTab === tab ? '3px solid var(--primary-blue)' : '3px solid transparent',
                            borderRadius: 0,
                            fontWeight: activeTab === tab ? 600 : 400,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="fade-in">
                {activeTab === 'Overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        <div className="card">
                            <h4 style={{ marginBottom: '1rem' }}>Contact Information</h4>
                            <p><strong>Email:</strong> {patient.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> {patient.contact}</p>
                            <p><strong>Address:</strong> {patient.address}</p>
                        </div>
                        <div className="card">
                            <h4 style={{ marginBottom: '1rem' }}>Emergency Contact</h4>
                            <p>{patient.emergencyContact || 'No emergency contact provided'}</p>
                        </div>
                    </div>
                )}

                {activeTab === 'Appointment History' && (
                    <Table
                        columns={[
                            { header: 'Date', key: 'date' },
                            { header: 'Doctor', key: 'doctor' },
                            { header: 'Reason', key: 'reason' },
                            { header: 'Status', key: 'status' }
                        ]}
                        data={historyData.appointments.map(a => ({
                            date: new Date(a.date).toLocaleDateString(),
                            doctor: a.doctorId?.name || 'N/A',
                            reason: a.reason || 'Checkup',
                            status: a.status
                        }))}
                    />
                )}

                {activeTab === 'Prescription History' && (
                    <Table
                        columns={[
                            { header: 'Date', key: 'date' },
                            { header: 'Medicine', key: 'medicine' },
                            { header: 'Dosage', key: 'dosage' },
                            { header: 'Duration', key: 'duration' }
                        ]}
                        data={historyData.prescriptions.map(p => ({
                            date: new Date(p.createdAt).toLocaleDateString(),
                            medicine: p.medicines.map(m => m.name).join(', '),
                            dosage: p.medicines.map(m => m.dosage).join(', '),
                            duration: p.instructions || 'N/A'
                        }))}
                    />
                )}

                {activeTab === 'Diagnosis Timeline' && (
                    <div className="card">
                        <div style={{ position: 'relative', paddingLeft: '2rem', marginTop: '1rem' }}>
                            <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '2px', backgroundColor: 'var(--border-color)' }}></div>
                            {historyData.timeline.length > 0 ? historyData.timeline.map((item, i) => (
                                <div key={i} style={{ position: 'relative', marginBottom: '2rem' }}>
                                    <div style={{ position: 'absolute', left: '-2.4rem', top: '0.2rem', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary-blue)', border: '3px solid white' }}></div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600, margin: 0 }}>{new Date(item.date).toLocaleDateString()}</p>
                                    <h5 style={{ margin: '0.25rem 0', textTransform: 'capitalize' }}>{item.type}: {item.data?.reason || item.data?.instructions || 'Medical Entry'}</h5>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        {item.type === 'prescription' ? `Medicines: ${item.data.medicines.map(m => m.name).join(', ')}` : 
                                         item.type === 'appointment' ? `Doctor: ${item.data.doctorId?.name || 'N/A'} | Status: ${item.data.status}` : 
                                         `Diagnosis result: ${item.data.aiResponse?.analysis || 'Logged'}`}
                                    </p>
                                </div>
                            )) : (
                                <p style={{ color: 'var(--text-muted)' }}>No medical history found for this patient.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientProfile;
