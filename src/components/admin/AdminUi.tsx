"use client";

import { Loader2, TriangleAlert } from "lucide-react";
import { ReactNode } from "react";

export const adminCurrencyFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number | string | null | undefined) {
  return adminCurrencyFormatter.format(Number(value || 0));
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString();
}

export function statusTone(status?: string | boolean | null) {
  if (status === true || status === "active" || status === "ACTIVE" || status === "AVAILABLE" || status === "PAID" || status === "DELIVERED" || status === "CONFIRMED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === false || status === "inactive" || status === "INACTIVE" || status === "DISABLED" || status === "EXPIRED" || status === "FAILED" || status === "CANCELLED" || status === "REFUNDED") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  if (status === "PENDING" || status === "PROCESSING" || status === "RESERVED") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }

  return "bg-slate-100 text-slate-700 ring-slate-200";
}

export function StatusBadge({ value }: { value?: string | boolean | null }) {
  const label = typeof value === "boolean"
    ? (value ? "Active" : "Inactive")
    : value
      ? value.toLowerCase().replace(/_/g, " ").replace(/^./, character => character.toUpperCase())
      : "Unknown";

  return (
    <span
      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusTone(value)}`}
    >
      {label}
    </span>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "Nothing found",
  description = "Try changing your filters or search.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
      <p className="font-bold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 text-rose-900">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-bold">Could not load this page</p>
          <p className="mt-1 text-sm leading-6">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-2xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 sm:max-w-xs"
    />
  );
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="mt-5 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      <span className="px-2 text-sm font-medium text-slate-500">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(pageCount, page + 1))}
        disabled={page >= pageCount}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export function paginate<T>(items: T[], page: number, pageSize = 10) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  loading,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 px-4">
      <div className="w-full max-w-lg rounded-[1.5rem] bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        ) : null}
        {children ? <div className="mt-5">{children}</div> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
