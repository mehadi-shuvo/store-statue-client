"use client";

import {
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

export function PaymentShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] pt-20 pb-16">
      <div className="mx-auto w-11/12 max-w-6xl">
        <header className="mb-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}

export function LoadingSpinner({ label }: { label: string }) {
  return (
    <div
      className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700"
      role="status"
      aria-live="polite"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950" />
      {label}
    </div>
  );
}

export function ErrorAlert({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-950"
      role="alert"
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-rose-800">{message}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
