"use client";

import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/AdminUi";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminUnauthorizedPage() {
  return (
    <AdminShell>
      <PageHeader
        eyebrow="Access"
        title="Unauthorized"
        description="Your admin role does not have permission to open this page."
      />
      <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-1 h-6 w-6 shrink-0" />
          <div>
            <h2 className="text-lg font-bold">Super admin access required</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6">
              This area is hidden from regular admin accounts. Return to the
              dashboard or ask a super admin to complete this action.
            </p>
            <Link
              href="/admin"
              className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
