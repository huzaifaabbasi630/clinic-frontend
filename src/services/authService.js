import api from './api';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        // Standardizing response: API returns { _id, name, email, role, subscriptionPlan, token }
        if (response && response.token) {
            const { token, ...userData } = response;
            return {
                user: userData,
                token: token
            };
        }
        return response;
    },

    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },
    
    getAll: async () => {
        const response = await api.get('/auth/users');
        // Backend returns { success: true, data: users }
        return response.data || [];
    }
};
