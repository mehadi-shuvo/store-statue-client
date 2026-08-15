"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  SearchInput,
  formatDate,
  paginate,
} from "@/components/admin/AdminUi";
import { getAuditLogs, type AuditLog } from "@/lib/admin";
import { useEffect, useMemo, useState } from "react";

const pageSize = 12;

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");
      setLogs(await getAuditLogs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesSearch = [log.action, log.entityType, log.entityId, log.actor?.name, log.actor?.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
      const matchesDate = date ? log.createdAt?.startsWith(date) : true;
      return matchesSearch && matchesDate;
    });
  }, [date, logs, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = paginate(filtered, page, pageSize);

  return (
    <AdminShell>
      <PageHeader eyebrow="Security" title="Audit logs" description="Review admin actions, targets, and timestamps." />
      <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <input type="date" value={date} onChange={(event) => { setDate(event.target.value); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm" />
      </div>
      {loading ? <LoadingState label="Loading audit logs..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadLogs} /> : null}
      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="px-4 py-3">Admin</th><th className="px-4 py-3">Action</th><th className="px-4 py-3">Target</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">IP</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3"><p className="font-semibold">{log.actor?.name || "System"}</p><p className="text-xs text-slate-500">{log.actor?.email}</p></td>
                      <td className="px-4 py-3 font-semibold">{log.action}</td>
                      <td className="px-4 py-3">{log.entityType}{log.entityId ? ` / ${log.entityId}` : ""}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(log.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-500">{typeof log.metadata === "object" && log.metadata && "ip" in log.metadata ? String((log.metadata as { ip?: unknown }).ip) : "Not provided"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : <EmptyState title="No audit logs found" />
      ) : null}
    </AdminShell>
  );
}
