import api from './api';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        // Response is the user data now (token is handled via HTTP-only cookie)
        if (response && response._id) {
            return {
                user: response
            };
        }
        return response;
    },

    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },

    logout: async () => {
        return await api.post('/auth/logout');
    },
    
    getAll: async () => {
        const response = await api.get('/auth/users');
        // Backend returns { success: true, data: users }
        return response.data || [];
    }
};
