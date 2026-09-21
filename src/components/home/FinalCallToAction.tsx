import { ArrowRight, Gamepad2, Gift } from "lucide-react";
import Link from "next/link";

export default function FinalCallToAction({ giftCardsEnabled, gameTopUpEnabled }: { giftCardsEnabled: boolean; gameTopUpEnabled: boolean }) {
  if (!giftCardsEnabled && !gameTopUpEnabled) return null;

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="final-cta-title">
      <div className="mx-auto w-11/12 max-w-7xl rounded-3xl bg-slate-950 px-6 py-12 text-center text-white sm:px-10">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">Ready to start?</p>
        <h2 id="final-cta-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Choose the digital service you need.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300">Browse current catalog data, review the available option, and continue through the supported order workflow.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {giftCardsEnabled ? <Link href="/gift-cards" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><Gift className="h-4 w-4" />Gift Cards <ArrowRight className="h-4 w-4" /></Link> : null}
          {gameTopUpEnabled ? <Link href="/top-up" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-black text-white hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"><Gamepad2 className="h-4 w-4" />Game Top-Up <ArrowRight className="h-4 w-4" /></Link> : null}
        </div>
      </div>
    </section>
  );
}
