import React, { useState } from 'react';
import { MdAdd, MdSearch, MdEventAvailable, MdHistory } from 'react-icons/md';
import Table from '../../components/Table';

const ManageAppointments = () => {
    const appointments = [
        { id: 'APP001', patient: 'John Doe', doctor: 'Dr. Sarah Smith', date: '2024-03-05', time: '10:30 AM', status: 'Confirmed' },
        { id: 'APP002', patient: 'Jane Smith', doctor: 'Dr. James Wilson', date: '2024-03-05', time: '11:15 AM', status: 'Pending' },
        { id: 'APP003', patient: 'Robert Johnson', doctor: 'Dr. Michael Chen', date: '2024-03-06', time: '09:00 AM', status: 'Completed' },
        { id: 'APP004', patient: 'Sarah Wilson', doctor: 'Dr. Emily Brown', date: '2024-03-06', time: '02:30 PM', status: 'Cancelled' },
    ];

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Patient', key: 'patient' },
        { header: 'Doctor', key: 'doctor' },
        {
            header: 'Date & Time', key: 'date', render: (row) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{row.date}</div>
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
                        row.status === 'Confirmed' ? 'rgba(37, 99, 235, 0.1)' :
                            row.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' :
                                row.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color:
                        row.status === 'Confirmed' ? 'var(--primary-blue)' :
                            row.status === 'Completed' ? 'var(--success)' :
                                row.status === 'Cancelled' ? 'var(--error)' : '#f59e0b'
                }}>
                    {row.status}
                </span>
            )
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Manage Appointments</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor and schedule system-wide visits</p>
                </div>
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                        <input type="text" placeholder="Search appointments..." style={{ border: 'none', background: 'transparent' }} />
                    </div>
                    <select style={{ width: 'auto' }}>
                        <option>All Status</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Cancelled</option>
                    </select>
                    <input type="date" style={{ width: 'auto' }} />
                </div>

                <Table
                    columns={columns}
                    data={appointments}
                    actions={(row) => (
                        <>
                            <button style={{ background: 'none', color: 'var(--primary-blue)' }}>Update</button>
                        </>
                    )}
                />
            </div>
        </div>
    );
};

export default ManageAppointments;
