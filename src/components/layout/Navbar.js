'use client'

import Link from 'next/link'
import useAuth from '@/hooks/useAuth'

function Navbar() {
    const { user, logout } = useAuth()
    
    return (
        <nav className='flex items-center justify-between p-4 bg-gray-400'>
            <Link href="/">Home</Link>
            {user === null ? (
                <>
                    <Link href="/projects">Browse Projects</Link>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                </>
            ) : (
                <>
                    <Link href="/projects">Browse</Link>
                    <Link href="/projects/new">Post Project</Link>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href={`/profile/${user.username}`}>Profile</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    )
}

export default Navbar