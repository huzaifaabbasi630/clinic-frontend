import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePatients from './pages/admin/ManagePatients';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageAppointments from './pages/admin/ManageAppointments';
import Analytics from './pages/admin/Analytics';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import MyAppointments from './pages/doctor/MyAppointments';
import CreatePrescription from './pages/doctor/CreatePrescription';

// Receptionist Pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import BookAppointment from './pages/receptionist/BookAppointment';

// Shared Pages
import SymptomChecker from './pages/shared/SymptomChecker';
import PatientProfile from './pages/shared/PatientProfile';
import AddEditPatient from './pages/shared/AddEditPatient';
import PrescriptionDetails from './pages/shared/PrescriptionDetails';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Dashboard Routes */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin']}><ManageDoctors /></ProtectedRoute>} />
                    <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><ManageAppointments /></ProtectedRoute>} />
                    <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><Analytics /></ProtectedRoute>} />

                    {/* Doctor Routes */}
                    <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
                    <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><MyAppointments /></ProtectedRoute>} />
                    <Route path="/doctor/prescription" element={<ProtectedRoute allowedRoles={['doctor']}><CreatePrescription /></ProtectedRoute>} />

                    {/* Receptionist Routes */}
                    <Route path="/receptionist/dashboard" element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionistDashboard /></ProtectedRoute>} />
                    <Route path="/receptionist/book" element={<ProtectedRoute allowedRoles={['receptionist']}><BookAppointment /></ProtectedRoute>} />

                    {/* Shared Routes */}
                    <Route path="/patients" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'receptionist']}><ManagePatients /></ProtectedRoute>} />
                    <Route path="/symptom-check" element={<SymptomChecker />} />
                    <Route path="/patient/:id" element={<PatientProfile />} />
                    <Route path="/patient/edit/:id" element={<AddEditPatient />} />
                    <Route path="/patient/add" element={<AddEditPatient />} />
                    <Route path="/prescription/:id" element={<PrescriptionDetails />} />

                    {/* Default Route */}
                    <Route path="/" element={<HomeRedirect />} />
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AuthProvider>
    );
};

const HomeRedirect = () => {
    const { user, isAuthenticated } = useAuth();
    if (isAuthenticated && user) {
        const role = user.role?.toLowerCase();
        if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (role === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
        if (role === 'receptionist') return <Navigate to="/receptionist/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
};

export default App;
