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
  formatCurrency,
  formatDate,
  paginate,
} from "@/components/admin/AdminUi";
import {
  getOrders,
  type AdminOrder,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/admin";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const pageSize = 10;
const orderStatuses: OrderStatus[] = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"];
const paymentStatuses: PaymentStatus[] = ["PENDING", "INITIATED", "PROCESSING", "PAID", "FAILED", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | "">("");
  const [userId, setUserId] = useState("");
  const [page, setPage] = useState(1);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setOrders(
        await getOrders({
          search: search.trim() || undefined,
          status: status || undefined,
          paymentStatus: paymentStatus || undefined,
          userId: userId || undefined,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, [paymentStatus, search, status, userId]);

  useEffect(() => {
    setUserId(new URLSearchParams(window.location.search).get("userId") ?? "");
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadOrders, 250);
    return () => window.clearTimeout(timeoutId);
  }, [loadOrders]);

  const pageCount = Math.max(1, Math.ceil(orders.length / pageSize));
  const rows = paginate(orders, page, pageSize);

  return (
    <AdminShell>
      <PageHeader eyebrow="Orders" title="Order management" description="Filter orders by status, payment state, customer, and order number." />
      <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search orders..." />
        <select value={status} onChange={(event) => { setStatus(event.target.value as OrderStatus | ""); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="">All order status</option>
          {orderStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={paymentStatus} onChange={(event) => { setPaymentStatus(event.target.value as PaymentStatus | ""); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="">All payment status</option>
          {paymentStatuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {loading ? <LoadingState label="Loading orders..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadOrders} /> : null}
      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3 font-semibold">{order.orderNumber || order.id}</td>
                      <td className="px-4 py-3"><p className="font-semibold">{order.user?.name || "Customer"}</p><p className="text-xs text-slate-500">{order.user?.email}</p></td>
                      <td className="px-4 py-3"><StatusBadge value={order.status} /></td>
                      <td className="px-4 py-3"><StatusBadge value={order.paymentStatus} /></td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(order.totalCost)}</td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-right"><Link href={`/admin/orders/${order.id}`} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : <EmptyState title="No orders found" />
      ) : null}
    </AdminShell>
  );
}
