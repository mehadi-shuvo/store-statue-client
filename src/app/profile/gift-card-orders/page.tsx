"use client";

import { ApiEmpty, ApiErrorState, ApiLoading } from "@/components/ApiState";
import { RouteGuard } from "@/components/RouteGuard";
import { useGiftCardOrders } from "@/hooks/api/use-gift-card-api";
import { formatMoney } from "@/lib/gift-card";
import { humanizeStatus } from "@/lib/commerce-status";
import { ArrowRight, Gift, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function Badge({ value }: { value: string }) {
  const tone = ["COMPLETED", "DELIVERED", "PAID"].includes(value) ? "bg-emerald-50 text-emerald-700" : ["FAILED", "CANCELLED"].includes(value) ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{humanizeStatus(value)}</span>;
}

export default function GiftCardOrdersPage() {
  const [page, setPage] = useState(1);
  const query = useGiftCardOrders({ page, limit: 20 });
  const orders = query.data?.data ?? [];
  return <RouteGuard roles={["CUSTOMER"]}><main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-6xl py-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">Your account</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Gift-card orders</h1><p className="mt-3 text-sm text-slate-500">Codes stay hidden here. Open an owned completed order to reveal delivered codes.</p></div><Link href="/gift-cards" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Browse gift cards<ArrowRight className="h-4 w-4" /></Link></div>
    {query.isLoading ? <ApiLoading label="Loading your orders…" /> : query.isError ? <ApiErrorState error={query.error} onRetry={() => query.refetch()} /> : orders.length === 0 ? <ApiEmpty title="No gift-card orders yet" description="Your purchases will appear here." /> : <div className="space-y-4">{orders.map(order => <Link key={order.id} href={`/profile/gift-card-orders/${order.id}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-lg"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Gift className="h-5 w-5" /></span><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{order.orderNumber}</p><h2 className="mt-1 text-lg font-black text-slate-950">{order.items?.[0]?.giftCardName || "Gift card order"}{(order.items?.length ?? 0) > 1 ? ` +${order.items.length - 1} more` : ""}</h2><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleString()}</p></div></div><p className="text-xl font-black text-slate-950">{formatMoney(order.totalBdt, "BDT")}</p></div><div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4"><Badge value={order.status} /><Badge value={order.paymentStatus} />{order.items?.map((item, index) => <span key={item.id || index} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"><PackageCheck className="h-3.5 w-3.5" />{item.brand} {formatMoney(item.faceValue, item.currency)} × {item.quantity} · {item.deliveryStatus}</span>)}</div></Link>)}</div>}
    {query.data && query.data.meta.totalPages > 1 ? <div className="mt-8 flex items-center justify-center gap-3"><button onClick={() => setPage(value => Math.max(1, value - 1))} disabled={page <= 1} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold disabled:opacity-50">Previous</button><span className="text-sm text-slate-500">Page {page} of {query.data.meta.totalPages}</span><button onClick={() => setPage(value => Math.min(query.data!.meta.totalPages, value + 1))} disabled={page >= query.data.meta.totalPages} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold disabled:opacity-50">Next</button></div> : null}
  </div></main></RouteGuard>;
}
