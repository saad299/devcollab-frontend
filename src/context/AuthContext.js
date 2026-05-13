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

    async function login(email, password) {
        data = await loginService(email, password)
        setUser(data.user)
        return data
    }

    async function register(username, email, password, password2) {
        data = await registerService(username, email, password, password2)
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