"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  ConfirmDialog,
  DetailRow,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  getOrderById,
  getPaymentById,
  verifyPayment,
  type AdminPayment,
  type PaymentStatus,
} from "@/lib/admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const statuses: PaymentStatus[] = ["REFUND_PENDING", "REFUNDED", "REFUND_FAILED"];

export default function PaymentDetailsPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const toast = useToast();
  const [payment, setPayment] = useState<AdminPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    paymentStatus: "REFUND_PENDING" as PaymentStatus,
    transactionId: "",
    providerPaymentId: "",
    failureReason: "",
  });

  const loadPayment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const nextPayment = await getPaymentById(paymentId);
      setPayment(nextPayment ?? null);
      setForm({
        paymentStatus: statuses.includes(nextPayment?.paymentStatus as PaymentStatus) ? nextPayment!.paymentStatus : "REFUND_PENDING",
        transactionId: nextPayment?.transactionId ?? "",
        providerPaymentId: nextPayment?.providerPaymentId ?? "",
        failureReason: nextPayment?.failureReason ?? "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load payment.");
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => { loadPayment(); }, [loadPayment]);

  const handleVerify = async () => {
    try {
      setSubmitting(true);
      const updated = await verifyPayment(paymentId, {
        paymentStatus: form.paymentStatus,
        transactionId: form.transactionId.trim() || null,
        providerPaymentId: form.providerPaymentId.trim() || null,
        failureReason: form.failureReason.trim() || null,
      });
      if (payment?.order?.id) {
        await getOrderById(payment.order.id);
      }
      setPayment(updated ?? null);
      toast.success("Payment verified");
      setModalOpen(false);
      await loadPayment();
    } catch (err) {
      toast.error("Verification failed", err instanceof Error ? err.message : "Could not verify payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader eyebrow="Payments" title="Payment details" action={<Link href="/admin/payments" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold">Back to payments</Link>} />
      {loading ? <LoadingState label="Loading payment..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadPayment} /> : null}
      {payment && !loading ? (
        <>
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><h2 className="text-xl font-black">{payment.transactionId || payment.id}</h2><p className="mt-1 text-sm text-slate-500">{formatDate(payment.createdAt)}</p></div>
              <button onClick={() => setModalOpen(true)} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Verify payment</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailRow label="Status" value={<StatusBadge value={payment.paymentStatus} />} />
              <DetailRow label="Method" value={payment.paymentMethod} />
              <DetailRow label="Amount" value={formatCurrency(payment.amount ?? payment.order?.totalCost)} />
              <DetailRow label="Currency" value={payment.currency || "BDT"} />
              <DetailRow label="Provider ID" value={payment.providerPaymentId || "Not added"} />
              <DetailRow label="Payer" value={payment.payerAccount || "Not added"} />
              <DetailRow label="Paid at" value={formatDate(payment.paidAt)} />
              <DetailRow label="Failure reason" value={payment.failureReason || "None"} />
            </div>
          </section>
          <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Related order</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailRow label="Order" value={payment.order?.orderNumber || payment.order?.id || "Not available"} />
              <DetailRow label="Customer" value={payment.order?.user?.name || "Customer"} />
              <DetailRow label="Order status" value={<StatusBadge value={payment.order?.status} />} />
              <DetailRow label="Order total" value={formatCurrency(payment.order?.totalCost)} />
            </div>
          </section>
          <ConfirmDialog open={modalOpen} title="Verify payment" confirmLabel="Save verification" loading={submitting} onClose={() => setModalOpen(false)} onConfirm={handleVerify}>
            <div className="space-y-3">
              <select value={form.paymentStatus} onChange={(event) => setForm((current) => ({ ...current, paymentStatus: event.target.value as PaymentStatus }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <input value={form.transactionId} onChange={(event) => setForm((current) => ({ ...current, transactionId: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Transaction ID" />
              <input value={form.providerPaymentId} onChange={(event) => setForm((current) => ({ ...current, providerPaymentId: event.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Provider payment ID" />
              <textarea value={form.failureReason} onChange={(event) => setForm((current) => ({ ...current, failureReason: event.target.value }))} className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Failure reason" />
            </div>
          </ConfirmDialog>
        </>
      ) : null}
    </AdminShell>
  );
}
