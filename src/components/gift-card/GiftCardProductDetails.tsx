"use client";

import { ApiErrorState } from "@/components/ApiState";
import DeliveryEmailDialog from "@/components/gift-card/DeliveryEmailDialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useAddGiftCardToCart, useGiftCardDetail, useInstantGiftCardBuy } from "@/hooks/api/use-gift-card-api";
import { formatMoney, getGiftCardErrorCode, getGiftCardErrorMessage, productImage } from "@/lib/gift-card";
import type { DeliveryEmailInput } from "@/types/gift-card";
import { ArrowLeft, BadgeCheck, Check, Clock3, Gift, Loader2, Mail, ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function DetailSkeleton() {
  return <div role="status" aria-label="Loading gift card" className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white lg:grid-cols-2"><div className="aspect-square animate-pulse bg-slate-100" /><div className="space-y-5 p-7 lg:p-10">{["w-20", "w-3/4", "w-full", "w-2/3", "w-full"].map((width, index) => <div key={index} className={`h-7 animate-pulse rounded bg-slate-100 ${width}`} />)}</div></div>;
}

export default function GiftCardProductDetails({ slug }: { slug: string }) {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const query = useGiftCardDetail(slug);
  const addMutation = useAddGiftCardToCart();
  const buyMutation = useInstantGiftCardBuy();
  const [selectedId, setSelectedId] = useState("");
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  const firstInStock = useMemo(() => query.data?.denominations.find(item => item.inStock && item.isActive !== false)?.id ?? "", [query.data]);
  useEffect(() => { if (!selectedId && firstInStock) setSelectedId(firstInStock); }, [firstInStock, selectedId]);
  const selected = query.data?.denominations.find(item => item.id === selectedId && item.inStock && item.isActive !== false) ?? null;

  const requireCustomer = () => {
    if (user?.role === "CUSTOMER") return true;
    toast.warning("Login required", "Sign in with a customer account to continue.");
    router.push(`/login?next=${encodeURIComponent(`/gift-cards/${slug}`)}`);
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

  const buyNow = (delivery: DeliveryEmailInput) => {
    if (!selected) return;
    buyMutation.mutate({ denominationId: selected.id, quantity: 1, ...delivery }, {
      onSuccess: order => {
        setDeliveryOpen(false);
        toast.success("Order created", order.paymentStatus === "PENDING" ? "Payment is pending; fulfillment is in development/manual mode." : "Your order is ready to review.");
        router.push(`/profile/gift-card-orders/${order.id}?created=1`);
      },
      onError: error => {
        if (getGiftCardErrorCode(error) === "GIFT_CARD_OUT_OF_STOCK") query.refetch();
        toast.error("Purchase could not be completed", getGiftCardErrorMessage(error));
      },
    });
  };

  return <main className="min-h-screen bg-slate-50 pb-20 pt-[132px] sm:pt-[148px]"><div className="mx-auto w-11/12 max-w-7xl py-8"><Link href="/gift-cards" className="mb-6 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-600 hover:bg-white hover:text-blue-700"><ArrowLeft className="h-4 w-4" />All gift cards</Link>
    {query.isLoading ? <DetailSkeleton /> : query.isError ? <ApiErrorState error={query.error} onRetry={() => query.refetch()} /> : query.data ? <>
      <section className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2"><div className="relative flex min-h-[360px] items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 lg:min-h-[620px]"><div className="relative aspect-[4/3] w-full max-w-xl"><Image src={productImage(query.data)} alt={`${query.data.name || query.data.title} artwork`} fill unoptimized priority className="object-contain drop-shadow-2xl" /></div></div>
        <div className="p-6 sm:p-9 lg:p-11"><p className="text-xs font-black uppercase tracking-[.2em] text-blue-700">{query.data.brand}</p><h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{query.data.name || query.data.title}</h1><div className="mt-4 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"><Gift className="h-3.5 w-3.5" />Digital Gift Card</span><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><Clock3 className="h-3.5 w-3.5" />Instant Delivery</span>{query.data.region ? <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">{query.data.region} · {query.data.currency}</span> : null}</div>
          {query.data.shortDescription || query.data.description ? <p className="mt-6 text-sm leading-7 text-slate-600">{query.data.shortDescription || query.data.description}</p> : null}
          <fieldset className="mt-8"><legend className="flex items-center justify-between gap-3 text-sm font-black text-slate-900"><span>Select denomination</span><span className="text-xs font-medium text-slate-500">Prices supplied by Ontor</span></legend><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{query.data.denominations.map(item => { const disabled = !item.inStock || item.isActive === false; const active = selectedId === item.id && !disabled; return <button key={item.id} type="button" disabled={disabled} aria-pressed={active} onClick={() => setSelectedId(item.id)} className={`relative rounded-2xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${active ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-400"} disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-45`}><span className="block text-base font-black text-slate-950">{formatMoney(item.faceValue, item.faceCurrency)}</span><span className="mt-1 block text-xs font-semibold text-slate-500">{formatMoney(item.sellingPriceBdt, "BDT")}</span>{item.isPopular ? <span className="absolute -right-1.5 -top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">Popular</span> : null}{active ? <Check className="absolute bottom-3 right-3 h-4 w-4 text-blue-700" /> : null}{disabled ? <span className="mt-2 block text-[10px] font-bold uppercase tracking-wide text-rose-600">Out of stock</span> : null}</button>; })}</div></fieldset>
          <div className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">You pay</p><p className="mt-1 text-3xl font-black text-slate-950">{selected ? formatMoney(selected.sellingPriceBdt, "BDT") : "Unavailable"}</p></div>{selected ? <div className="text-right"><p className="text-xs text-slate-500">Card value</p><p className="mt-1 text-lg font-black text-slate-900">{formatMoney(selected.faceValue, selected.faceCurrency)}</p><p className="mt-1 text-xs font-semibold text-emerald-700">In stock</p></div> : null}</div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2"><button type="button" disabled={!selected || buyMutation.isPending} onClick={() => { if (requireCustomer()) setDeliveryOpen(true); }} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Sparkles className="h-4 w-4" />Buy now</button><button type="button" disabled={!selected || addMutation.isPending} onClick={addToCart} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-black text-slate-800 transition hover:border-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}Add to cart</button></div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" />Secure purchase</span><span className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-600" />Email delivery</span><span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-indigo-600" />Verified inventory</span><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-amber-600" />Fast fulfillment</span></div>
        </div></section>
      {(query.data.description || query.data.instructions || query.data.termsAndConditions) ? <section className="mt-8 grid gap-5 lg:grid-cols-3">{query.data.description ? <InfoBlock title="About this gift card" text={query.data.description} /> : null}{query.data.instructions ? <InfoBlock title="How to redeem" text={query.data.instructions} /> : null}{query.data.termsAndConditions ? <InfoBlock title="Terms and conditions" text={query.data.termsAndConditions} /> : null}</section> : null}
      <DeliveryEmailDialog open={deliveryOpen} accountEmail={user?.email} loading={buyMutation.isPending} submitLabel="Create order" onClose={() => !buyMutation.isPending && setDeliveryOpen(false)} onSubmit={buyNow} />
    </> : null}
  </div></main>;
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="font-black text-slate-950">{title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{text}</p></article>;
}
