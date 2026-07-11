import axios from 'axios';
// import { redirect } from 'next/dist/server/api-utils';

const isClient = typeof window !== 'undefined';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// axiosInstance.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('access_token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

axiosInstance.interceptors.request.use(
    (config) => {
        if (isClient) {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
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

        // Skip refresh logic for the refresh endpoint itself to prevent infinite loop
        if (orignalRequest.url?.includes('/auth/token/refresh/')) {
            // If refresh fails, clear tokens and redirect to login
            if (isClient) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('access_token_expiry');
                localStorage.removeItem('refresh_token_expiry');
                localStorage.removeItem('user');
                // Dispatch custom event to notify AuthContext
                window.dispatchEvent(new Event('auth:logout'));
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !orignalRequest._retry) {
            orignalRequest._retry = true;

            try {
                if (isClient) {
                    const refreshToken = localStorage.getItem('refresh_token');
                    const response = await axiosInstance.post('/auth/token/refresh/', { refresh: refreshToken });
                    const accessToken = response.data.access;
                    const newRefreshToken = response.data.refresh;
                    localStorage.setItem('access_token', accessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refresh_token', newRefreshToken);
                    }
                    orignalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    // orignalRequest._retry = false;
                    return axiosInstance(orignalRequest);
                }
                return Promise.reject(error);
            } catch (refreshError) {
                // Clear tokens and redirect to login only if refresh genuinely fails
                if (isClient) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('access_token_expiry');
                    localStorage.removeItem('refresh_token_expiry');
                    localStorage.removeItem('user');
                    // Dispatch custom event to notify AuthContext
                    window.dispatchEvent(new Event('auth:logout'));
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
