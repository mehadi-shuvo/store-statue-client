"use client";

import { ApiError } from "@/lib/api";
import { CircleOff, Clock3, Loader2, LockKeyhole, RefreshCw, ShieldX, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

export function ApiLoading({ label = "Loading…" }: { label?: string }) {
  return <div role="status" className="flex min-h-48 items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-8 text-sm font-medium text-slate-600"><Loader2 className="h-5 w-5 animate-spin" />{label}</div>;
}

export function ApiEmpty({ title = "Nothing found", description }: { title?: string; description?: string }) {
  return <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center"><CircleOff className="mx-auto h-9 w-9 text-slate-400" /><p className="mt-3 font-bold text-slate-900">{title}</p>{description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}</div>;
}

export function ApiErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const apiError = error instanceof ApiError ? error : null;
  const status = apiError?.status;
  const content = status === 401
    ? { title: "Sign in required", message: apiError?.message ?? "Authentication is required.", Icon: LockKeyhole, tone: "border-amber-200 bg-amber-50 text-amber-950" }
    : status === 403
      ? { title: "Permission denied", message: apiError?.message ?? "You do not have permission.", Icon: ShieldX, tone: "border-rose-200 bg-rose-50 text-rose-950" }
      : status === 429
        ? { title: "Too many requests", message: apiError?.retryAfterSeconds ? `Try again in ${apiError.retryAfterSeconds} seconds.` : apiError?.message ?? "Please wait before retrying.", Icon: Clock3, tone: "border-amber-200 bg-amber-50 text-amber-950" }
        : { title: "Request failed", message: error instanceof Error ? error.message : "Something went wrong.", Icon: TriangleAlert, tone: "border-rose-200 bg-rose-50 text-rose-950" };
  const { Icon } = content;
  return <div role="alert" className={`rounded-3xl border p-6 ${content.tone}`}><div className="flex items-start gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-bold">{content.title}</p><p className="mt-1 text-sm leading-6 opacity-80">{content.message}</p>{apiError?.details.length ? <ul className="mt-3 list-inside list-disc text-sm">{apiError.details.map((detail) => <li key={`${detail.field}:${detail.message}`}>{detail.field ? `${detail.field}: ` : ""}{detail.message}</li>)}</ul> : null}{onRetry && (!apiError || apiError.isRetryable) ? <button type="button" onClick={onRetry} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"><RefreshCw className="h-4 w-4" />Retry</button> : null}</div></div></div>;
}

export function ApiBoundary({ loading, error, empty, onRetry, children }: { loading: boolean; error?: unknown; empty?: boolean; onRetry?: () => void; children: ReactNode }) {
  if (loading) return <ApiLoading />;
  if (error) return <ApiErrorState error={error} onRetry={onRetry} />;
  if (empty) return <ApiEmpty />;
  return <>{children}</>;
}
