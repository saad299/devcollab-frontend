'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuth from '../../hooks/useAuth'

function ProtectedRoute({children}) {
    const {user, loading} = useAuth()
    const router = useRouter()
    
    useEffect(() => {
        if (!user && !loading) {
            const currentPath = window.location.pathname
            router.push(`/login?redirect=${currentPath}`)
        }
    }, [user, loading, router])
    
    if (loading) {
        return <div>Loading...</div>
    }

    if (user === null) {
        return null
    }
    
    return children
}

export default ProtectedRoute