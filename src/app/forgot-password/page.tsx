"use client";

import { maskEmail, passwordResetErrorMessage } from "@/lib/auth-flow";
import { forgotPassword, resetPassword } from "@/lib/auth";
import { validateEmail, validateResetPassword } from "@/lib/validation";
import { CheckCircle2, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type ResetStep = "email" | "code" | "complete";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim().toLowerCase();
    const errors = validateEmail(normalizedEmail);
    if (errors.length) {
      setError(errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await forgotPassword(normalizedEmail);
      setEmail(normalizedEmail);
      setStep("code");
    } catch (caught) {
      setError(passwordResetErrorMessage(caught, "request"));
    } finally {
      setSubmitting(false);
    }
  };

  const submitReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const validation = validateResetPassword({ email, otp, newPassword });
    if (!validation.valid) {
      setError(validation.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({ email, otp: otp.trim(), newPassword });
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("complete");
    } catch (caught) {
      setError(passwordResetErrorMessage(caught, "reset"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-32">
      <section className="mx-auto w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl sm:p-10">
        {step === "complete" ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Password reset</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Your password has been changed successfully. You can now sign in with the new password.</p>
            <Link href="/login" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800">Continue to login</Link>
          </div>
        ) : (
          <>
            <div className="text-center">
              {step === "email" ? <Mail className="mx-auto h-12 w-12 text-blue-600" aria-hidden="true" /> : <KeyRound className="mx-auto h-12 w-12 text-blue-600" aria-hidden="true" />}
              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">{step === "email" ? "Forgot your password?" : "Enter your reset code"}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step === "email"
                  ? "Enter your account email and we’ll send a six-digit reset code if the account is eligible."
                  : "Enter the six-digit code from your email and choose a new password."}
              </p>
            </div>

            {error ? <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

            {step === "email" ? (
              <form onSubmit={requestCode} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label htmlFor="reset-email" className="text-sm font-semibold text-slate-700">Email address</label>
                  <input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500" />
                </div>
                <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  {submitting ? "Requesting…" : "Send reset code"}
                </button>
              </form>
            ) : (
              <form onSubmit={submitReset} className="mt-6 space-y-5">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">If an active account exists, a reset code was sent to <span className="font-semibold text-slate-900">{maskEmail(email)}</span>.</div>
                <div className="space-y-2">
                  <label htmlFor="reset-code" className="text-sm font-semibold text-slate-700">Reset code</label>
                  <input id="reset-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-semibold text-slate-700">New password</label>
                  <input id="new-password" type="password" autoComplete="new-password" required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500" />
                  <p className="text-xs leading-5 text-slate-500">Use 8–128 characters with uppercase, lowercase, a number, and a special character.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-semibold text-slate-700">Confirm new password</label>
                  <input id="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500" />
                </div>
                <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  {submitting ? "Resetting…" : "Verify code and reset password"}
                </button>
                <button type="button" disabled={submitting} onClick={() => { setStep("email"); setOtp(""); setError(""); }} className="w-full text-sm font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-50">Request a new code or use another email</button>
              </form>
            )}

            <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-slate-500 hover:text-slate-900">Back to login</Link>
          </>
        )}
      </section>
    </main>
  );
}
