"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  DetailRow,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
  formatDate,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  changeAdminPassword,
  getAdminProfile,
  updateAdminProfile,
  type AdminProfile,
} from "@/lib/admin";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function AdminProfilePage() {
  const toast = useToast();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const nextProfile = await getAdminProfile();
      setProfile(nextProfile);
      setProfileForm({
        name: nextProfile.name ?? "",
        phone: nextProfile.phone ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = profileForm.name.trim();
    const phone = profileForm.phone.trim();

    if (!name || name.length < 2) {
      toast.error("Update failed", "Name must be at least 2 characters.");
      return;
    }

    try {
      setSaving(true);
      await updateAdminProfile({ name, phone: phone || null });
      toast.success("Profile updated");
      await loadProfile();
    } catch (err) {
      toast.error(
        "Update failed",
        err instanceof Error ? err.message : "Could not update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!strongPasswordPattern.test(passwordForm.newPassword)) {
      toast.error(
        "Password is too weak",
        "Use uppercase, lowercase, number, special character, and 8+ characters.",
      );
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Password mismatch", "Confirm password must match.");
      return;
    }

    try {
      setChangingPassword(true);
      await changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed");
    } catch (err) {
      toast.error(
        "Password change failed",
        err instanceof Error ? err.message : "Could not change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Account"
        title="Admin profile"
        description="View your profile, update contact details, and rotate your admin password."
      />

      {loading ? <LoadingState label="Loading profile..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadProfile} /> : null}

      {profile && !loading ? (
        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Profile</h2>
            <div className="mt-5 grid gap-3">
              <DetailRow label="Name" value={profile.name || "Not available"} />
              <DetailRow label="Email" value={profile.email || "Not available"} />
              <DetailRow label="Phone" value={profile.phone || "Not added"} />
              <DetailRow label="Role" value={<StatusBadge value={profile.role} />} />
              <DetailRow label="Status" value={<StatusBadge value={!profile.isDeleted} />} />
              <DetailRow label="Created" value={formatDate(profile.createdAt)} />
            </div>
          </section>

          <section className="space-y-6">
            <form
              onSubmit={handleProfileSubmit}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-lg font-bold">Update profile</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Name</span>
                  <input
                    value={profileForm.name}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input
                    value={profileForm.phone}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save changes
              </button>
            </form>

            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Change password</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Use a strong password for admin access.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswords((value) => !value)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-5 grid gap-4">
                {[
                  ["currentPassword", "Current password"],
                  ["newPassword", "New password"],
                  ["confirmPassword", "Confirm password"],
                ].map(([key, label]) => (
                  <label key={key} className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      {label}
                    </span>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={passwordForm[key as keyof typeof passwordForm]}
                      onChange={(event) =>
                        setPasswordForm((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={changingPassword}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {changingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Change password
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </AdminShell>
  );
}
