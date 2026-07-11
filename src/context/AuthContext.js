'use client'

import { createContext, useState, useEffect } from "react";
import { getCurrentUser, login as loginService , logout as logoutService, register as registerService } from "../services/auth";
import { usePathname, useRouter } from "next/navigation";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const currentUser = getCurrentUser()
        setUser(currentUser)
        setLoading(false)
    }, [])

    // Listen for localStorage changes (cross-tab sync and axios interceptor changes)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'access_token' || e.key === null) {
                // Token was removed or localStorage was cleared
                const currentUser = getCurrentUser()
                setUser(currentUser)
            }
        }

        // Listen for storage events (cross-tab)
        window.addEventListener('storage', handleStorageChange)

        // Listen for custom auth events (same-tab from axios interceptor)
        const handleAuthLogout = () => {
            setUser(null)
        }

        window.addEventListener('auth:logout', handleAuthLogout)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('auth:logout', handleAuthLogout)
        }
    }, [])

    async function login(email, password) {
        const data = await loginService(email, password)
        // data = await loginService(email, password)
        setUser(data.user)
        return data
    }

    async function register(username, email, password, password2) {
        const data = await registerService(username, email, password, password2)
        // data = await registerService(username, email, password, password2)
        setUser(data.user)
        return data
    }

    async function logout() {
        await logoutService()
        setUser(null)
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