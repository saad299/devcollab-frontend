import axios from 'axios';
import { redirect } from 'next/dist/server/api-utils';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    // return response.status >= 200 && response.status < 300 ? response : Promise.reject(response);
    async (error) => {
        const orignalRequest = error.config;

        if (error.response?.status === 401 && !orignalRequest._retry) {
            orignalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axiosInstance.post('/auth/token/refresh/', { refresh_token: refreshToken });
                const accessToken = response.data.access_token;
                localStorage.setItem('access_token', accessToken);
                orignalRequest.headers.Authorization = `Bearer ${accessToken}`;
                // orignalRequest._retry = false;
                return axiosInstance(orignalRequest);
            } catch (refreshError) {
                localStorage.clear();
                redirect('/login');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
