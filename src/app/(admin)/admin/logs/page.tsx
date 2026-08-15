"use client";

import AdminShell from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge, formatDate } from "@/components/admin/AdminUi";
import { getApplicationLogs, type ApplicationLog } from "@/lib/admin";
import { Copy, Download, Pause, Play, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const levels = ["", "debug", "info", "warn", "error"];

export default function ApplicationLogsPage() {
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const load = useCallback(async (quiet = false) => {
    try { if (!quiet) setLoading(true); setError(""); setLogs(await getApplicationLogs({ limit: 100, level: level || undefined })); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load logs."); }
    finally { setLoading(false); }
  }, [level]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = window.setInterval(() => { if (document.visibilityState === "visible") load(true); }, 30_000);
    return () => window.clearInterval(timer);
  }, [autoRefresh, load]);
  const visibleJson = useMemo(() => JSON.stringify(logs, null, 2), [logs]);
  const download = () => { const url = URL.createObjectURL(new Blob([visibleJson], { type: "application/json" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `ontor-logs-${new Date().toISOString()}.json`; anchor.click(); URL.revokeObjectURL(url); };
  return <AdminShell>
    <PageHeader eyebrow="Monitoring" title="Application logs" description="Inspect the latest server events. Auto-refresh pauses whenever this tab is hidden." action={<button onClick={() => load()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold"><RefreshCw className="h-4 w-4" />Refresh</button>} />
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="text-sm font-semibold text-slate-600">Level <select value={level} onChange={event => setLevel(event.target.value)} className="ml-2 rounded-xl border border-slate-200 px-3 py-2 font-normal"><option value="">All levels</option>{levels.slice(1).map(value => <option key={value}>{value}</option>)}</select></label>
      <button onClick={() => setAutoRefresh(value => !value)} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${autoRefresh ? "bg-blue-50 text-blue-700" : "border border-slate-200"}`}>{autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{autoRefresh ? "Auto-refresh on" : "Auto-refresh off"}</button>
      <div className="ml-auto flex gap-2"><button onClick={() => navigator.clipboard.writeText(visibleJson)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><Copy className="h-4 w-4" />Copy</button><button onClick={download} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><Download className="h-4 w-4" />Download</button></div>
    </div>
    {loading ? <LoadingState label="Reading application logs…" /> : error ? <ErrorState message={error} onRetry={() => load()} /> : logs.length === 0 ? <EmptyState title="No application logs" description="The backend returned no events for this level." /> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Time</th><th className="px-4 py-3">Level</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Context</th></tr></thead><tbody className="divide-y">{logs.map((log, index) => <tr key={log.id ?? `${log.timestamp}-${index}`}><td className="whitespace-nowrap px-4 py-3 text-slate-500">{formatDate(log.timestamp ?? log.createdAt)}</td><td className="px-4 py-3"><StatusBadge value={log.level.toUpperCase()} /></td><td className="px-4 py-3 font-medium">{log.message}</td><td className="max-w-sm truncate px-4 py-3 font-mono text-xs text-slate-500">{log.context || log.metadata ? JSON.stringify(log.context ?? log.metadata) : "—"}</td></tr>)}</tbody></table></div></div>}
  </AdminShell>;
}
