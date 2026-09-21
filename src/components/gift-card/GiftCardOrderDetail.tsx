"use client";

import { ApiErrorState, ApiLoading } from "@/components/ApiState";
import { RouteGuard } from "@/components/RouteGuard";
import { useGiftCardOrder } from "@/hooks/api/use-gift-card-api";
import { formatMoney, maskSecret } from "@/lib/gift-card";
import { ArrowLeft, Check, Clipboard, Eye, EyeOff, Gift, Info, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function Status({ value }: { value: string }) {
  const good = ["COMPLETED", "DELIVERED", "PAID"].includes(value);
  const bad = ["FAILED", "CANCELLED"].includes(value);
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${good ? "bg-emerald-50 text-emerald-700" : bad ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{value.replaceAll("_", " ")}</span>;
}

export default function GiftCardOrderDetail({ orderId }: { orderId: string }) {
  const query = useGiftCardOrder(orderId);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState("");

  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(current => current === key ? "" : current), 1800);
  };

  return <RouteGuard roles={["CUSTOMER"]}><main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-5xl py-9"><Link href="/profile/gift-card-orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Gift-card orders</Link>
    {query.isLoading ? <div className="mt-6"><ApiLoading label="Loading your secure order…" /></div> : query.isError ? <div className="mt-6"><ApiErrorState error={query.error} onRetry={() => query.refetch()} /></div> : query.data ? <><section className="mt-6 overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9"><div className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">Order {query.data.orderNumber}</p><h1 className="mt-3 text-3xl font-black">{formatMoney(query.data.totalBdt, "BDT")}</h1><p className="mt-2 text-sm text-slate-300">Created {new Date(query.data.createdAt).toLocaleString()}</p></div><div className="flex flex-wrap gap-2"><Status value={query.data.status} /><Status value={query.data.paymentStatus} /></div></div>{query.data.paymentStatus === "PENDING" ? <div className="mt-6 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-amber-100"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-sm leading-6"><strong>Payment pending.</strong> Development/manual fulfillment can mark an order completed before payment is paid. This is not a payment-success confirmation.</p></div> : null}<div className="mt-6 flex items-center gap-2 text-sm text-slate-300"><Mail className="h-4 w-4" />Delivered to {query.data.deliveryEmail}</div></section>
      <section className="mt-7 space-y-5">{query.data.items.map((item, itemIndex) => { const mayReveal = query.data.status === "COMPLETED" && item.deliveryStatus === "DELIVERED"; return <article key={item.id || itemIndex} className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-blue-700">{item.brand}</p><h2 className="mt-1 text-xl font-black text-slate-950">{item.giftCardName}</h2><p className="mt-2 text-sm text-slate-500">{formatMoney(item.faceValue, item.currency)} × {item.quantity}</p></div><Status value={item.deliveryStatus} /></div>
        {mayReveal && item.deliveries?.length ? <div className="mt-6 space-y-3">{item.deliveries.map((delivery, deliveryIndex) => { const key = `${itemIndex}:${deliveryIndex}`; const visible = Boolean(revealed[key]); return <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Gift card code</p><p className="mt-1 break-all font-mono text-base font-black text-slate-950">{delivery.code ? (visible ? delivery.code : maskSecret(delivery.code)) : "Not provided"}</p></div>{delivery.code ? <div className="flex gap-2"><button type="button" onClick={() => setRevealed(value => ({ ...value, [key]: !visible }))} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold">{visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{visible ? "Hide" : "Reveal"}</button>{visible ? <button type="button" onClick={() => copy(`${key}:code`, delivery.code!)} className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white">{copied === `${key}:code` ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}{copied === `${key}:code` ? "Copied" : "Copy code"}</button> : null}</div> : null}</div>
          {delivery.pin ? <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">PIN</p><p className="mt-1 font-mono font-black">{visible ? delivery.pin : maskSecret(delivery.pin)}</p></div>{visible ? <button type="button" onClick={() => copy(`${key}:pin`, delivery.pin!)} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold">{copied === `${key}:pin` ? <Check className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}{copied === `${key}:pin` ? "Copied" : "Copy PIN"}</button> : null}</div> : null}
          {delivery.expiryDate ? <p className="mt-4 text-xs text-slate-500">Expires {new Date(delivery.expiryDate).toLocaleDateString()}</p> : null}</div>; })}</div> : <div className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-600"><ShieldCheck className="h-5 w-5 shrink-0 text-blue-600" /><p className="text-sm leading-6">Codes become available only after this owned order is completed and delivery is marked delivered.</p></div>}
      </article>; })}</section><p className="mt-6 flex items-center gap-2 text-xs text-slate-500"><Gift className="h-4 w-4" />Sensitive details are held only in short-lived memory and cleared when you leave or sign out.</p></> : null}
  </div></main></RouteGuard>;
}
