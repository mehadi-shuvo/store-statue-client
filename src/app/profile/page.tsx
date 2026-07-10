"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  deleteCustomerProfile,
  updateCustomerProfile,
  type AuthUser,
} from "@/lib/auth";
import { Loader2, Save, ShieldAlert, Trash2, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ProfileForm = {
  name: string;
  phone: string;
};

function getProfileForm(user: AuthUser | null): ProfileForm {
  return {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const { user, loading, login, clearAuth } = useAuth();

  const [form, setForm] = useState<ProfileForm>(() => getProfileForm(user));
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    setForm(getProfileForm(user));
    setProfileLoading(false);
  }, [loading, router, user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    setError("");

    const name = form.name.trim();
    const phone = form.phone.trim();
    const payload: { name?: string; phone?: string | null } = {};

    if (name !== (user.name ?? "")) {
      payload.name = name;
    }

    if (phone !== (user.phone ?? "")) {
      payload.phone = phone || null;
    }

    if (!payload.name && payload.phone === undefined) {
      const message = "Change your name or phone before saving.";
      setError(message);
      toast.info("No changes", message);
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await updateCustomerProfile(payload);
      login(updatedProfile);
      setForm(getProfileForm(updatedProfile));
      toast.success("Profile updated", "Your account details are saved.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not update your profile.";
      setError(message);
      toast.error("Update failed", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeleteError("");

    if (!deletePassword) {
      const message = "Password is required to delete your account.";
      setDeleteError(message);
      return;
    }

    try {
      setDeleting(true);
      await deleteCustomerProfile(deletePassword);
      clearAuth();
      toast.success("Account deleted", "Your account has been removed.");
      router.replace("/login");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not delete your account.";
      setDeleteError(message);
      toast.error("Delete failed", message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading || profileLoading) {
    return (
      <main className="min-h-screen bg-slate-50 pt-[148px]">
        <div className="mx-auto flex min-h-[50vh] w-11/12 items-center justify-center lg:w-4/5">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading profile...
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] pt-[148px] pb-16">
      <div className="mx-auto w-11/12 lg:w-4/5">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage the customer details connected to your secure checkout.
            </p>
          </div>
          <Link
            href="/cart"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View cart
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <UserRound className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-950">
                  {user.name || "Customer"}
                </h2>
                <p className="truncate text-sm text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Phone</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {user.phone || "Not added"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-slate-500">Role</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {user.role || "CUSTOMER"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Profile details
            </h2>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="+8801XXXXXXXXX"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save changes
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="flex items-center gap-2 text-base font-bold text-slate-950">
                    <ShieldAlert className="h-4 w-4 text-rose-600" />
                    Delete account
                  </h3>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    This permanently removes your customer account and signs you
                    out on this device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>

              {deleteOpen ? (
                <form
                  onSubmit={handleDelete}
                  className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4"
                >
                  <label className="text-sm font-medium text-rose-950">
                    Confirm with your password
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(event) => setDeletePassword(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-500"
                  />
                  {deleteError ? (
                    <p className="mt-3 text-sm text-rose-700">
                      {deleteError}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={deleting}
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete account
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteOpen(false);
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
