"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  DetailRow,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
  formatDate,
} from "@/components/admin/AdminUi";
import { getAdminById, type AdminProfile } from "@/lib/admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdminDetailsPage() {
  const { adminId } = useParams<{ adminId: string }>();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAdmin = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setAdmin((await getAdminById(adminId)) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load admin.");
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  return (
    <AdminShell superAdminOnly>
      <PageHeader
        eyebrow="Staff"
        title="Admin details"
        action={
          <Link href="/admin/admins" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold">
            Back to admins
          </Link>
        }
      />
      {loading ? <LoadingState label="Loading admin..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadAdmin} /> : null}
      {admin && !loading ? (
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <DetailRow label="Name" value={admin.name || "Not available"} />
            <DetailRow label="Email" value={admin.email || "Not available"} />
            <DetailRow label="Phone" value={admin.phone || "Not added"} />
            <DetailRow label="Role" value={<StatusBadge value={admin.role} />} />
            <DetailRow label="Status" value={<StatusBadge value={!admin.isDeleted} />} />
            <DetailRow label="Created" value={formatDate(admin.createdAt)} />
            <DetailRow label="Updated" value={formatDate(admin.updatedAt)} />
          </div>
        </section>
      ) : null}
    </AdminShell>
  );
}
