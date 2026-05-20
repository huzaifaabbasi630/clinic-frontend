import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch logged-in user profile on load to verify cookie auth
        const loadUser = async () => {
            try {
                const userData = await api.get('/auth/me');
                if (userData) {
                    const normalizedUser = {
                        ...userData,
                        role: (userData.role || 'staff').toLowerCase()
                    };
                    setUser(normalizedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // Not authenticated or session expired
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = (userData) => {
        if (!userData) {
            console.error("Invalid login data received");
            return;
        }

        // Normalize roles for consistency
        const normalizedUser = {
            ...userData,
            role: (userData.role || 'staff').toLowerCase()
        };

        setUser(normalizedUser);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout API error");
        } finally {
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
