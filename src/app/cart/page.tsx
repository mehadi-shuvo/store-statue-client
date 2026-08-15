"use client";

import { ApiEmpty, ApiErrorState, ApiLoading } from "@/components/ApiState";
import { ConfirmDialog } from "@/components/admin/AdminUi";
import DeliveryEmailDialog from "@/components/gift-card/DeliveryEmailDialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useClearGiftCardCart, useGiftCardCart, useGiftCardCheckout, useRemoveGiftCardCartItem, useUpdateGiftCardCartItem } from "@/hooks/api/use-gift-card-api";
import { formatMoney, getGiftCardErrorCode, getGiftCardErrorMessage, productImage } from "@/lib/gift-card";
import type { DeliveryEmailInput, GiftCardCartItem, GiftCardCartProduct } from "@/types/gift-card";
import { ArrowRight, Loader2, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function itemView(item: GiftCardCartItem) {
  const product: GiftCardCartProduct = item.product ?? item.giftCard ?? { id: "unknown" };
  const denomination = item.denomination ?? item.giftCardDenomination;
  return {
    title: product.name || product.title || "Digital product",
    brand: product.brand || "Digital",
    image: productImage(product),
    faceValue: denomination?.faceValue,
    currency: denomination?.faceCurrency,
    unitPrice: item.unitPriceBdt || item.sellingPriceBdt || denomination?.sellingPriceBdt,
    inStock: denomination?.inStock !== false && denomination?.isActive !== false,
  };
}

export default function CartPage() {
  const router = useRouter();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const query = useGiftCardCart(Boolean(user?.id && user.role === "CUSTOMER"));
  const update = useUpdateGiftCardCartItem();
  const remove = useRemoveGiftCardCartItem();
  const clear = useClearGiftCardCart();
  const checkout = useGiftCardCheckout();
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  if (authLoading) return <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-[148px]"><ApiLoading label="Restoring your cart…" /></main>;
  if (!user || user.role !== "CUSTOMER") return <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-[148px]"><div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-12 text-center"><ShoppingBag className="mx-auto h-12 w-12 text-blue-600" /><h1 className="mt-5 text-3xl font-black text-slate-950">Sign in to view your cart</h1><p className="mt-3 text-sm text-slate-500">Your authenticated cart is stored securely on the server.</p><Link href="/login?next=%2Fcart" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Sign in<ArrowRight className="h-4 w-4" /></Link></div></main>;

  const items = query.data?.items ?? [];
  const submitCheckout = (delivery: DeliveryEmailInput) => checkout.mutate(delivery, {
    onSuccess: order => {
      setDeliveryOpen(false);
      toast.success("Order created", order.paymentStatus === "PENDING" ? "Payment is pending. Development/manual fulfillment may already be complete." : "Review the order for its current status.");
      router.push(`/profile/gift-card-orders/${order.id}?created=1`);
    },
    onError: error => {
      if (["GIFT_CARD_OUT_OF_STOCK", "INSUFFICIENT_GIFT_CARD_STOCK", "INVALID_CART"].includes(getGiftCardErrorCode(error) || "")) query.refetch();
      toast.error("Checkout failed", getGiftCardErrorMessage(error));
    },
  });

  return <main className="min-h-screen bg-slate-50 pb-20 pt-[132px] sm:pt-[148px]"><section className="bg-slate-950 text-white"><div className="mx-auto w-11/12 max-w-7xl py-12"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[.18em]"><ShoppingBag className="h-3.5 w-3.5" />Secure cart</span><h1 className="mt-4 text-4xl font-black tracking-tight">Review your digital order.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Availability and prices are revalidated by the backend at checkout. The returned order total is authoritative.</p></div></section><div className="mx-auto w-11/12 max-w-7xl py-10">
    {query.isLoading ? <ApiLoading label="Loading your cart…" /> : query.isError ? <ApiErrorState error={query.error} onRetry={() => query.refetch()} /> : items.length === 0 ? <ApiEmpty title="Your cart is empty" description="Browse gift cards and add a stocked denomination." /> : <div className="grid gap-8 lg:grid-cols-[1fr_380px]"><section aria-label="Cart items" className="space-y-4">{items.map(item => { const view = itemView(item); const pending = (update.isPending && update.variables?.itemId === item.id) || (remove.isPending && remove.variables === item.id); return <article key={item.id} className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:grid-cols-[150px_1fr]"><div className="relative min-h-40 bg-slate-50"><Image src={view.image} alt={`${view.title} artwork`} fill unoptimized className="object-contain p-5" /></div><div className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">{view.brand}</p><h2 className="mt-1 text-xl font-black text-slate-950">{view.title}</h2>{view.faceValue && view.currency ? <p className="mt-2 text-sm text-slate-500">Card value: <strong className="text-slate-800">{formatMoney(view.faceValue, view.currency)}</strong></p> : null}</div><button type="button" disabled={pending} onClick={() => remove.mutate(item.id, { onSuccess: () => toast.success("Item removed"), onError: error => toast.error("Remove failed", getGiftCardErrorMessage(error)) })} aria-label={`Remove ${view.title}`} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></div><div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs text-slate-500">Current unit price</p><p className="mt-1 text-2xl font-black text-slate-950">{view.unitPrice ? formatMoney(view.unitPrice, "BDT") : "Confirmed at checkout"}</p>{!view.inStock ? <p className="mt-1 text-xs font-bold text-rose-700">Currently out of stock</p> : null}</div><div className="flex items-center gap-2" aria-label={`Quantity for ${view.title}`}><button type="button" aria-label="Decrease quantity" disabled={item.quantity <= 1 || pending} onClick={() => update.mutate({ itemId: item.id, quantity: item.quantity - 1 }, { onError: error => toast.error("Update failed", getGiftCardErrorMessage(error)) })} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 disabled:opacity-40"><Minus className="h-4 w-4" /></button><span className="min-w-10 text-center font-black">{pending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : item.quantity}</span><button type="button" aria-label="Increase quantity" disabled={!view.inStock || pending} onClick={() => update.mutate({ itemId: item.id, quantity: item.quantity + 1 }, { onError: error => { if (getGiftCardErrorCode(error)?.includes("STOCK")) query.refetch(); toast.error("Update failed", getGiftCardErrorMessage(error)); } })} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 disabled:opacity-40"><Plus className="h-4 w-4" /></button></div></div></div></article>; })}</section>
      <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-32"><div className="flex items-center justify-between"><h2 className="text-xl font-black text-slate-950">Order summary</h2><button type="button" onClick={() => setClearOpen(true)} className="text-xs font-bold text-rose-700 hover:underline">Clear cart</button></div><div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="flex justify-between text-sm text-slate-600"><span>{items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</span><span>Digital delivery</span></div><div className="mt-4 border-t border-slate-200 pt-4"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Current cart total</p><p className="mt-1 text-3xl font-black text-slate-950">{query.data?.totalBdt || query.data?.subtotalBdt ? formatMoney(query.data.totalBdt || query.data.subtotalBdt, "BDT") : "Confirmed at checkout"}</p></div></div><button type="button" disabled={checkout.isPending || items.some(item => !itemView(item).inStock)} onClick={() => setDeliveryOpen(true)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><ShieldCheck className="h-4 w-4" />Choose email & checkout</button><p className="mt-4 text-xs leading-5 text-slate-500">The final total shown on the resulting order is the backend-confirmed amount.</p></aside></div>}
    <DeliveryEmailDialog open={deliveryOpen} accountEmail={user.email} title="Where should we deliver your codes?" submitLabel="Place order" loading={checkout.isPending} onClose={() => !checkout.isPending && setDeliveryOpen(false)} onSubmit={submitCheckout} />
    <ConfirmDialog open={clearOpen} title="Clear your cart?" description="This removes every item from the server cart." confirmLabel="Clear cart" loading={clear.isPending} onClose={() => setClearOpen(false)} onConfirm={() => clear.mutate(undefined, { onSuccess: () => { setClearOpen(false); toast.success("Cart cleared"); }, onError: error => toast.error("Could not clear cart", getGiftCardErrorMessage(error)) })} />
  </div></main>;
}
