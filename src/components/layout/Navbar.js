"use client";

import { useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white border-b border-gray-200 px-4 sm:px-6 h-13 sm:h-15">
      <Link
        href={user ? "/dashboard" : "/"}
        className="text-[17px] sm:text-[18px] font-medium cursor-pointer text-gray-900"
      >
        Dev<span className="text-[#378ADD]">Collab</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex items-center gap-2">
        {user === null ? (
          <>
            <Link
              href="/projects"
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Browse Projects
            </Link>
            <Link
              href="/login"
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/projects"
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/projects/new"
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Post Project
            </Link>
            <Link
              href={`/profile/${user.username}`}
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-[14px] text-gray-600 px-2.5 py-1.5 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="sm:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {mobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg sm:hidden">
          <div className="flex flex-col p-4 gap-2">
            {user === null ? (
              <>
                <Link
                  href="/projects"
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Projects
                </Link>
                <Link
                  href="/login"
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/projects"
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse
                </Link>
                <Link
                  href="/projects/new"
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Post Project
                </Link>
                <Link
                  href={`/profile/${user.username}`}
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-[14px] text-gray-600 px-2.5 py-2 rounded-md cursor-pointer hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
