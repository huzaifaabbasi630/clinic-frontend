import React from 'react';
import { MdPrint, MdShare, MdDownload, MdMedicalServices } from 'react-icons/md';

const PrescriptionDetails = () => {
    const data = {
        id: 'RX-7721',
        date: '2024-03-05',
        patient: { name: 'John Doe', age: 45, gender: 'Male' },
        doctor: { name: 'Dr. Sarah Smith', specialty: 'General Physician' },
        diagnosis: 'Bacterial Sinusitis',
        medicines: [
            { name: 'Amoxicillin', dosage: '500mg', instructions: '1 capsule 3 times daily after food', duration: '7 days' },
            { name: 'Paracetamol', dosage: '500mg', instructions: '1 tablet as needed for fever', duration: '3 days' }
        ],
        advice: 'Drink plenty of warm fluids. Avoid cold drinks. Complete the full course of antibiotics.'
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '1.5rem' }}>
                <button style={{ background: 'white', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdDownload /> Download PDF
                </button>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MdPrint /> Print
                </button>
            </div>

            <div className="card" style={{ padding: '3rem', borderTop: '8px solid var(--primary-blue)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '2px solid var(--bg-light)', paddingBottom: '1rem' }}>
                    <div>
                        <h2 style={{ color: 'var(--primary-blue)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MdMedicalServices /> HOSPITAL PRO
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>123 Medical Avenue, Healthcare City</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h4 style={{ margin: 0 }}>PRESCRIPTION</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: {data.id} | Date: {data.date}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PATIENT DETAILS</h5>
                        <p><strong>{data.patient.name}</strong></p>
                        <p style={{ fontSize: '0.875rem' }}>{data.patient.age} Years, {data.patient.gender}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DOCTOR</h5>
                        <p><strong>{data.doctor.name}</strong></p>
                        <p style={{ fontSize: '0.875rem' }}>{data.doctor.specialty}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>DIAGNOSIS</h5>
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-light)', borderRadius: '8px' }}>
                        <p style={{ margin: 0 }}>{data.diagnosis}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h5 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>MEDICINES</h5>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem 0' }}>Medicine Name</th>
                                <th style={{ padding: '0.75rem 0' }}>Dosage</th>
                                <th style={{ padding: '0.75rem 0' }}>Instructions</th>
                                <th style={{ padding: '0.75rem 0' }}>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.medicines.map((med, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--bg-light)' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: 600 }}>{med.name}</td>
                                    <td style={{ padding: '1rem 0' }}>{med.dosage}</td>
                                    <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{med.instructions}</td>
                                    <td style={{ padding: '1rem 0' }}>{med.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>GENERAL ADVICE</h5>
                    <p style={{ fontSize: '0.875rem' }}>{data.advice}</p>
                </div>

                <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <p>Generated by Hospital Pro SaaS</p>
                        <p>Visit: www.hospitalpro.com</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '150px', borderTop: '1px solid var(--text-main)', paddingTop: '0.5rem' }}>
                            <p style={{ fontSize: '0.875rem', margin: 0 }}>Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionDetails;
