"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  StatusBadge,
  formatCurrency,
  formatDate,
  paginate,
} from "@/components/admin/AdminUi";
import { getPayments, type AdminPayment, type PaymentStatus } from "@/lib/admin";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const pageSize = 10;
const statuses: PaymentStatus[] = ["PENDING", "INITIATED", "PROCESSING", "PAID", "FAILED", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState(1);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setPayments(await getPayments({ paymentStatus: filter || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load payments.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadPayments(); }, [loadPayments]);
  const pageCount = Math.max(1, Math.ceil(payments.length / pageSize));
  const rows = paginate(payments, page, pageSize);

  return (
    <AdminShell>
      <PageHeader eyebrow="Payments" title="Payment management" description="Review payment issues and verify payment records." />
      <div className="mb-5 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <select value={filter} onChange={(event) => { setFilter(event.target.value as PaymentStatus | ""); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="">All payment status</option>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {loading ? <LoadingState label="Loading payments..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadPayments} /> : null}
      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 font-semibold">{payment.transactionId || payment.id}</td>
                      <td className="px-4 py-3">{payment.order?.user?.name || "Customer"}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(payment.amount ?? payment.order?.totalCost)}</td>
                      <td className="px-4 py-3">{payment.paymentMethod}</td>
                      <td className="px-4 py-3"><StatusBadge value={payment.paymentStatus} /></td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(payment.createdAt)}</td>
                      <td className="px-4 py-3 text-right"><Link href={`/admin/payments/${payment.id}`} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : <EmptyState title="No payments found" />
      ) : null}
    </AdminShell>
  );
}
