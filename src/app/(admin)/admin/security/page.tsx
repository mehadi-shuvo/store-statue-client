"use client";

import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import { changeAdminPassword } from "@/lib/admin";
import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export default function SecurityPage() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") || ""); const newPassword = String(data.get("newPassword") || ""); const confirmation = String(data.get("confirmation") || "");
    if (newPassword !== confirmation) return toast.error("Passwords do not match");
    try { setSaving(true); await changeAdminPassword({ currentPassword, newPassword }); form.reset(); toast.success("Password updated"); }
    catch (err) { form.reset(); toast.error("Password update failed", err instanceof Error ? err.message : "Try again."); }
    finally { setSaving(false); }
  };
  const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500";
  return <AdminShell><PageHeader eyebrow="Settings" title="Security" description="Change your password and review how your admin session is protected." />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,620px)_1fr]">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-700"><KeyRound className="h-5 w-5" /></div><div><h2 className="font-bold">Change password</h2><p className="text-sm text-slate-500">All fields are cleared after every attempt.</p></div></div><div className="mt-6 space-y-4"><label className="block text-sm font-semibold">Current password<input required name="currentPassword" type="password" autoComplete="current-password" className={inputClass} /></label><label className="block text-sm font-semibold">New password<input required minLength={10} name="newPassword" type="password" autoComplete="new-password" className={inputClass} /></label><label className="block text-sm font-semibold">Confirm new password<input required minLength={10} name="confirmation" type="password" autoComplete="new-password" className={inputClass} /></label></div><button disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Update password</button></form>
      <aside className="h-fit rounded-2xl border border-emerald-200 bg-emerald-50 p-6"><ShieldCheck className="h-7 w-7 text-emerald-700" /><h2 className="mt-4 font-bold text-emerald-950">Cookie-protected session</h2><p className="mt-2 text-sm leading-6 text-emerald-900/75">Ontor uses an HTTP-only access token cookie. The admin interface never reads or stores your token in local or session storage.</p></aside>
    </div>
  </AdminShell>;
}
