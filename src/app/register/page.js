"use client";

import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function RegisterPage() {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    error: "",
    loading: false,
  });

  const { register, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (state.password !== state.password2) {
      setState(prev => ({ ...prev, error: "Passwords do not match" }));
      return;
    }
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await register(state.username, state.email, state.password, state.password2);
      router.push("/dashboard");
    } catch (error) {
      const errMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setState(prev => ({ ...prev, error: errMessage }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Join DevCollab</h1>
          <p className="text-gray-500 mb-6">Create your account to start collaborating</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={state.username}
                onChange={(e) => setState({ ...state, username: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={state.password}
                onChange={(e) => setState({ ...state, password: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={state.password2}
                onChange={(e) => setState({ ...state, password2: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            {state.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
                {state.error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={state.loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-7 py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          
          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
