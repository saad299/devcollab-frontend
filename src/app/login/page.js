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
    <div className="flex flex-1 items-center justify-center">
      <h1>Welcome Back!</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button type="submit" disabled={formData.loading}>
          {formData.loading ? "Loading..." : "Login"}
        </button>
        {formData.error && <p className="text-red-500">{formData.error}</p>}
      </form>
      <Link href="/register">Don&apos;t have an account? Register</Link>
    </div>
  );
}

export default LoginPage;