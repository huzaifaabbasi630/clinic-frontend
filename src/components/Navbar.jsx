import React, { useState } from 'react';
import { MdMenu, MdNotifications, MdAccountCircle, MdLogout, MdSearch, MdChevronLeft } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navStyle = {
        height: '70px',
        backgroundColor: 'white',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky',
        top: 0,
        zIndex: 90
    };

    const searchContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-light)',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        width: '300px',
        border: '1px solid var(--border-color)'
    };

    const profileDropdownStyle = {
        position: 'absolute',
        top: '60px',
        right: '0',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-lg)',
        width: '200px',
        padding: '0.5rem',
        border: '1px solid var(--border-color)',
        display: dropdownOpen ? 'block' : 'none'
    };

    return (
        <header style={navStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none',
                        fontSize: '1.5rem',
                        color: 'var(--text-muted)',
                        display: 'flex'
                    }}
                >
                    {isSidebarOpen ? <MdMenu /> : <MdMenu />}
                </button>

                <div className="search-box" style={searchContainerStyle}>
                    <MdSearch size={20} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search patients, doctors..."
                        style={{
                            border: 'none',
                            background: 'transparent',
                            padding: '0 0.5rem',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <MdNotifications size={24} />
                    <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        background: 'var(--error)',
                        color: 'white',
                        fontSize: '10px',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        3
                    </span>
                </div>

                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            transition: 'var(--transition)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{user?.name || 'Admin User'}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'capitalize' }}>{user?.role || 'Administrator'}</p>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: 'var(--primary-blue)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <MdAccountCircle size={28} />
                        </div>
                    </div>

                    <div style={profileDropdownStyle}>
                        <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.email || 'admin@hospital.com'}</p>
                        </div>
                        <button
                            onClick={() => { }}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '0.6rem 1rem',
                                background: 'none',
                                color: 'var(--text-main)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '6px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <MdAccountCircle /> Profile Settings
                        </button>
                        <button
                            onClick={logout}
                            style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '0.6rem 1rem',
                                background: 'none',
                                color: 'var(--error)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderRadius: '6px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <MdLogout /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
