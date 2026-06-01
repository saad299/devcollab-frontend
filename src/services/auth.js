import api from './api.js';

export const register = async (username, email, password, password2) => {
    const response = await api.post('/auth/register/', { username, email, password, password2 });
        if (response.data.access) {
            const expiryTime = Date.now() + 42 * 24 * 60 * 60 * 1000;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('access_token_expiry', new Date(expiryTime).toISOString());
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('refresh_token_expiry', new Date(expiryTime).toISOString());
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        (error) => {
            throw new Error(error);
        }
        return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
        if (response.data.access) {
            const expiryTime = Date.now() + 42 * 24 * 60 * 60 * 1000;
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('access_token_expiry', new Date(expiryTime).toISOString());
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('refresh_token_expiry', new Date(expiryTime).toISOString());
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        }
        (error) => {
            throw new Error(error);
        }
    return response.data;
};

/*
To check in the browser console
// access token
const token = localStorage.getItem('access_token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires:', new Date(payload.exp * 1000));

// refresh token
const refreshToken = localStorage.getItem('refresh_token');
const payload = JSON.parse(atob(refreshToken.split('.')[1]));
console.log('Refresh token expires:', new Date(payload.exp * 1000));
*/

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
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
