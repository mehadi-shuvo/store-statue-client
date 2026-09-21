import { ArrowRight, CheckCircle2, Gamepad2, Gift, ReceiptText } from "lucide-react";
import Link from "next/link";

export default function HeroSection({
  giftCardsEnabled,
  gameTopUpEnabled,
}: {
  giftCardsEnabled: boolean;
  gameTopUpEnabled: boolean;
}) {
  const heading = giftCardsEnabled && gameTopUpEnabled
    ? "Gift Cards & Game Top-Ups, made simple."
    : giftCardsEnabled
      ? "Digital Gift Cards, made simple."
      : "Game Top-Ups, made simple.";

  return (
    <section className="bg-slate-950 text-white" aria-labelledby="home-hero-title">
      <div className="mx-auto grid w-11/12 max-w-7xl gap-12 py-14 sm:py-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Focused digital services
          </p>
          <h1 id="home-hero-title" className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Choose a digital product, review clear BDT pricing, and complete the
            supported order workflow from one focused storefront.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {giftCardsEnabled ? (
              <Link href="/gift-cards" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                Browse Gift Cards <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
            {gameTopUpEnabled ? (
              <Link href="/top-up" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-black text-white transition-colors hover:border-slate-400 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                Game Top-Up <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <ul className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />BDT catalog pricing</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />Backend-confirmed orders</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />Status-aware processing</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900 p-4 shadow-2xl sm:p-6" aria-label="Available digital services">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Start here</p>
              <p className="mt-1 font-black text-white">Choose a service</p>
            </div>
            <ReceiptText className="h-5 w-5 text-slate-400" aria-hidden="true" />
          </div>
          <div className="mt-4 space-y-3">
            {giftCardsEnabled ? (
              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 text-slate-950">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700"><Gift className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="font-black">Digital Gift Cards</p><p className="mt-1 text-xs text-slate-500">Brand → denomination → delivery email</p></div>
              </div>
            ) : null}
            {gameTopUpEnabled ? (
              <div className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-500/15 text-indigo-200"><Gamepad2 className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1"><p className="font-black">Game Top-Ups</p><p className="mt-1 text-xs text-slate-400">Game → package → account details</p></div>
              </div>
            ) : null}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-400">
            <span className="rounded-lg border border-slate-700 px-2 py-2">Choose</span>
            <span className="rounded-lg border border-slate-700 px-2 py-2">Review</span>
            <span className="rounded-lg border border-slate-700 px-2 py-2">Order</span>
          </div>
        </div>
      </div>
    </section>
  );
}
