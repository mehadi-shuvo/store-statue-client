"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  History,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { PaymentResultStatus } from "@/types/payment";

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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] pt-[148px] pb-16">
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

export function PaymentMethodBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-sm font-bold text-pink-700">
      <CreditCard className="h-4 w-4" />
      bKash
    </span>
  );
}

export function ResultPanel({
  status,
  title,
  message,
  paymentId,
}: {
  status: "success" | "failed" | "cancelled" | "processing";
  title: string;
  message: string;
  paymentId?: string | null;
}) {
  const content = {
    success: {
      icon: <CheckCircle2 className="h-10 w-10" />,
      className: "bg-emerald-600 text-white",
    },
    failed: {
      icon: <XCircle className="h-10 w-10" />,
      className: "bg-rose-600 text-white",
    },
    cancelled: {
      icon: <AlertTriangle className="h-10 w-10" />,
      className: "bg-amber-500 text-white",
    },
    processing: {
      icon: <Clock className="h-10 w-10" />,
      className: "bg-slate-950 text-white",
    },
  }[status];

  return (
    <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
      <div
        className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${content.className} ${
          status === "success" ? "animate-payment-pop" : ""
        }`}
      >
        {content.icon}
      </div>
      <h2 className="mt-6 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
        {message}
      </p>
      {paymentId ? (
        <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 font-mono text-xs text-slate-600">
          Payment ID: {paymentId}
        </p>
      ) : null}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/payment/history"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <History className="h-4 w-4" />
          Payment history
        </Link>
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Back to checkout
        </Link>
      </div>
    </section>
  );
}

export function normalizePaymentStatus(status?: string | null) {
  const normalized = (status ?? "").toUpperCase();

  if (normalized === "SUCCESS" || normalized === "PAID") {
    return "success";
  }

  if (normalized === "CANCELLED" || normalized === "CANCELED") {
    return "cancelled";
  }

  if (normalized === "PROCESSING" || normalized === "PENDING") {
    return "processing";
  }

  return "failed";
}

export function getStatusLabel(status: PaymentResultStatus) {
  return status === "PAID" ? "SUCCESS" : status;
}
