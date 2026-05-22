import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdAdd, MdDelete, MdPrint, MdSmartToy, MdSave, MdVisibility, MdClose } from 'react-icons/md';
import FormInput from '../../components/FormInput';
import { toast } from 'react-toastify';
import { patientService } from '../../services/patientService';
import { prescriptionService } from '../../services/prescriptionService';

const CreatePrescription = () => {
    const location = useLocation();
    const [patientId, setPatientId] = useState('');
    const [patients, setPatients] = useState([]);
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', notes: '' }]);
    const [diagnosis, setDiagnosis] = useState('');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [patientHistory, setPatientHistory] = useState(null);
    const [showPatientInfo, setShowPatientInfo] = useState(false);

    const selectedPatient = location.state?.patientName 
        ? patients.find(p => p.name === location.state.patientName) 
        : patients.find(p => p.id?.toString() === patientId);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await patientService.getAll();
                setPatients(data || []);

                // If we came from "Treat Now", try to match the patient
                if (location.state?.patientName) {
                    const match = data.find(p => p.name === location.state.patientName);
                    if (match) setPatientId(match.id.toString());
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchPatients();
    }, [location.state]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (patientId) {
                try {
                    const history = await patientService.getMedicalHistory ? await patientService.getMedicalHistory(patientId) : await patientService.getHistory(patientId);
                    setPatientHistory(history);
                } catch (error) {
                    console.error('Error fetching patient history:', error);
                }
            } else {
                setPatientHistory(null);
            }
        };
        fetchHistory();
    }, [patientId]);

    const addRow = () => {
        setMedicines([...medicines, { name: '', dosage: '', notes: '' }]);
    };

    const removeRow = (index) => {
        const newMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(newMedicines);
    };

    const handleMedChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const handleAISuggest = () => {
        if (!diagnosis) {
            toast.warning('Please enter a diagnosis first for AI to analyze.');
            return;
        }
        toast.info('AI is analyzing diagnosis and suggesting medicines...');
        setTimeout(() => {
            setMedicines([
                { name: 'Amoxicillin', dosage: '500mg - 3 times daily', notes: 'Finish full course' },
                { name: 'Paracetamol', dosage: '500mg - When needed', notes: 'For fever/pain' }
            ]);
            toast.success('AI Suggestions Applied!');
        }, 1500);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!patientId || !diagnosis) {
            toast.error('Please select a patient and enter a diagnosis.');
            return;
        }
        setLoading(true);
        try {
            const prescriptionData = {
                patientId,
                diagnosis,
                medicines,
                advice,
                date: new Date().toISOString()
            };
            await prescriptionService.create(prescriptionData);
            toast.success('Prescription saved successfully!');
            window.print();
        } catch (error) {
            toast.error('Failed to save prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Create Prescription</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Generate medical prescription for patients</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleAISuggest}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: 'var(--accent-green)',
                            color: 'white',
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        <MdSmartToy /> AI Assistant
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', background: 'white' }}
                        onClick={() => window.print()}
                    >
                        <MdPrint /> Print
                    </button>
                    <button
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : <><MdSave /> Save & Print</>}
                    </button>
                </div>
            </div>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem' }}>Patient Details</h4>
                    <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>Patient Name</span>
                        <strong style={{ fontSize: '1.1rem' }}>
                            {selectedPatient?.name || 'Unknown Patient'}
                        </strong>
                    </div>
                    <FormInput
                        label="Initial Diagnosis"
                        type="textarea"
                        name="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Describe the condition..."
                        required
                    />
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: 0 }}>Medicines & Dosage</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => selectedPatient ? setShowPatientInfo(true) : toast.info('Please select a patient first')}
                                style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                title="View Patient Details"
                            >
                                <MdVisibility size={16} /> View Info
                            </button>
                            <button
                                onClick={addRow}
                                style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                            >
                                + Add Medicine
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Medicine Name</th>
                                    <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Dosage</th>
                                    <th style={{ padding: '0.75rem', fontSize: '0.875rem' }}>Notes</th>
                                    <th style={{ padding: '0.75rem', width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((med, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid var(--bg-light)' }}>
                                        <td style={{ padding: '0.5rem' }}>
                                            <input
                                                value={med.name}
                                                onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                                                placeholder="e.g. Paracetamol"
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <input
                                                value={med.dosage}
                                                onChange={(e) => handleMedChange(index, 'dosage', e.target.value)}
                                                placeholder="e.g. 1-0-1 After food"
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <input
                                                value={med.notes}
                                                onChange={(e) => handleMedChange(index, 'notes', e.target.value)}
                                                placeholder="Notes..."
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                                            />
                                        </td>
                                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => removeRow(index)}
                                                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                                                disabled={medicines.length === 1}
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                        <FormInput
                            label="General Advice"
                            type="textarea"
                            value={advice}
                            onChange={(e) => setAdvice(e.target.value)}
                            placeholder="e.g. Drink plenty of water, avoid cold items..."
                        />
                    </div>
                </div>
            </div>

            {/* Print Only Section - Professional A4 Medical Report */}
            <div id="print-section" className="print-only" style={{ fontFamily: 'Arial, sans-serif', color: '#000', background: '#fff', padding: '0' }}>

                {/* ══════════ HOSPITAL HEADER ══════════ */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #2e7d5e', paddingBottom: '12px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '22pt', fontWeight: '700', color: '#2e7d5e', letterSpacing: '1px', fontFamily: 'Georgia, serif' }}>
                        ♡ MediCare Pro
                    </div>
                    <div style={{ fontSize: '9pt', color: '#555', marginTop: '2px' }}>
                        123 Health Avenue, Medical City | Tel: +92-300-0000000 | info@medicare-pro.com
                    </div>
                </div>

                {/* ══════════ MEDICAL REPORT TITLE ══════════ */}
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '16pt', fontWeight: '800', letterSpacing: '3px', margin: 0, color: '#111' }}>MEDICAL REPORT</h2>
                </div>

                {/* ══════════ VISIT INFO ══════════ */}
                <div className="print-section-block" style={{ marginBottom: '10px' }}>
                    <div style={{ color: '#2e7d5e', fontWeight: '700', fontSize: '11pt', marginBottom: '5px', borderBottom: '1px solid #2e7d5e', paddingBottom: '2px' }}>
                        Visit Info
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '2px 8px 2px 0', width: '25%' }}><strong>Doctor's Name:</strong></td>
                                <td style={{ padding: '2px 0', width: '35%' }}>Dr. (Attending Physician)</td>
                                <td style={{ padding: '2px 8px 2px 0', width: '18%' }}><strong>Visit Date:</strong></td>
                                <td style={{ padding: '2px 0' }}>{new Date().toLocaleDateString('en-GB').replace(/\//g, '.')}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px 8px 2px 0' }}><strong>Specialization:</strong></td>
                                <td style={{ padding: '2px 0' }}>General Medicine</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ══════════ PATIENT INFO ══════════ */}
                <div className="print-section-block" style={{ marginBottom: '10px' }}>
                    <div style={{ color: '#2e7d5e', fontWeight: '700', fontSize: '11pt', marginBottom: '5px', borderBottom: '1px solid #2e7d5e', paddingBottom: '2px' }}>
                        Patient Info
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '2px 8px 2px 0', width: '22%' }}><strong>Full Name:</strong></td>
                                <td style={{ padding: '2px 0', width: '28%' }}>{selectedPatient?.name || 'N/A'}</td>
                                <td style={{ padding: '2px 8px 2px 0', width: '22%' }}><strong>Age / Gender:</strong></td>
                                <td style={{ padding: '2px 0' }}>{selectedPatient?.age || 'N/A'} / {selectedPatient?.gender || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px 8px 2px 0' }}><strong>Blood Group:</strong></td>
                                <td style={{ padding: '2px 0' }}>{selectedPatient?.bloodGroup || 'N/A'}</td>
                                <td style={{ padding: '2px 8px 2px 0' }}><strong>Phone:</strong></td>
                                <td style={{ padding: '2px 0' }}>{selectedPatient?.contact || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px 8px 2px 0' }}><strong>Email:</strong></td>
                                <td style={{ padding: '2px 0' }}>{selectedPatient?.email || 'N/A'}</td>
                                <td style={{ padding: '2px 8px 2px 0' }}><strong>Emg. Contact:</strong></td>
                                <td style={{ padding: '2px 0' }}>{selectedPatient?.emergencyContact || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '2px 8px 2px 0' }}><strong>Address:</strong></td>
                                <td colSpan={3} style={{ padding: '2px 0' }}>{selectedPatient?.address || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ══════════ DIAGNOSIS / ASSESSMENT ══════════ */}
                <div className="print-section-block" style={{ marginBottom: '10px' }}>
                    <div style={{ color: '#2e7d5e', fontWeight: '700', fontSize: '11pt', marginBottom: '5px', borderBottom: '1px solid #2e7d5e', paddingBottom: '2px' }}>
                        Diagnosis
                    </div>
                    <p style={{ margin: 0, fontSize: '10pt', lineHeight: '1.5' }}>
                        {diagnosis || 'No diagnosis provided.'}
                    </p>
                </div>

                {/* ══════════ PRESCRIPTION ══════════ */}
                <div className="print-section-block" style={{ marginBottom: '10px' }}>
                    <div style={{ color: '#2e7d5e', fontWeight: '700', fontSize: '11pt', marginBottom: '5px', borderBottom: '1px solid #2e7d5e', paddingBottom: '2px' }}>
                        Prescription
                    </div>
                    {medicines.filter(m => m.name).length > 0 ? (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt' }}>
                            <thead>
                                <tr style={{ background: '#f0f7f4' }}>
                                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ccc', width: '30%' }}>Medicine</th>
                                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ccc', width: '30%' }}>Dosage</th>
                                    <th style={{ padding: '4px 6px', textAlign: 'left', border: '1px solid #ccc' }}>Notes / Instructions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map((med, idx) => med.name ? (
                                    <tr key={idx}>
                                        <td style={{ padding: '4px 6px', border: '1px solid #ddd', fontWeight: '600' }}>{med.name}</td>
                                        <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{med.dosage || '—'}</td>
                                        <td style={{ padding: '4px 6px', border: '1px solid #ddd' }}>{med.notes || '—'}</td>
                                    </tr>
                                ) : null)}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ margin: 0, fontSize: '10pt' }}>No prescription required at this time.</p>
                    )}
                </div>

                {/* ══════════ GENERAL ADVICE ══════════ */}
                {advice && (
                    <div className="print-section-block" style={{ marginBottom: '10px' }}>
                        <div style={{ color: '#2e7d5e', fontWeight: '700', fontSize: '11pt', marginBottom: '5px', borderBottom: '1px solid #2e7d5e', paddingBottom: '2px' }}>
                            General Advice
                        </div>
                        <p style={{ margin: 0, fontSize: '10pt', lineHeight: '1.5', fontStyle: 'italic' }}>{advice}</p>
                    </div>
                )}

                {/* ══════════ SIGNATURE ══════════ */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px', marginBottom: '10px' }}>
                    <div style={{ textAlign: 'center', minWidth: '160px' }}>
                        <div style={{ borderTop: '1px solid #333', paddingTop: '4px', fontSize: '9pt', color: '#444' }}>
                            Authorized Signature
                        </div>
                    </div>
                </div>

                {/* ══════════ FOOTER ══════════ */}
                <div style={{ borderTop: '1px solid #ccc', paddingTop: '6px', textAlign: 'center', fontSize: '8pt', color: '#666' }}>
                    <div>For inquiries and appointments, feel free to contact us.</div>
                    <div>Phone: +92-300-0000000 | Email: info@medicare-pro.com | www.medicare-pro.com</div>
                </div>

            </div>

            {/* Patient Info Modal */}
            {showPatientInfo && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white', width: '90%', maxWidth: '800px', 
                        maxHeight: '90vh', borderRadius: '12px', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-light)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MdVisibility color="var(--primary-blue)" /> Patient Medical Profile
                            </h3>
                            <button 
                                onClick={() => setShowPatientInfo(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                            >
                                <MdClose size={24} color="var(--text-muted)" />
                            </button>
                        </div>
                        
                        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: '8px' }}>
                                <div><span style={{ color: 'var(--text-muted)' }}>Name:</span> <strong>{selectedPatient?.name}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Age/Gender:</span> <strong>{selectedPatient?.age} / {selectedPatient?.gender}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Contact:</span> <strong>{selectedPatient?.contact}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Blood Group:</span> <strong>{selectedPatient?.bloodGroup || 'Not specified'}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> <strong>{selectedPatient?.email || 'N/A'}</strong></div>
                                <div><span style={{ color: 'var(--text-muted)' }}>Emergency:</span> <strong>{selectedPatient?.emergencyContact || 'N/A'}</strong></div>
                                <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-muted)' }}>Address:</span> <strong>{selectedPatient?.address}</strong></div>
                            </div>

                            {patientHistory ? (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div>
                                        <h4 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Appointments</h4>
                                        {patientHistory.appointments?.length > 0 ? (
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {patientHistory.appointments.map((apt, i) => (
                                                    <li key={i} style={{ padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', marginBottom: '0.5rem' }}>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{new Date(apt.date).toLocaleDateString()} - <span style={{ color: apt.status === 'completed' ? 'green' : 'orange' }}>{apt.status}</span></div>
                                                        <div><strong>Reason:</strong> {apt.reason || apt.checkup || 'Routine checkup'}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p style={{ color: 'var(--text-muted)' }}>No previous appointments.</p>}
                                    </div>
                                    
                                    <div>
                                        <h4 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Prescriptions & Diagnoses</h4>
                                        {patientHistory.prescriptions?.length > 0 || patientHistory.diagnosisLogs?.length > 0 ? (
                                            <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-color)' }}>
                                                {patientHistory.timeline?.map((item, i) => (
                                                    <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                                                        <div style={{ position: 'absolute', left: '-1.85rem', top: '0.25rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-blue)' }}></div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(item.date).toLocaleDateString()} - {item.type.toUpperCase()}</div>
                                                        {item.type === 'prescription' && (
                                                            <div style={{ background: 'var(--bg-light)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                                                                <strong>{item.data.diagnosis}</strong>
                                                                <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                                                    {item.data.medicines?.length} medicines prescribed
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.type === 'appointment' && (
                                                            <div style={{ background: 'var(--bg-light)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem' }}>
                                                                Checkup: {item.data.reason || item.data.checkup}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p style={{ color: 'var(--text-muted)' }}>No medical history.</p>}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading history...</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePrescription;
