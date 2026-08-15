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
  updateOrderStatus,
  type AdminOrder,
  type OrderStatus,
} from "@/lib/admin";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const orderStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"];

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const toast = useToast();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("PENDING");
  const [notes, setNotes] = useState("");

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const nextOrder = await getOrderById(orderId);
      setOrder(nextOrder ?? null);
      if (nextOrder?.status) setStatus(nextOrder.status);
      setNotes(nextOrder?.notes ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load order.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleUpdate = async () => {
    try {
      setSubmitting(true);
      await updateOrderStatus(orderId, { status, notes: notes.trim() || undefined });
      toast.success("Order status updated");
      setModalOpen(false);
      await loadOrder();
    } catch (err) {
      toast.error("Update failed", err instanceof Error ? err.message : "Could not update order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Orders"
        title="Order details"
        action={<Link href="/admin/orders" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold">Back to orders</Link>}
      />
      {loading ? <LoadingState label="Loading order..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadOrder} /> : null}
      {order && !loading ? (
        <>
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{order.orderNumber || order.id}</h2>
                <p className="mt-1 text-sm text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
              <button onClick={() => setModalOpen(true)} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Update status</button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailRow label="Customer" value={order.user?.name || "Customer"} />
              <DetailRow label="Email" value={order.user?.email || "Not available"} />
              <DetailRow label="Order status" value={<StatusBadge value={order.status} />} />
              <DetailRow label="Payment" value={<StatusBadge value={order.paymentStatus} />} />
              <DetailRow label="Total" value={formatCurrency(order.totalCost)} />
              <DetailRow label="Subtotal" value={formatCurrency(order.subtotal)} />
              <DetailRow label="Discount" value={formatCurrency(order.discountTotal)} />
              <DetailRow label="Notes" value={order.notes || "None"} />
            </div>
          </section>

          <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Items and delivery</h2>
            <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {(order.items ?? []).map((item) => (
                <div key={item.id} className="grid gap-3 px-4 py-3 sm:grid-cols-[1fr_auto_auto]">
                  <div>
                    <p className="font-semibold">{item.productTitle || item.product?.title || "Item"}</p>
                    <p className="text-xs text-slate-500">Qty {item.quantity} • {item.productType || item.product?.type}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice ?? Number(item.price || 0) * item.quantity)}</p>
                  <StatusBadge value={item.deliveryStatus} />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">Payment timeline</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DetailRow label="Method" value={order.payment?.paymentMethod || "Not available"} />
              <DetailRow label="Status" value={<StatusBadge value={order.payment?.paymentStatus || order.paymentStatus} />} />
              <DetailRow label="Transaction" value={order.payment?.transactionId || "Not added"} />
              <DetailRow label="Paid at" value={formatDate(order.payment?.paidAt)} />
            </div>
          </section>

          <ConfirmDialog open={modalOpen} title="Update order status" confirmLabel="Update" loading={submitting} onClose={() => setModalOpen(false)} onConfirm={handleUpdate}>
            <div className="space-y-3">
              <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
                {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Notes" />
            </div>
          </ConfirmDialog>
        </>
      ) : null}
    </AdminShell>
  );
}
