'use client'

import { createContext, useState, useEffect, useRef } from "react";
import { getCurrentUser, login as loginService, logout as logoutService, register as registerService } from "../services/auth";

export const AuthContext = createContext(null);

// Old localStorage session data from before the cookie migration.
const LEGACY_KEYS = ['access_token', 'refresh_token', 'access_token_expiry', 'refresh_token_expiry', 'user'];

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const channelRef = useRef(null);

    // On load: remove leftover tokens, then ask the server who we are.
    useEffect(() => {
        LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));

        let active = true;
        getCurrentUser().then((u) => {
            if (!active) return;
            setUser(u);
            setLoading(false);
        });
        return () => { active = false; };
    }, []);

    // Axios interceptor says the session is gone + cross-tab login/logout sync.
    useEffect(() => {
        const handleAuthLogout = () => setUser(null);
        window.addEventListener('auth:logout', handleAuthLogout);

        let channel = null;
        if (typeof BroadcastChannel !== 'undefined') {
            channel = new BroadcastChannel('devcollab-auth');
            channel.onmessage = (e) => {
                if (e.data === 'logout') setUser(null);
                if (e.data === 'login') getCurrentUser().then(setUser);
            };
            channelRef.current = channel;
        }

        return () => {
            window.removeEventListener('auth:logout', handleAuthLogout);
            channel?.close();
        };
    }, []);

    async function login(email, password) {
        const data = await loginService(email, password);
        setUser(data.user);
        channelRef.current?.postMessage('login');
        return data;
    }

    async function register(username, email, password, password2) {
        const data = await registerService(username, email, password, password2);
        setUser(data.user);
        channelRef.current?.postMessage('login');
        return data;
    }

    async function logout() {
        await logoutService();
        setUser(null);
        channelRef.current?.postMessage('logout');
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}