"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  SearchInput,
  StatusBadge,
  formatDate,
  paginate,
} from "@/components/admin/AdminUi";
import { getUsers, type ManagedUser, type UserRole } from "@/lib/admin";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const pageSize = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<"active" | "inactive" | "all">("all");
  const [page, setPage] = useState(1);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setUsers(
        await getUsers({
          search: search.trim() || undefined,
          role: role || undefined,
          status,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users.");
    } finally {
      setLoading(false);
    }
  }, [role, search, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadUsers, 250);
    return () => window.clearTimeout(timeoutId);
  }, [loadUsers]);

  const sortedUsers = useMemo(
    () =>
      [...users].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      ),
    [users],
  );
  const pageCount = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const rows = paginate(sortedUsers, page, pageSize);

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Customers"
        title="User management"
        description="Search users, inspect account status, and resolve customer issues."
      />

      <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <select value={role} onChange={(event) => { setRole(event.target.value as UserRole | ""); setPage(1); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="">All roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super admin</option>
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value as "active" | "inactive" | "all"); setPage(1); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? <LoadingState label="Loading users..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadUsers} /> : null}
      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge value={user.role} /></td>
                      <td className="px-4 py-3"><StatusBadge value={!user.isDeleted} /></td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3 text-right"><Link href={`/admin/users/${user.id}`} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : (
          <EmptyState title="No users found" />
        )
      ) : null}
    </AdminShell>
  );
}
