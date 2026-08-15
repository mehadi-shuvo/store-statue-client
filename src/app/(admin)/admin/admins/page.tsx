"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  ConfirmDialog,
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
import { useToast } from "@/context/ToastContext";
import {
  deactivateAdmin,
  getAdmins,
  restoreAdmin,
  updateAdminById,
  type AdminProfile,
} from "@/lib/admin";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const pageSize = 10;

export default function AdminManagementPage() {
  const toast = useToast();
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "name">("newest");
  const [includeInactive, setIncludeInactive] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminProfile | null>(null);
  const [action, setAction] = useState<"edit" | "deactivate" | "restore" | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [editForm, setEditForm] = useState({ name: "", phone: "" });

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setAdmins(await getAdmins(includeInactive));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admins.");
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const nextAdmins = admins.filter((admin) =>
      [admin.name, admin.email, admin.phone, admin.role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );

    nextAdmins.sort((a, b) => {
      if (sort === "name") {
        return String(a.name).localeCompare(String(b.name));
      }
      return (
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
      );
    });

    return nextAdmins;
  }, [admins, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = paginate(filtered, page, pageSize);

  const openAction = (
    admin: AdminProfile,
    nextAction: "edit" | "deactivate" | "restore",
  ) => {
    setSelected(admin);
    setAction(nextAction);
    setCurrentPassword("");
    setEditForm({ name: admin.name ?? "", phone: admin.phone ?? "" });
  };

  const closeAction = () => {
    setSelected(null);
    setAction(null);
    setCurrentPassword("");
  };

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    try {
      setSubmitting(true);
      await updateAdminById(selected.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || null,
        currentPassword,
      });
      toast.success("Admin updated");
      closeAction();
      await loadAdmins();
    } catch (err) {
      toast.error(
        "Update failed",
        err instanceof Error ? err.message : "Could not update admin.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusAction = async () => {
    if (!selected || !action) return;
    try {
      setSubmitting(true);
      if (action === "deactivate") {
        await deactivateAdmin(selected.id, currentPassword);
        toast.success("Admin deactivated");
      } else {
        await restoreAdmin(selected.id, currentPassword);
        toast.success("Admin restored");
      }
      closeAction();
      await loadAdmins();
    } catch (err) {
      toast.error(
        "Action failed",
        err instanceof Error ? err.message : "Could not update admin status.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell superAdminOnly>
      <PageHeader
        eyebrow="Staff"
        title="Admin management"
        description="Search, inspect, update, deactivate, and restore admin accounts."
        action={
          <Link
            href="/admin/signup"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Create admin
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as "newest" | "name")}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="name">Name</option>
        </select>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(event) => setIncludeInactive(event.target.checked)}
          />
          Include inactive
        </label>
      </div>

      {loading ? <LoadingState label="Loading admins..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadAdmins} /> : null}

      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Admin</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.email}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge value={admin.role} /></td>
                      <td className="px-4 py-3"><StatusBadge value={!admin.isDeleted} /></td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(admin.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/admins/${admin.id}`} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">View</Link>
                          {admin.role !== "SUPER_ADMIN" ? (
                            <>
                              <button onClick={() => openAction(admin, "edit")} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">Edit</button>
                              <button onClick={() => openAction(admin, admin.isDeleted ? "restore" : "deactivate")} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">
                                {admin.isDeleted ? "Restore" : "Deactivate"}
                              </button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4">
              <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </div>
          </div>
        ) : (
          <EmptyState title="No admins found" />
        )
      ) : null}

      <ConfirmDialog
        open={Boolean(selected && action === "edit")}
        title="Update admin"
        confirmLabel="Save"
        loading={submitting}
        onClose={closeAction}
        onConfirm={() => {
          const form = document.getElementById("admin-edit-form") as HTMLFormElement | null;
          form?.requestSubmit();
        }}
      >
        <form id="admin-edit-form" onSubmit={handleEdit} className="space-y-3">
          <input value={editForm.name} onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Name" />
          <input value={editForm.phone} onChange={(event) => setEditForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone" />
          <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Your current password" />
        </form>
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(selected && (action === "deactivate" || action === "restore"))}
        title={`${action === "restore" ? "Restore" : "Deactivate"} admin`}
        description="Confirm this action with your super admin password."
        confirmLabel={action === "restore" ? "Restore" : "Deactivate"}
        loading={submitting}
        onClose={closeAction}
        onConfirm={handleStatusAction}
      >
        <input
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          placeholder="Your current password"
        />
      </ConfirmDialog>
    </AdminShell>
  );
}
