"use client";

import {
  forgetPendingVerificationEmail,
  maskEmail,
  readPendingVerificationEmail,
  rememberPendingVerificationEmail,
  resendVerificationErrorMessage,
  verificationErrorMessage,
} from "@/lib/auth-flow";
import { ApiError } from "@/lib/api";
import { resendCustomerVerification, verifyCustomerEmail } from "@/lib/auth";
import { getSafeReturnPath, withReturnTo } from "@/lib/safe-return-path";
import { validateEmail, validateEmailVerification } from "@/lib/validation";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, MailCheck, RotateCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

type VerificationState = "form" | "verified" | "already-verified";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const { user, refreshProfile } = useAuth();
  const returnTo = getSafeReturnPath(searchParams.get("returnTo"));
  const registrationDelivery = searchParams.get("delivery");
  const fromRegistration = searchParams.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [state, setState] = useState<VerificationState>("form");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [resendFeedback, setResendFeedback] = useState("");

  useEffect(() => {
    const pendingEmail = readPendingVerificationEmail();
    setEmail(pendingEmail || (user?.role === "CUSTOMER" ? user.email : ""));
    if (user?.role === "CUSTOMER" && user.isEmailVerified) setState("already-verified");
  }, [user]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResendFeedback("");
    const normalizedEmail = email.trim().toLowerCase();
    const validation = validateEmailVerification({ email: normalizedEmail, otp });
    if (!validation.valid) {
      setError(validation.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      rememberPendingVerificationEmail(normalizedEmail);
      await verifyCustomerEmail({ email: normalizedEmail, otp: otp.trim() });
      forgetPendingVerificationEmail();
      setState("verified");
      if (user?.role === "CUSTOMER" && user.email.toLowerCase() === normalizedEmail) {
        await refreshProfile();
      }
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === "EMAIL_ALREADY_VERIFIED") {
        forgetPendingVerificationEmail();
        setState("already-verified");
      } else {
        setError(verificationErrorMessage(caught));
      }
      logAuthFailure("Email verification", caught);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendFeedback("");
    const normalizedEmail = email.trim().toLowerCase();
    const emailErrors = validateEmail(normalizedEmail);
    if (emailErrors.length) {
      setError(emailErrors[0].message);
      return;
    }

    setResending(true);
    try {
      rememberPendingVerificationEmail(normalizedEmail);
      const result = await resendCustomerVerification(normalizedEmail);
      setCooldown(Math.max(1, Math.floor(result.cooldownSeconds)));
      setResendFeedback(
        `If this account still needs verification, a new code will arrive at ${maskEmail(normalizedEmail)}.`,
      );
    } catch (caught) {
      if (caught instanceof ApiError && caught.retryAfterSeconds) {
        setCooldown(Math.max(1, Math.ceil(caught.retryAfterSeconds)));
      }
      setError(resendVerificationErrorMessage(caught));
      logAuthFailure("Verification resend", caught);
    } finally {
      setResending(false);
    }
  };

  if (state !== "form") {
    const verified = state === "verified";
    return (
      <VerificationShell>
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
            {verified ? "Email verified" : "Email already verified"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {verified
              ? "Your email address has been verified successfully."
              : "No further verification is needed for this email address."}
          </p>
          <Link
            href={user ? returnTo : withReturnTo("/login?verified=1", returnTo)}
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            {user ? "Continue" : "Continue to login"}
          </Link>
        </div>
      </VerificationShell>
    );
  }

  const maskedEmail = email ? maskEmail(email) : "your email address";
  return (
    <VerificationShell>
      <div className="text-center">
        <MailCheck className="mx-auto h-14 w-14 text-blue-600" aria-hidden="true" />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-blue-700">Secure account setup</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Check your email</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {fromRegistration && registrationDelivery === "failed"
            ? `Your account was created, but the first email could not be sent. Request a new code for ${maskedEmail}.`
            : fromRegistration && registrationDelivery === "sent"
              ? `We sent a six-digit verification code to ${maskedEmail}.`
              : email
                ? `Enter the six-digit verification code for ${maskedEmail}.`
                : "Enter your account email and six-digit verification code."}
        </p>
      </div>

      {error ? <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {resendFeedback ? <div role="status" className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{resendFeedback}</div> : null}

      <form onSubmit={handleVerify} className="mt-6 space-y-5">
        <div className="space-y-2">
          <label htmlFor="verification-email" className="text-sm font-semibold text-slate-700">Email address</label>
          <input id="verification-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          <label htmlFor="verification-code" className="text-sm font-semibold text-slate-700">Verification code</label>
          <input id="verification-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-blue-500" />
        </div>
        <button type="submit" disabled={submitting || resending} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {submitting ? "Verifying…" : "Verify email"}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-200 pt-5 text-center">
        <p className="text-sm text-slate-500">Didn’t receive the code?</p>
        <button type="button" onClick={handleResend} disabled={submitting || resending || cooldown > 0} className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-400">
          {resending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RotateCw className="h-4 w-4" aria-hidden="true" />}
          {resending ? "Requesting…" : cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend verification email"}
        </button>
      </div>

      {user ? <Link href={returnTo} className="mt-4 block text-center text-sm font-semibold text-slate-500 hover:text-slate-900">Continue for now</Link> : <Link href={withReturnTo("/login", returnTo)} className="mt-4 block text-center text-sm font-semibold text-slate-500 hover:text-slate-900">Back to login</Link>}
    </VerificationShell>
  );
}

function VerificationShell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-32"><section className="mx-auto w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl sm:p-10">{children}</section></main>;
}

function VerificationFallback() {
  return <main className="grid min-h-screen place-items-center bg-slate-50"><p role="status" className="text-sm font-semibold text-slate-600">Preparing verification…</p></main>;
}

function logAuthFailure(operation: string, error: unknown) {
  if (process.env.NODE_ENV === "production") return;
  console.warn(`${operation} failed`, error instanceof ApiError ? { status: error.status, code: error.code } : { errorType: error instanceof Error ? error.name : "UnknownError" });
}
