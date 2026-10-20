import axios from 'axios';

const isClient = typeof window !== 'undefined';

const axiosInstance = axios.create({
    // Browser: same-origin /api (proxied to Django by next.config.mjs).
    // Server-side rendering has no origin, so it talks to Django directly.
    baseURL: isClient ? '/api' : `${process.env.BACKEND_URL || 'http://127.0.0.1:8000'}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Never try to refresh on these: a 401 here is a real answer, not an expired session.
const AUTH_URLS = ['/auth/login/', '/auth/register/', '/auth/logout/', '/auth/token/refresh/'];
const isAuthUrl = (url = '') => AUTH_URLS.some((p) => url.includes(p));

// One shared refresh for all parallel 401s. Refresh tokens rotate and the old
// one is blacklisted, so two simultaneous refreshes would log the user out.
let refreshPromise = null;
function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = axiosInstance
            .post('/auth/token/refresh/')
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (
            !original ||
            error.response?.status !== 401 ||
            original._retry ||
            isAuthUrl(original.url)
        ) {
            return Promise.reject(error);
        }

        original._retry = true;
        try {
            await refreshSession();
            return axiosInstance(original);
        } catch {
            // Session is really gone. Tell AuthContext; do NOT redirect here.
            // ProtectedRoute decides who gets sent to /login (redirecting from
            // here is what causes infinite login loops on public pages).
            if (isClient) window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;