import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRole = user?.role?.toLowerCase();

    if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
        // Redirect to respective dashboard if role doesn't match
        const dashboardMap = {
            admin: '/admin/dashboard',
            doctor: '/doctor/dashboard',
            receptionist: '/receptionist/dashboard'
        };
        const dashboard = dashboardMap[userRole] || '/login';
        if (location.pathname !== dashboard) {
            return <Navigate to={dashboard} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
