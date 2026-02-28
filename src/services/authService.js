import api from './api';

// Helper to get users from localStorage (simulated database)
const getStoredUsers = () => {
    const users = localStorage.getItem('hospital_db_users');
    const defaultUsers = [
        { name: 'Admin User', email: 'admin@hospital.com', password: 'admin123', role: 'admin' },
        { name: 'Dr. Smith', email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor' }
    ];
    if (!users) {
        localStorage.setItem('hospital_db_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return JSON.parse(users);
};

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            
            // Extreme Normalization:
            // Ensure we always return { user, token } to the frontend
            if (response && response.token) {
                if (!response.user) {
                    const { token, ...userData } = response;
                    return {
                        user: userData,
                        token: token
                    };
                }
                return response;
            }
            
            return response;
        } catch (err) {
            // Fallback: Check in our simulated database (localStorage)
            const users = getStoredUsers();
            const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
            
            await new Promise(resolve => setTimeout(resolve, 800));

            if (user) {
                const { password, ...userWithoutPassword } = user;
                const token = 'mock-token-' + Math.random().toString(36).substring(2);
                
                return { 
                    user: userWithoutPassword, 
                    token: token 
                };
            }
            
            return Promise.reject('Invalid email or password. Please register first.');
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response;
        } catch (err) {
            const users = getStoredUsers();
            
            await new Promise(resolve => setTimeout(resolve, 800));

            if (users.find(u => u.email === userData.email)) {
                return Promise.reject('User already exists with this email');
            }
            
            const newUser = { ...userData };
            users.push(newUser);
            localStorage.setItem('hospital_db_users', JSON.stringify(users));
            
            return { 
                success: true,
                message: 'Registration successful', 
                user: userData 
            };
        }
    },
    
    getAll: async () => {
        try {
            const response = await api.get('/auth/users');
            if (response && response.users && Array.isArray(response.users)) {
                return response.users;
            }
            if (response && response.data && Array.isArray(response.data)) {
                return response.data;
            }
            if (Array.isArray(response)) {
                return response;
            }
            return [];
        } catch (err) {
            return getStoredUsers();
        }
    }
};
