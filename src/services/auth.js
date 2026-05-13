import api from './api.js';

export const register = async (username, email, password, password2) => {
    const response = await api.post('/auth/register/', { username, email, password, password2 });
    response.then((response) => {
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        (error) => {
            throw new Error(error);
        }
        return response.data;
    });
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    response.then((response) => {
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        (error) => {
            throw new Error(error);
        }
    });
    return response.data;
};

export const logout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
        try {
            api.post('/auth/logout/', { refresh: refreshToken });
        }
        catch (error) {
            console.error('Error logging out:', error);
        }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
