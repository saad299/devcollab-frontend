"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
  const next = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, next, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
      error: null,
    });

    try {
      await login(formData.email, formData.password);
      router.push(next);
    } catch (error) {
      const errMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFormData({
        ...formData,
        error: errMessage,
      });
    } finally {
      setFormData({
        ...formData,
        loading: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-500 mb-6">Sign in to your DevCollab account</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            {formData.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm">
                {formData.error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={formData.loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium px-7 py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formData.loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <p className="text-center text-gray-500 mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;