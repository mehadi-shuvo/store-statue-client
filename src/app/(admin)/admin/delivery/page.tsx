"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  StatusBadge,
  paginate,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  getDeliveryItems,
  updateDeliveryStatus,
  type AdminOrderItem,
  type DeliveryStatus,
} from "@/lib/admin";
import { useCallback, useEffect, useState } from "react";

const pageSize = 10;
const statuses: DeliveryStatus[] = ["PENDING", "PROCESSING", "DELIVERED", "FAILED", "CANCELLED", "REFUNDED"];

export default function DeliveryPage() {
  const toast = useToast();
  const [items, setItems] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<DeliveryStatus | "">("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminOrderItem | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("PENDING");
  const [fulfillmentReference, setFulfillmentReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setItems(await getDeliveryItems({ deliveryStatus: filter || undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load delivery items.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { loadItems(); }, [loadItems]);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const rows = paginate(items, page, pageSize);

  const openModal = (item: AdminOrderItem) => {
    setSelected(item);
    setDeliveryStatus(item.deliveryStatus ?? "PENDING");
    setFulfillmentReference(item.fulfillmentReference ?? "");
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      setSubmitting(true);
      await updateDeliveryStatus(selected.id, {
        deliveryStatus,
        fulfillmentReference: fulfillmentReference.trim() || null,
      });
      toast.success("Delivery updated");
      setSelected(null);
      await loadItems();
    } catch (err) {
      toast.error("Update failed", err instanceof Error ? err.message : "Could not update delivery.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader eyebrow="Fulfillment" title="Delivery management" description="Track pending and assigned digital delivery items." />
      <div className="mb-5 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <select value={filter} onChange={(event) => { setFilter(event.target.value as DeliveryStatus | ""); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="">All delivery status</option>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {loading ? <LoadingState label="Loading delivery items..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadItems} /> : null}
      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Delivery</th><th className="px-4 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3"><p className="font-semibold">{item.productTitle || item.product?.title}</p><p className="text-xs text-slate-500">{item.productType || item.product?.type}</p></td>
                      <td className="px-4 py-3">{item.order?.orderNumber || item.order?.id}</td>
                      <td className="px-4 py-3">{item.order?.user?.name || "Customer"}</td>
                      <td className="px-4 py-3"><StatusBadge value={item.deliveryStatus} /></td>
                      <td className="px-4 py-3 text-right"><button onClick={() => openModal(item)} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold">Update</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : <EmptyState title="No delivery items found" />
      ) : null}
      <ConfirmDialog open={Boolean(selected)} title="Update delivery" confirmLabel="Save" loading={submitting} onClose={() => setSelected(null)} onConfirm={handleUpdate}>
        <div className="space-y-3">
          <select value={deliveryStatus} onChange={(event) => setDeliveryStatus(event.target.value as DeliveryStatus)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <input value={fulfillmentReference} onChange={(event) => setFulfillmentReference(event.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Fulfillment reference" />
        </div>
      </ConfirmDialog>
    </AdminShell>
  );
}
