"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { isAdminProfile } from "@/lib/admin";
import { loginUser } from "@/lib/auth";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const { login, logout } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });

      if (!isAdminProfile(user)) {
        await logout();
        throw new Error("This account does not have admin access.");
      }

      login(user);
      toast.success("Admin signed in", "Welcome back to the control panel.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Admin login failed.";
      setError(message);
      toast.error("Login failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <section className="bg-slate-950 p-6 sm:p-10 lg:p-12">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-950">
                GX
              </span>
              GameXpress Admin
            </Link>

            <div className="mt-16 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Staff access
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Operate orders, payments, and digital inventory from one place.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Sign in with an admin or super admin account. Customer accounts
                are not allowed into this workspace.
              </p>
            </div>
          </section>

          <section className="bg-white p-6 text-slate-950 sm:p-10 lg:p-12">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-3xl font-black tracking-tight">
                Admin login
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Use the same backend session cookie, restricted by admin role.
              </p>
            </div>

            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LockKeyhole className="h-4 w-4" />
                )}
                Sign in
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <Link
                  href="/admin/signup"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Create admin
                </Link>
                <Link href="/" className="text-slate-500 hover:text-slate-900">
                  Storefront
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
