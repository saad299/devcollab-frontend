import api from './api.js';

// Tokens live in httpOnly cookies set by Django. JavaScript never sees them.

export const register = async (username, email, password, password2) => {
    try {
        const response = await api.post('/auth/register/', { username, email, password, password2 });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    }
};

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login/', { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Login failed');
    }
};

export const logout = async () => {
    try {
        await api.post('/auth/logout/');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

// Asks the server who we are (the cookie proves it). Returns null if logged out.
// Confirm this URL matches accounts/urls.py (README says /api/auth/users/me/).
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/auth/users/me/');
        return response.data;
    } catch {
        return null;
    }
};