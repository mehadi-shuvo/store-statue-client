"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  ConfirmDialog,
  DetailRow,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
  formatDate,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  getUserById,
  resolveUserIssue,
  updateUserStatus,
  type ManagedUser,
} from "@/lib/admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function UserDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const toast = useToast();
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"status" | "resolve" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setUser((await getUserById(userId)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load user.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleStatusChange = async () => {
    if (!user || !reason.trim()) {
      toast.error("Reason required");
      return;
    }
    try {
      setSubmitting(true);
      await updateUserStatus(user.id, {
        isDeleted: !user.isDeleted,
        reason: reason.trim(),
      });
      toast.success(user.isDeleted ? "User restored" : "User deactivated");
      setModal(null);
      setReason("");
      await loadUser();
    } catch (err) {
      toast.error("Action failed", err instanceof Error ? err.message : "Could not update user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    if (!note.trim()) {
      toast.error("Resolution note required");
      return;
    }
    try {
      setSubmitting(true);
      await resolveUserIssue(userId, note.trim());
      toast.success("Issue resolved");
      setModal(null);
      setNote("");
    } catch (err) {
      toast.error("Action failed", err instanceof Error ? err.message : "Could not resolve issue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Customers"
        title="User details"
        action={<Link href="/admin/users" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold">Back to users</Link>}
      />
      {loading ? <LoadingState label="Loading user..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadUser} /> : null}
      {user && !loading ? (
        <>
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailRow label="Name" value={user.name} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Phone" value={user.phone || "Not added"} />
              <DetailRow label="Role" value={<StatusBadge value={user.role} />} />
              <DetailRow label="Status" value={<StatusBadge value={!user.isDeleted} />} />
              <DetailRow label="Created" value={formatDate(user.createdAt)} />
              <DetailRow label="Orders" value={user._count?.orders ?? 0} />
              <DetailRow label="Reviews" value={user._count?.reviews ?? 0} />
              <DetailRow label="Addresses" value={user._count?.addresses ?? 0} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/admin/orders?userId=${user.id}`} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">View orders</Link>
              <button onClick={() => setModal("status")} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold">
                {user.isDeleted ? "Restore user" : "Deactivate user"}
              </button>
              {user.role === "CUSTOMER" ? (
                <button onClick={() => setModal("resolve")} className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold">Resolve issue</button>
              ) : null}
            </div>
          </section>

          <ConfirmDialog
            open={modal === "status"}
            title={user.isDeleted ? "Restore user" : "Deactivate user"}
            description="Add a reason for the audit log before changing account status."
            confirmLabel={user.isDeleted ? "Restore" : "Deactivate"}
            loading={submitting}
            onClose={() => setModal(null)}
            onConfirm={handleStatusChange}
          >
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Reason" />
          </ConfirmDialog>

          <ConfirmDialog
            open={modal === "resolve"}
            title="Resolve customer issue"
            confirmLabel="Submit note"
            loading={submitting}
            onClose={() => setModal(null)}
            onConfirm={handleResolve}
          >
            <textarea value={note} onChange={(event) => setNote(event.target.value)} className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Resolution note" />
          </ConfirmDialog>
        </>
      ) : null}
    </AdminShell>
  );
}
