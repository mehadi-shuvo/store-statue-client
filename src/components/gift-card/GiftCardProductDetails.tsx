"use client";

import { ApiErrorState } from "@/components/ApiState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useAddGiftCardToCart, useBuyNowCheckout, useGiftCardDetail } from "@/hooks/api/use-gift-card-api";
import { ApiError } from "@/lib/api";
import { rememberPendingVerificationEmail } from "@/lib/auth-flow";
import { rememberPaymentAttempt } from "@/lib/payment-attempt";
import { formatMoney, getGiftCardErrorCode, getGiftCardErrorMessage, productImage } from "@/lib/gift-card";
import { createCheckoutIdempotencyKey } from "@/services/api/gift-card.service";
import { ArrowLeft, BadgeCheck, Check, Clock3, Gift, Loader2, Mail, ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function DetailSkeleton() {
  return <div role="status" aria-label="Loading gift card" className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white lg:grid-cols-2"><div className="aspect-square animate-pulse bg-slate-100" /><div className="space-y-5 p-7 lg:p-10">{["w-20", "w-3/4", "w-full", "w-2/3", "w-full"].map((width, index) => <div key={index} className={`h-7 animate-pulse rounded bg-slate-100 ${width}`} />)}</div></div>;
}

export default function GiftCardProductDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const query = useGiftCardDetail(slug);
  const addMutation = useAddGiftCardToCart();
  const buyMutation = useBuyNowCheckout();
  const [selectedId, setSelectedId] = useState("");
  const checkoutInFlight = useRef(false);
  const checkoutAttempt = useRef<{ productId: string; idempotencyKey: string } | null>(null);

  const firstInStock = useMemo(() => query.data?.denominations.find(item => item.inStock && item.isActive !== false)?.id ?? "", [query.data]);
  useEffect(() => {
    if (selectedId || !query.data) return;
    const intendedId = new URLSearchParams(window.location.search).get("buy");
    const intended = query.data.denominations.find(
      item => item.id === intendedId && item.inStock && item.isActive !== false,
    );
    setSelectedId(intended?.id ?? firstInStock);
  }, [firstInStock, query.data, selectedId]);
  const selected = query.data?.denominations.find(item => item.id === selectedId && item.inStock && item.isActive !== false) ?? null;

  const requireCustomer = () => {
    if (authLoading) return false;
    if (user?.role === "CUSTOMER") return true;
    toast.warning("Login required", "Sign in with a customer account to continue.");
    const intendedPath = selected
      ? `/gift-cards/${encodeURIComponent(slug)}?buy=${encodeURIComponent(selected.id)}#buy-now`
      : `/gift-cards/${encodeURIComponent(slug)}#buy-now`;
    router.push(`/login?returnTo=${encodeURIComponent(intendedPath)}`);
    return false;
  };

  const addToCart = async () => {
    if (!selected || !requireCustomer()) return;
    try {
      await addMutation.mutateAsync({ denominationId: selected.id, quantity: 1 });
      toast.success("Added to cart", "Stock and price will be checked again at checkout.");
    } catch (error) {
      if (getGiftCardErrorCode(error) === "GIFT_CARD_OUT_OF_STOCK") query.refetch();
      toast.error("Could not add gift card", getGiftCardErrorMessage(error));
    }
  };

  const buyNow = async () => {
    if (!selected || checkoutInFlight.current || !requireCustomer()) return;
    if (user?.isEmailVerified === false) {
      rememberPendingVerificationEmail(user.email);
      toast.warning("Email verification required", "Verify your account email before purchasing a gift card.");
      const intendedPath = `/gift-cards/${encodeURIComponent(slug)}?buy=${encodeURIComponent(selected.id)}#buy-now`;
      router.push(`/verify-email?returnTo=${encodeURIComponent(intendedPath)}`);
      return;
    }
    checkoutInFlight.current = true;
    try {
      // The backend accepts the selected denomination through its productId
      // field and remains authoritative for inventory and pricing.
      if (checkoutAttempt.current?.productId !== selected.id) {
        checkoutAttempt.current = {
          productId: selected.id,
          idempotencyKey: createCheckoutIdempotencyKey(),
        };
      }
      const checkout = await buyMutation.mutateAsync(checkoutAttempt.current);
      rememberPaymentAttempt({ orderId: checkout.orderId, paymentId: checkout.paymentId, paymentExpiresAt: checkout.paymentExpiresAt, userId: user!.id });
      window.location.assign(checkout.paymentUrl);
    } catch (error) {
      checkoutInFlight.current = false;
      // Reuse the same key only when the network result is ambiguous. A known
      // backend rejection is a completed attempt and can safely receive a new key.
      if (!(error instanceof ApiError && error.status === 0)) {
        checkoutAttempt.current = null;
      }
      const code = getGiftCardErrorCode(error);
      if (code === "GIFT_CARD_OUT_OF_STOCK" || code === "INSUFFICIENT_GIFT_CARD_STOCK") {
        query.refetch();
      }
      const message =
        error instanceof ApiError && (error.status === 0 || error.status >= 500)
          ? "The payment service is temporarily unavailable. Please try again shortly."
          : getGiftCardErrorMessage(error, "We could not prepare your payment. Please try again.");
      toast.error("Could not start payment", message);
    }
  };

  return <main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-7xl py-8"><Link href="/gift-cards" className="mb-6 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:text-blue-700"><ArrowLeft className="h-4 w-4" />All gift cards</Link>
    {query.isLoading ? <DetailSkeleton /> : query.isError ? <ApiErrorState error={query.error} onRetry={() => query.refetch()} /> : query.data ? <>
      <section className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2"><div className="relative flex min-h-[360px] items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 lg:min-h-[620px]"><div className="relative aspect-[4/3] w-full max-w-xl"><Image src={productImage(query.data)} alt={`${query.data.name || query.data.title} artwork`} fill unoptimized priority className="object-contain drop-shadow-2xl" /></div></div>
        <div className="p-6 sm:p-9 lg:p-11"><p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">{query.data.brand}</p><h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{query.data.name || query.data.title}</h1><div className="mt-4 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"><Gift className="h-3.5 w-3.5" />Digital Gift Card</span><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><Clock3 className="h-3.5 w-3.5" />Instant Delivery</span>{query.data.region ? <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{query.data.region} · {query.data.currency}</span> : null}</div>
          {query.data.shortDescription || query.data.description ? <p className="mt-6 text-sm leading-7 text-slate-600">{query.data.shortDescription || query.data.description}</p> : null}
          <fieldset className="mt-8"><legend className="flex items-center justify-between gap-3 text-sm font-black text-slate-900"><span>Select denomination</span><span className="text-xs font-medium text-slate-500">Prices supplied by Ontor</span></legend><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{query.data.denominations.map(item => { const disabled = !item.inStock || item.isActive === false; const active = selectedId === item.id && !disabled; return <button key={item.id} type="button" disabled={disabled} aria-pressed={active} onClick={() => setSelectedId(item.id)} className={`relative rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${active ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-400"} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-45`}><span className="block text-base font-black text-slate-950">{formatMoney(item.faceValue, item.faceCurrency)}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{formatMoney(item.sellingPriceBdt, "BDT")}</span>{item.isPopular ? <span className="absolute -right-1.5 -top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">Popular</span> : null}{active ? <Check className="absolute bottom-3 right-3 h-4 w-4 text-blue-700" /> : null}{disabled ? <span className="mt-2 block text-[10px] font-bold uppercase tracking-wide text-rose-600">Out of stock</span> : null}</button>; })}</div></fieldset>
          <div className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">You pay</p><p className="mt-1 text-3xl font-black text-slate-950">{selected ? formatMoney(selected.sellingPriceBdt, "BDT") : "Unavailable"}</p></div>{selected ? <div className="text-right"><p className="text-xs text-slate-500">Card value</p><p className="mt-1 text-lg font-black text-slate-900">{formatMoney(selected.faceValue, selected.faceCurrency)}</p><p className="mt-1 text-xs font-semibold text-emerald-700">In stock</p></div> : null}</div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><button id="buy-now" type="button" disabled={!selected || authLoading || buyMutation.isPending} aria-busy={buyMutation.isPending} onClick={buyNow} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">{buyMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}{buyMutation.isPending ? "Redirecting to payment..." : "Buy now"}</button><button type="button" disabled={!selected || addMutation.isPending} onClick={addToCart} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-black text-slate-800 transition hover:border-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}Add to cart</button></div>
          <p className="mt-3 text-center text-xs font-semibold text-slate-500">Secure payment powered by aamarPay</p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Secure purchase</span><span className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" />Email delivery</span><span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-indigo-600" />Verified inventory</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-600" />Fast fulfillment</span></div>
        </div></section>
      {(query.data.description || query.data.instructions || query.data.termsAndConditions) ? <section className="mt-8 grid gap-5 lg:grid-cols-3">{query.data.description ? <InfoBlock title="About this gift card" text={query.data.description} /> : null}{query.data.instructions ? <InfoBlock title="How to redeem" text={query.data.instructions} /> : null}{query.data.termsAndConditions ? <InfoBlock title="Terms and conditions" text={query.data.termsAndConditions} /> : null}</section> : null}
    </> : null}
  </div></main>;
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-black text-slate-950">{title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{text}</p></article>;
}
