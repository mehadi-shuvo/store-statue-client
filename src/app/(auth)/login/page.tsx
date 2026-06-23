"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { extractAuthSession, getAuthErrorMessage } from "@/lib/auth";
import { apiUrl } from "@/lib/api";

const LoginPage = () => {
  const router = useRouter();
  const { login: setAuthUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/user/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(getAuthErrorMessage(data, "Login failed"));
      }

      const session = extractAuthSession(data);

      if (session.user && session.token) {
        setAuthUser(session.user, session.token);
      } else {
        router.refresh();
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center pt-24 pb-10">
        <div className="grid w-full gap-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative overflow-hidden bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12 lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.36),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(236,72,153,0.18),_transparent_24%)]" />
            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                Welcome back
              </span>
              <h1 className="mt-5 max-w-xl text-3xl font-black tracking-tight sm:text-5xl">
                Sign in and pick up right where you left off.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Access your cart, wishlist, and order history with an auth flow
                that updates instantly without a manual refresh.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Faster checkout
                  </p>
                  <p className="mt-2 text-2xl font-bold">One tap</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Saved items
                  </p>
                  <p className="mt-2 text-2xl font-bold">Always synced</p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Login
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Use your email and password to access your account.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                  Create account
                </Link>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:flex-1"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto sm:flex-1"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
