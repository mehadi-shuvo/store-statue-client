"use client";

import { ErrorAlert, LoadingSpinner } from "@/components/payment/PaymentUi";
import { useToast } from "@/context/ToastContext";
import { useGiftCardOrder, useGiftCardOrderDelivery } from "@/hooks/api/use-gift-card-api";
import { ApiError } from "@/lib/api";
import { formatMoney } from "@/lib/gift-card";
import type { CompletedGiftCardOrderDelivery } from "@/types/gift-card";
import {
  Check,
  CheckCircle2,
  Clipboard,
  Eye,
  EyeOff,
  History,
  LifeBuoy,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MAX_VERIFICATION_RETRIES = 3;
const VERIFICATION_DELAY_MS = 2_000;

function maskedCode(code: string) {
  const suffix = code.trim().slice(-4);
  return suffix ? `••••-••••-••••-${suffix}` : "••••-••••-••••-••••";
}

export default function GiftCardPaymentSuccess({ orderId }: { orderId: string }) {
  const query = useGiftCardOrderDelivery(orderId);
  const orderQuery = useGiftCardOrder(orderId);
  const { refetch } = query;
  const { refetch: refetchOrder } = orderQuery;
  const [verificationRetries, setVerificationRetries] = useState(0);

  const waitingForBackend =
    orderQuery.data?.paymentStatus === "PENDING" ||
    orderQuery.data?.paymentStatus === "INITIATED" ||
    orderQuery.data?.paymentStatus === "PROCESSING" ||
    query.data?.status === "PENDING" ||
    query.data?.status === "PROCESSING" ||
    (query.error instanceof ApiError && query.error.status === 404);

  useEffect(() => {
    if (!waitingForBackend || verificationRetries >= MAX_VERIFICATION_RETRIES) return;
    let active = true;
    const timeout = window.setTimeout(() => {
      void Promise.all([refetch(), refetchOrder()]).finally(() => {
        if (active) setVerificationRetries(current => current + 1);
      });
    }, VERIFICATION_DELAY_MS);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [refetch, refetchOrder, verificationRetries, waitingForBackend]);

  if (query.isLoading || orderQuery.isLoading || (waitingForBackend && verificationRetries < MAX_VERIFICATION_RETRIES)) {
    return <VerificationPanel attempt={verificationRetries} />;
  }

  if (query.data?.status === "COMPLETED" && orderQuery.data?.paymentStatus === "PAID") {
    return <DeliveredCards delivery={query.data} paidAmount={orderQuery.data.totalBdt} />;
  }

  const retryStatus = () => {
    setVerificationRetries(0);
    void Promise.all([query.refetch(), refetchOrder()]);
  };

  return (
    <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <ErrorAlert
        title={waitingForBackend ? "Payment verification is taking longer than expected" : "Delivery is not available"}
        message={waitingForBackend
          ? "Your card remains protected while the backend finishes verification. Check your order or try the status again."
          : "We could not retrieve a verified delivery for this account. No gift-card code has been displayed."}
      />
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/profile/gift-card-orders/${encodeURIComponent(orderId)}`} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">
          <History className="h-4 w-4" />View order
        </Link>
        <button type="button" onClick={retryStatus} disabled={query.isFetching} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${query.isFetching ? "animate-spin" : ""}`} />Retry status
        </button>
        <Link href="/profile" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
          <LifeBuoy className="h-4 w-4" />Contact support
        </Link>
      </div>
    </section>
  );
}

function VerificationPanel({ attempt }: { attempt: number }) {
  return (
    <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <LoadingSpinner label="Confirming your payment..." />
      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">
        The backend is confirming payment and assigning your gift card. Keep this page open; the card stays hidden until verification completes.
      </p>
      {attempt > 0 ? <p className="mt-3 text-xs font-semibold text-slate-400">Verification attempt {attempt + 1} of {MAX_VERIFICATION_RETRIES + 1}</p> : null}
    </section>
  );
}

function DeliveredCards({ delivery, paidAmount }: { delivery: CompletedGiftCardOrderDelivery; paidAmount: string }) {
  const toast = useToast();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState("");
  const emailDelivered = useMemo(
    () => delivery.products.every(product => product.delivery.every(card => card.emailStatus === "DELIVERED")),
    [delivery.products],
  );

  const copyCode = async (key: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      toast.success("Copied", "Gift card code copied to your clipboard.");
      window.setTimeout(() => setCopied(current => current === key ? "" : current), 1_800);
    } catch {
      toast.error("Copy failed", "Please reveal and select the code manually.");
    }
  };

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-[1.75rem] border border-emerald-200 bg-white shadow-sm">
      <header className="bg-emerald-600 px-6 py-8 text-center text-white sm:px-10">
        <CheckCircle2 className="mx-auto h-14 w-14" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-black">Payment successful</h2>
        <p className="mt-2 text-sm text-emerald-50">The backend verified your payment and released your gift card.</p>
      </header>

      <div className="space-y-6 p-6 sm:p-10">
        {delivery.products.map((product, productIndex) => (
          <article key={`${product.name}:${productIndex}`}>
            <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">{product.brand}</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">{product.name}</h3>
            <p className="mt-1 text-sm font-semibold text-slate-500">Value: {formatMoney(product.value, product.currency)}</p>

            <div className="mt-5 space-y-3">
              {product.delivery.map((card, cardIndex) => {
                const key = `${productIndex}:${cardIndex}`;
                const visible = Boolean(revealed[key]);
                return (
                  <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Gift card code</p>
                    <p className="mt-2 break-all font-mono text-base font-black tracking-wide text-slate-950 sm:text-lg" aria-label={visible ? "Revealed gift card code" : "Masked gift card code"}>
                      {visible ? card.code : maskedCode(card.code)}
                    </p>
                    {card.pin ? (
                      <p className="mt-2 font-mono text-sm font-bold text-slate-700">
                        PIN: {visible ? card.pin : "••••"}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" aria-label={visible ? "Hide gift card code" : "Reveal gift card code"} aria-pressed={visible} onClick={() => setRevealed(current => ({ ...current, [key]: !visible }))} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}{visible ? "Hide" : "Reveal"}
                      </button>
                      <button type="button" aria-label="Copy gift card code" onClick={() => copyCode(key, card.code)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">
                        {copied === key ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}{copied === key ? "Copied" : "Copy code"}
                      </button>
                    </div>
                    {card.expiryDate ? <p className="mt-3 text-xs text-slate-500">Expires {new Date(card.expiryDate).toLocaleDateString()}</p> : null}
                  </div>
                );
              })}
            </div>
          </article>
        ))}

        <dl className="grid gap-3 border-t border-slate-200 pt-6 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-500">Transaction ID</dt><dd className="mt-1 break-all font-mono font-bold text-slate-950">{delivery.payment.trxId}</dd></div>
          <div><dt className="text-slate-500">Order</dt><dd className="mt-1 font-mono font-bold text-slate-950">#{delivery.orderNumber}</dd></div>
          <div><dt className="text-slate-500">Paid amount</dt><dd className="mt-1 font-bold text-slate-950">{formatMoney(paidAmount, "BDT")}</dd></div>
        </dl>

        {emailDelivered ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">A copy has been sent to your email.</p> : null}

        <div className="flex flex-wrap gap-3">
          <Link href={`/profile/gift-card-orders/${encodeURIComponent(delivery.orderId)}`} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"><History className="h-4 w-4" />View order details</Link>
          <Link href="/gift-cards" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"><ShoppingBag className="h-4 w-4" />Continue shopping</Link>
        </div>
      </div>
    </section>
  );
}
