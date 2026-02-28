import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    MdDashboard,
    MdPeople,
    MdPerson,
    MdEvent,
    MdAnalytics,
    MdMedicalServices,
    MdAssignment,
    MdHistory,
    MdInfo
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user } = useAuth();
    const role = (user?.role || 'admin').toLowerCase();

    const menuItems = {
        admin: [
            { path: '/admin/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
            { path: '/patients', icon: <MdPeople />, label: 'Patients' },
            { path: '/admin/doctors', icon: <MdMedicalServices />, label: 'Manage Doctors' },
            { path: '/admin/appointments', icon: <MdEvent />, label: 'Appointments' },
            { path: '/admin/analytics', icon: <MdAnalytics />, label: 'Analytics' },
        ],
        doctor: [
            { path: '/doctor/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
            { path: '/patients', icon: <MdPeople />, label: 'Patients' },
            { path: '/doctor/prescription', icon: <MdAssignment />, label: 'Prescription' },
            { path: '/doctor/appointments', icon: <MdEvent />, label: 'My Appointments' },
        ],
        receptionist: [
            { path: '/receptionist/dashboard', icon: <MdDashboard />, label: 'Dashboard' },
            { path: '/patients', icon: <MdPeople />, label: 'Patients' },
            { path: '/receptionist/book', icon: <MdEvent />, label: 'Book Appointment' },
        ],
    };

    const commonItems = [
        { path: '/symptom-check', icon: <MdInfo />, label: 'AI Symptom Checker' },
    ];

    const items = [...(menuItems[role] || []), ...commonItems];

    const sidebarStyle = {
        width: isOpen ? '260px' : '80px',
        backgroundColor: 'white',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        boxShadow: 'var(--shadow-lg)',
        transition: 'width 0.3s ease',
        overflowX: 'hidden',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column'
    };

    const logoStyle = {
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1rem'
    };

    return (
        <aside style={sidebarStyle}>
            <div style={logoStyle}>
                <div style={{ background: 'var(--primary-blue)', color: 'white', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
                    <MdMedicalServices size={24} />
                </div>
                {isOpen && <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary-blue)', whiteSpace: 'nowrap' }}>HOSPITAL PRO</span>}
            </div>

            <nav style={{ flex: 1, padding: '0 0.75rem' }}>
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.875rem 1rem',
                            borderRadius: '8px',
                            color: isActive ? 'var(--primary-blue)' : 'var(--text-muted)',
                            backgroundColor: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.5rem',
                            fontWeight: isActive ? 600 : 400,
                            transition: 'all 0.2s',
                        })}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                        {isOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {isOpen && (
                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <p>Logged in as:</p>
                    <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{user?.name || 'User'}</p>
                    <span style={{ textTransform: 'capitalize' }}>{role}</span>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
