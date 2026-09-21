"use client";

import { ApiEmpty, ApiErrorState, ApiLoading } from "@/components/ApiState";
import { useCustomerTopUpOrders } from "@/hooks/api/use-game-top-up-api";
import { formatMoney } from "@/lib/gift-card";
import { humanizeStatus } from "@/lib/commerce-status";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CustomerTopUpOrders() {
  const [page, setPage] = useState(1);
  const query = useCustomerTopUpOrders({ page, limit: 10 });
  return <main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-5xl py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.18em] text-indigo-700">Account</p><h1 className="mt-2 text-3xl font-black text-slate-950">Game Top-Up Orders</h1><p className="mt-2 text-sm text-slate-500">Track payment and fulfillment from the backend.</p></div><Link href="/top-up" className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Top up a game</Link></div>{query.isLoading ? <div className="mt-8"><ApiLoading label="Loading top-up orders…" /></div> : query.isError ? <div className="mt-8"><ApiErrorState error={query.error} onRetry={() => query.refetch()} /></div> : !query.data?.data.length ? <div className="mt-8"><ApiEmpty title="No top-up orders yet" description="Choose a game and package to place your first order." /></div> : <section className="mt-8 space-y-4">{query.data.data.map(order => { const item = order.items[0]; return <Link key={order.id} href={`/profile/game-topup-orders/${encodeURIComponent(order.id)}`} className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300"><div className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-700"><Gamepad2 className="h-6 w-6" /></span><div><p className="text-xs font-bold uppercase tracking-wide text-indigo-700">{order.orderNumber}</p><h2 className="mt-1 text-lg font-black text-slate-950">{item?.game ?? "Game Top-Up"}</h2><p className="mt-1 text-sm text-slate-500">{item?.package ?? "Package"} · {new Date(order.createdAt).toLocaleString()}</p>{item?.accountDetails ? <p className="mt-2 text-xs text-slate-500">{Object.entries(item.accountDetails).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p> : null}</div></div><div className="text-right"><p className="text-lg font-black text-slate-950">{formatMoney(order.amount ?? order.totalBdt, order.currency ?? "BDT")}</p><div className="mt-2 flex flex-wrap justify-end gap-2"><Badge value={`Payment: ${order.paymentStatus}`} /><Badge value={`Top-Up: ${item?.fulfillmentStatus ?? item?.status ?? "PENDING"}`} /></div></div></div></Link>; })}<div className="flex justify-center gap-3 pt-4"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold disabled:opacity-40">Previous</button><span className="px-3 py-2 text-sm text-slate-500">Page {page} of {query.data.meta.totalPages}</span><button type="button" disabled={page >= query.data.meta.totalPages} onClick={() => setPage(value => value + 1)} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold disabled:opacity-40">Next</button></div></section>}</div></main>;
}

function Badge({ value }: { value: string }) {
  const positive = /PAID|SUCCESS|COMPLETED/.test(value);
  const negative = /FAILED|CANCELLED/.test(value);
  const [prefix, raw] = value.split(": ");
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${positive ? "bg-emerald-50 text-emerald-700" : negative ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}>{raw ? `${prefix}: ${humanizeStatus(raw)}` : humanizeStatus(value)}</span>;
}
