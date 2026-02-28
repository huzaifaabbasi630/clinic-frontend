import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="main-content" style={{
                flex: 1,
                marginLeft: sidebarOpen ? '260px' : '80px',
                transition: 'margin 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

                <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <div className="fade-in">
                        <Outlet />
                    </div>
                </main>

                <footer style={{ padding: '1rem 2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} Hospital Management SaaS. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
