"use client";
import GiftCardPaymentSuccess from "./GiftCardPaymentSuccess";
import PaymentReservationCountdown from "./PaymentReservationCountdown";
import { LoadingSpinner, PaymentShell } from "./PaymentUi";
import { usePaymentReturnOrder } from "@/hooks/api/use-payment-return";
import { ApiError } from "@/lib/api";
import { isFulfillmentActive, isFulfillmentComplete, isPaymentPending, paymentPresentation } from "@/lib/commerce-status";
import { getPaymentAttempt } from "@/lib/payment-attempt";
import type { CustomerTopUpOrder } from "@/types/game-top-up";
import { AlertTriangle, CheckCircle2, Clock3, History, RefreshCw, XCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const DELAYS = [2000, 3000, 5000, 10000];
export default function PaymentReturnStatus({ orderId }: { orderId: string }) {
  const query = usePaymentReturnOrder(orderId); const [index, setIndex] = useState(0);
  const order = query.data?.order; const topup = query.data?.kind === "game-top-up" ? query.data.order : null;
  const fulfillment = topup ? (topup.fulfillmentStatus ?? topup.items[0]?.fulfillmentStatus ?? topup.items[0]?.status ?? "PENDING") : undefined;
  const polling = Boolean(order && (isPaymentPending(order.paymentStatus) || (order.paymentStatus === "PAID" && isFulfillmentActive(fulfillment))));
  const retry = useCallback(() => { setIndex(0); void query.refetch(); }, [query]);
  useEffect(() => { if (!polling || index >= DELAYS.length) return; const timer = window.setTimeout(() => void query.refetch().finally(() => setIndex(v => v + 1)), DELAYS[index]); return () => clearTimeout(timer); }, [index, polling, query]);
  const attempt = getPaymentAttempt(orderId);
  const timer = attempt?.paymentExpiresAt && order && isPaymentPending(order.paymentStatus) ? <div className="mx-auto mb-5 max-w-3xl"><PaymentReservationCountdown paymentExpiresAt={attempt.paymentExpiresAt} onExpired={retry} /></div> : null;
  if (!orderId) return <Shell><Panel title="Order reference missing" text="Open the order from Order History so the backend can check it." /></Shell>;
  if (query.isLoading) return <Shell><Loading /></Shell>;
  if (query.isError) { const offline = query.error instanceof ApiError && query.error.status === 0; return <Shell>{timer}<Panel title={offline ? "We couldn't check the payment status" : "We couldn't load this order"} text={offline ? "A network problem prevented the check. This does not mean the payment failed." : "The backend did not return an order available to this account."} actions={<Retry retry={retry} busy={query.isFetching} />} /></Shell>; }
  if (!query.data) return null;
  if (query.data.kind === "gift-card") {
    const gift = query.data.order;
    if (isPaymentPending(gift.paymentStatus)) return <Shell>{timer}{index >= DELAYS.length ? <Delayed href={`/profile/gift-card-orders/${gift.id}`} retry={retry} busy={query.isFetching} /> : <Loading />}</Shell>;
    if (gift.paymentStatus === "PAID") return <Shell><GiftCardPaymentSuccess orderId={gift.id} /></Shell>;
    const view = paymentPresentation(gift.paymentStatus); return <Shell><Panel danger={view.tone === "danger"} title={view.title} text={`${view.message} No gift-card code has been displayed.`} actions={<OrderLink href={`/profile/gift-card-orders/${gift.id}`} />} /></Shell>;
  }
  return <TopUp order={query.data.order} exhausted={index >= DELAYS.length} retry={retry} busy={query.isFetching} />;
}
function TopUp({ order, exhausted, retry, busy }: { order: CustomerTopUpOrder; exhausted: boolean; retry: () => void; busy: boolean }) {
  const status = order.fulfillmentStatus ?? order.items[0]?.fulfillmentStatus ?? order.items[0]?.status ?? "PENDING";
  if (isPaymentPending(order.paymentStatus)) return <Shell>{exhausted ? <Delayed href={`/profile/game-topup-orders/${order.id}`} retry={retry} busy={busy} /> : <Loading />}</Shell>;
  if (order.paymentStatus !== "PAID") { const view = paymentPresentation(order.paymentStatus); return <Shell><Panel danger={view.tone === "danger"} title={view.title} text={`${view.message} Fulfillment has not been confirmed.`} actions={<OrderLink href={`/profile/game-topup-orders/${order.id}`} />} /></Shell>; }
  if (isFulfillmentComplete(status)) return <Shell><Panel success title="Top-up completed" text="Payment and provider fulfillment are both confirmed by the backend." actions={<OrderLink href={`/profile/game-topup-orders/${order.id}`} />} /></Shell>;
  if (status === "MANUAL_REVIEW") return <Shell><Panel title="Payment confirmed — order under review" text="Your payment is safe, but the order could not be completed automatically. Please do not submit another order." actions={<Actions id={order.id} retry={retry} busy={busy} />} /></Shell>;
  if (["FAILED", "FAILED_FINAL", "CANCELLED"].includes(status)) return <Shell><Panel danger title="Payment confirmed — top-up not completed" text={order.items[0]?.customerMessage || order.items[0]?.failureReason || "Contact support with your order number."} actions={<OrderLink href={`/profile/game-topup-orders/${order.id}`} />} /></Shell>;
  return <Shell><Panel clock title="Payment confirmed — top-up processing" text={exhausted ? "Processing is taking longer than expected. Check Order History and please do not submit another order." : status === "PROVIDER_PENDING" || status === "FAILED_RETRYABLE" ? "The provider is delayed. We are checking or retrying automatically. Please do not submit another order." : "Your top-up is queued or processing. Please do not submit another order."} actions={<Actions id={order.id} retry={retry} busy={busy} />} /></Shell>;
}
function Shell({ children }: { children: React.ReactNode }) { return <PaymentShell eyebrow="Verified order status" title="Checking payment and fulfillment" description="The authenticated backend order is authoritative. Gateway page names are ignored.">{children}</PaymentShell>; }
function Loading() { return <section aria-live="polite" className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center"><LoadingSpinner label="Confirming your payment..." /><p className="mt-4 text-sm text-slate-600">Payment return received. Waiting for backend verification.</p></section>; }
function Panel({ title, text, actions, danger, clock, success }: { title: string; text: string; actions?: React.ReactNode; danger?: boolean; clock?: boolean; success?: boolean }) { const Icon = success ? CheckCircle2 : danger ? XCircle : clock ? Clock3 : AlertTriangle; return <section role="status" className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center"><Icon className={`mx-auto h-14 w-14 ${success ? "text-emerald-600" : danger ? "text-rose-600" : clock ? "text-indigo-600" : "text-amber-500"}`} /><h2 className="mt-5 text-2xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>{actions}</section>; }
function Delayed({ href, retry, busy }: { href: string; retry: () => void; busy: boolean }) { return <Panel title="Payment confirmation is taking longer than expected" text="You can safely check this order from Order History. Please don't pay again while it is being verified." actions={<div className="mt-7 flex flex-wrap justify-center gap-3"><OrderLink href={href} /><Retry retry={retry} busy={busy} /></div>} />; }
function Retry({ retry, busy }: { retry: () => void; busy: boolean }) { return <button type="button" onClick={retry} disabled={busy} className="inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />Retry status check</button>; }
function OrderLink({ href }: { href: string }) { return <Link href={href} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"><History className="h-4 w-4" />View order</Link>; }
function Actions({ id, retry, busy }: { id: string; retry: () => void; busy: boolean }) { return <div className="mt-7 flex flex-wrap justify-center gap-3"><OrderLink href={`/profile/game-topup-orders/${id}`} /><Retry retry={retry} busy={busy} /></div>; }
