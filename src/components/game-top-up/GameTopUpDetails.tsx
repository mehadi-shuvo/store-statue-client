"use client";

import { formatMoney } from "@/lib/gift-card";
import { validatePaymentUrl } from "@/lib/payment-url";
import { rememberPaymentAttempt } from "@/lib/payment-attempt";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useCreatePayment } from "@/hooks/api/use-customer-api";
import { useCreateTopUpOrder } from "@/hooks/api/use-game-top-up-api";
import type { GameAccountField, GameTopUp } from "@/types/game-top-up";
import { ArrowLeft, Check, CircleAlert, Gamepad2, Info, Loader2, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

export default function GameTopUpDetails({ game }: { game: GameTopUp }) {
  const router = useRouter();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const createOrder = useCreateTopUpOrder();
  const initiatePayment = useCreatePayment();
  const submissionInFlight = useRef(false);
  const availablePackages = useMemo(
    () => game.packages
      .filter((item) => item.isActive && (item.stockQuantity == null || item.stockQuantity > 0))
      .sort((left, right) => left.sortOrder - right.sortOrder),
    [game.packages],
  );
  const accountFields = useMemo(
    () => game.accountFields.filter((field) => field.isActive).sort((left, right) => left.sortOrder - right.sortOrder),
    [game.accountFields],
  );
  const defaultPackage = availablePackages.find((item) => item.isPopular) ?? availablePackages[0];
  const [selectedId, setSelectedId] = useState(defaultPackage?.id ?? "");
  const [formError, setFormError] = useState("");
  const [createdOrderId, setCreatedOrderId] = useState("");
  const selectedPackage = availablePackages.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    const intendedPackage = new URLSearchParams(window.location.search).get("package");
    if (intendedPackage && availablePackages.some(item => item.id === intendedPackage)) setSelectedId(intendedPackage);
  }, [availablePackages]);

  const proceedToPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPackage || submissionInFlight.current || authLoading) return;
    if (user?.role !== "CUSTOMER") {
      toast.warning("Login required", "Sign in with a customer account to continue your top-up.");
      const returnTo = `/top-up/${encodeURIComponent(game.slug)}?package=${encodeURIComponent(selectedPackage.id)}#player-details`;
      router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    const form = new FormData(event.currentTarget);
    const accountDetails: Record<string, string> = {};
    for (const field of accountFields) {
      const value = String(form.get(field.key) ?? "").trim();
      if (field.required && !value) {
        setFormError(`${field.label} is required.`);
        return;
      }
      if (value.length > (field.validationRules.maxLength ?? 500)) {
        setFormError(`${field.label} is too long.`);
        return;
      }
      if (value) accountDetails[field.key] = value;
    }

    submissionInFlight.current = true;
    setFormError("");
    setCreatedOrderId("");
    let paymentOrderId = createdOrderId;
    try {
      if (!paymentOrderId) {
        const order = await createOrder.mutateAsync({ gameId: game.id, packageId: selectedPackage.id, accountDetails });
        paymentOrderId = order.orderId;
        setCreatedOrderId(paymentOrderId);
      }
      const payment = await initiatePayment.mutateAsync({ orderId: paymentOrderId });
      if (payment.orderId !== paymentOrderId) throw new Error("The server returned payment for a different order.");
      if (user) rememberPaymentAttempt({ orderId: payment.orderId, paymentId: payment.paymentId, paymentExpiresAt: payment.paymentExpiresAt, userId: user.id });
      window.location.assign(validatePaymentUrl(payment.paymentUrl));
    } catch (error) {
      submissionInFlight.current = false;
      const message = error instanceof Error ? error.message : "Could not prepare payment. Please try again.";
      setFormError(message);
      toast.error("Could not start payment", paymentOrderId ? "Your order was recorded. Retry this payment or check order history before starting another order." : message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-[72px]">
      <div className="mx-auto w-11/12 max-w-7xl py-8">
        <Link href="/top-up" className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />All games
        </Link>

        <section className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[.95fr_1.05fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-slate-900 lg:min-h-[720px]">
            {game.bannerUrl ? (
              <Image src={game.bannerUrl} alt={`${game.name} artwork`} fill unoptimized priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover opacity-55" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-white p-2 shadow-xl">
                <Image src={game.logoUrl || "/window.svg"} alt={`${game.name} logo`} fill unoptimized sizes="80px" className="object-contain p-2" />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Game Top-Up</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{game.name}</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{game.description}</p>
            </div>
          </div>

          <form onSubmit={proceedToPayment} onChange={() => { setFormError(""); setCreatedOrderId(""); }} className="p-6 sm:p-9 lg:p-11">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700"><Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />{game.subHeading || game.title}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">Secure checkout</span>
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm font-black text-slate-950">1. Select a package</legend>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {availablePackages.map((item) => {
                  const active = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => { setSelectedId(item.id); setFormError(""); setCreatedOrderId(""); }}
                      className={`relative min-h-24 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${active ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-400"}`}
                    >
                      <span className="block text-base font-black text-slate-950">{item.coinAmount.toLocaleString()}{item.bonusAmount ? ` + ${item.bonusAmount.toLocaleString()}` : ""} {game.gameCurrencyName}</span>
                      <span className="mt-1 block text-xs font-semibold text-slate-500">{formatMoney(item.priceBdt, "BDT")}</span>
                      {item.isPopular ? <span className="absolute -right-1.5 -top-2 rounded-full bg-indigo-700 px-2 py-0.5 text-[10px] font-bold text-white">Popular</span> : null}
                      {active ? <Check className="absolute bottom-3 right-3 h-4 w-4 text-indigo-700" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
              {!availablePackages.length ? <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">No packages are configured for this game.</p> : null}
            </fieldset>

            <fieldset className="mt-8">
              <legend id="player-details" className="flex items-center gap-2 text-sm font-black text-slate-950"><UserRound className="h-4 w-4 text-indigo-700" aria-hidden="true" />2. Enter player information</legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {accountFields.map((field) => <AccountInput key={field.id} field={field} />)}
              </div>
              {!accountFields.length ? <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">No player information fields are configured.</p> : null}
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />Only provide identifiers shown in your game profile. Never enter a password, OTP, recovery code, or other secret.</p>
            </fieldset>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Selected package</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{selectedPackage?.name ?? "Unavailable"}</p>
                </div>
                <p className="text-2xl font-black text-slate-950">{selectedPackage ? formatMoney(selectedPackage.priceBdt, "BDT") : "—"}</p>
              </div>
            </div>

            {formError ? <div role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{formError}{createdOrderId ? <Link href="/profile/game-topup-orders" className="ml-1 font-bold underline">View your orders.</Link> : null}</div> : null}

            <button type="submit" disabled={!selectedPackage || !accountFields.length || authLoading || createOrder.isPending || initiatePayment.isPending} aria-busy={createOrder.isPending || initiatePayment.isPending} className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {createOrder.isPending || initiatePayment.isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4" aria-hidden="true" />}{initiatePayment.isPending ? "Redirecting to payment..." : createOrder.isPending ? "Preparing payment..." : "Proceed to Payment"}
            </button>
            <p className="mt-3 text-center text-xs font-semibold text-slate-500">Secure payment powered by aamarPay</p>
          </form>
        </section>

        {(game.instructions || game.termsAndConditions) ? (
          <section aria-label="Game Top-Up information" className="mt-8 grid gap-5 lg:grid-cols-2">
            {game.instructions ? <InfoBlock title="How to find your details" text={game.instructions} /> : null}
            {game.termsAndConditions ? <InfoBlock title="Before you continue" text={game.termsAndConditions} /> : null}
          </section>
        ) : null}
      </div>
    </main>
  );
}

function AccountInput({ field }: { field: GameAccountField }) {
  const rules = field.validationRules;
  if (field.type === "SELECT") {
    return (
      <label className="text-sm font-bold text-slate-800">
        {field.label}{field.required ? <span className="text-rose-600"> *</span> : null}
        <select name={field.key} required={field.required} defaultValue="" className={fieldClass}>
          <option value="" disabled>{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
          {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        {field.helpText ? <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">{field.helpText}</span> : null}
      </label>
    );
  }

  if (field.type === "RADIO") {
    return (
      <fieldset className="text-sm font-bold text-slate-800 sm:col-span-2">
        <legend>{field.label}{field.required ? <span className="text-rose-600"> *</span> : null}</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {field.options.map((option) => <label key={option.value} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4"><input type="radio" name={field.key} value={option.value} required={field.required} />{option.label}</label>)}
        </div>
      </fieldset>
    );
  }

  if (field.type === "TEXTAREA") {
    return (
      <label className="text-sm font-bold text-slate-800 sm:col-span-2">
        {field.label}{field.required ? <span className="text-rose-600"> *</span> : null}
        <textarea name={field.key} required={field.required} minLength={rules.minLength} maxLength={rules.maxLength ?? 500} placeholder={field.placeholder ?? undefined} className={`${fieldClass} min-h-28 resize-y`} />
        {field.helpText ? <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">{field.helpText}</span> : null}
      </label>
    );
  }

  const inputType = field.type === "NUMBER" ? "number" : field.type === "EMAIL" ? "email" : field.type === "PHONE" ? "tel" : "text";
  return (
    <label className="text-sm font-bold text-slate-800">
      {field.label}{field.required ? <span className="text-rose-600"> *</span> : null}
      <input name={field.key} type={inputType} required={field.required} minLength={rules.minLength} maxLength={rules.maxLength ?? 500} pattern={rules.pattern} title={rules.patternMessage} placeholder={field.placeholder ?? undefined} className={fieldClass} />
      {field.helpText ? <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">{field.helpText}</span> : null}
    </label>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return <article className="rounded-3xl border border-slate-200 bg-white p-6"><Info className="h-5 w-5 text-indigo-700" aria-hidden="true" /><h2 className="mt-4 font-black text-slate-950">{title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{text}</p></article>;
}
