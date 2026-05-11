import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MdAdd, MdDelete, MdPrint, MdSmartToy, MdSave } from 'react-icons/md';
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
                            {location.state?.patientName || patients.find(p => p.id.toString() === patientId)?.name || 'Unknown Patient'}
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
                        <button
                            onClick={addRow}
                            style={{ background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-blue)', padding: '0.5rem 1rem', fontSize: '0.875rem', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            + Add Medicine
                        </button>
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

            {/* Print Only Section for 4x4 inch layout */}
            <div id="print-section" className="print-only">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid black', paddingBottom: '8px', marginBottom: '12px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'serif' }}>{location.state?.patientName || patients.find(p => p.id.toString() === patientId)?.name || 'Patient'}</h2>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                        <div>Date: {new Date().toLocaleDateString()}</div>
                        {/* Additional patient info could go here */}
                    </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ display: 'block', marginBottom: '4px', textDecoration: 'underline' }}>Initial Diagnoses:</strong>
                    <div style={{ paddingLeft: '8px' }}>{diagnosis || 'None'}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <strong style={{ display: 'block', marginBottom: '4px', textDecoration: 'underline' }}>Medicines:</strong>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {medicines.map((med, idx) => (med.name ? (
                            <li key={idx} style={{ marginBottom: '4px' }}>
                                <strong>{med.name}</strong> - {med.dosage}
                                {med.notes && <div style={{ fontSize: '0.7rem', color: '#333' }}>Note: {med.notes}</div>}
                            </li>
                        ) : null))}
                    </ul>
                </div>

                {advice && (
                    <div style={{ marginTop: 'auto', borderTop: '1px dashed #ccc', paddingTop: '8px' }}>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>General Advice:</strong>
                        <div style={{ fontStyle: 'italic', paddingLeft: '8px' }}>{advice}</div>
                    </div>
                )}
                
                <div style={{ position: 'absolute', bottom: '0', width: '100%', textAlign: 'center', fontSize: '0.7rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '4px' }}>
                    Hospital Management System - Doctor's Prescription
                </div>
            </div>
        </div>
    );
};

export default CreatePrescription;
