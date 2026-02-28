import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for stored token and user info
        try {
            const storedUser = localStorage.getItem('hospital_user');
            const token = localStorage.getItem('hospital_token');

            if (storedUser && storedUser !== "undefined" && token && token !== "undefined") {
                setUser(JSON.parse(storedUser));
            } else {
                // Clean up if any corrupted data exists
                if (storedUser === "undefined" || token === "undefined") {
                    localStorage.removeItem('hospital_user');
                    localStorage.removeItem('hospital_token');
                }
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            localStorage.removeItem('hospital_user');
            localStorage.removeItem('hospital_token');
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        if (!userData || !token) {
            console.error("Invalid login data received", { userData, token });
            return;
        }

        // Normalize roles for consistency
        const normalizedUser = {
            ...userData,
            role: (userData.role || 'staff').toLowerCase()
        };

        setUser(normalizedUser);
        localStorage.setItem('hospital_user', JSON.stringify(normalizedUser));
        localStorage.setItem('hospital_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hospital_user');
        localStorage.removeItem('hospital_token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
