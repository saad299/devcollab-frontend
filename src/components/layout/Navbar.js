'use client'

import Link from 'next/link'
import useAuth from '@/hooks/useAuth'

function Navbar() {
    const { user, logout } = useAuth()
    
    return (
        <nav className='sticky top-0 z-10 flex items-center justify-between bg-white border-b border-gray-200 px-6 h-[52px]'>
            <Link href={user ? "/dashboard" : "/"} className='text-[17px] font-medium cursor-pointer text-gray-900'>
                Dev<span className='text-[#378ADD]'>Collab</span>
            </Link>
            <div className='flex items-center gap-2'>
                {user === null ? (
                    <>
                        <Link href="/projects" className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Browse Projects
                        </Link>
                        <Link href="/login" className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Login
                        </Link>
                        <Link href="/register" className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/projects" className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Browse
                        </Link>
                        <Link href="/projects/new" className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Post Project
                        </Link>
                        <Link href="/dashboard" className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Dashboard
                        </Link>
                        <Link href={`/profile/${user.username}`} className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Profile
                        </Link>
                        <button onClick={logout} className='text-[14px] text-gray-600 px-[10px] py-[6px] rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors'>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar