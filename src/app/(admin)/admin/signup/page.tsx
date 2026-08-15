"use client";

import { useToast } from "@/context/ToastContext";
import { createAdmin, getAdminProfile, type AdminProfile } from "@/lib/admin";
import {
  ArrowLeft,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function AdminSignupPage() {
  const router = useRouter();
  const toast = useToast();

  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    currentPassword: "",
  });

  useEffect(() => {
    getAdminProfile()
      .then((profile) => setAdmin(profile))
      .catch(() => router.replace("/admin/login"))
      .finally(() => setCheckingAccess(false));
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      toast.error("Admin creation failed", message);
      return;
    }

    if (!strongPasswordPattern.test(form.password)) {
      const message =
        "Password must be 8+ characters with uppercase, lowercase, number, and special character.";
      setError(message);
      toast.error("Admin creation failed", message);
      return;
    }

    try {
      setLoading(true);
      await createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        currentPassword: form.currentPassword,
      });

      toast.success("Admin created", "The new admin can now sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not create admin.";
      setError(message);
      toast.error("Admin creation failed", message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="h-5 w-5 animate-spin" />
            Checking admin access...
          </div>
        </div>
      </main>
    );
  }

  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Admin dashboard
        </Link>

        <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-2xl">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <section className="bg-slate-950 p-6 sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5" />
                Super admin action
              </span>
              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                Create a new admin account.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The backend requires an active super admin session and your
                current password before a new admin can be created.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Signed in as</p>
                <p className="mt-1 font-semibold text-white">
                  {admin?.name || "Admin"}
                </p>
                <p className="mt-1 text-sm text-slate-400">{admin?.email}</p>
              </div>
            </section>

            <section className="bg-white p-6 text-slate-950 sm:p-10">
              {!isSuperAdmin ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <h2 className="font-bold">Super admin required</h2>
                      <p className="mt-1 text-sm leading-6">
                        Your account can access the admin dashboard, but only a
                        super admin can create another admin profile.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <h2 className="mt-5 text-3xl font-black tracking-tight">
                      Admin signup
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Create a staff account with admin permissions.
                    </p>
                  </div>

                  {error ? (
                    <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  ) : null}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-700">
                          Full name
                        </label>
                        <input
                          required
                          value={form.name}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                        />
                      </div>

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
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Phone
                        </label>
                        <input
                          value={form.phone}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
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
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Confirm password
                        </label>
                        <input
                          type="password"
                          required
                          value={form.confirmPassword}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              confirmPassword: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-sm font-medium text-slate-700">
                          Your current password
                        </label>
                        <input
                          type="password"
                          required
                          value={form.currentPassword}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              currentPassword: event.target.value,
                            }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Create admin
                    </button>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
