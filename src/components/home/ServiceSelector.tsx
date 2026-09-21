import { ArrowRight, Gamepad2, Gift, Mail, UserRoundCheck } from "lucide-react";
import Link from "next/link";
import HomeSectionHeading from "./HomeSectionHeading";

export default function ServiceSelector({ giftCardsEnabled, gameTopUpEnabled }: { giftCardsEnabled: boolean; gameTopUpEnabled: boolean }) {
  if (!giftCardsEnabled && !gameTopUpEnabled) return null;

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="services-title">
      <div className="mx-auto w-11/12 max-w-7xl">
        <HomeSectionHeading titleId="services-title" eyebrow="Choose your path" title="Two services, two clear workflows." description="Start with what you need. Each service keeps its product choices and required order information easy to understand." />
        <div className="grid gap-5 md:grid-cols-2">
          {giftCardsEnabled ? (
            <article className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-700 text-white"><Gift className="h-6 w-6" /></span>
              <h3 className="mt-6 text-2xl font-black text-slate-950">Digital Gift Cards</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Choose a brand and stocked denomination, then provide the supported delivery email during purchase.</p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><span>Completed and delivered gift-card details can be reviewed from your protected order page.</span></div>
              <Link href="/gift-cards" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-black text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">Explore Gift Cards <ArrowRight className="h-4 w-4" /></Link>
            </article>
          ) : null}
          {gameTopUpEnabled ? (
            <article className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6 sm:p-8">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-700 text-white"><Gamepad2 className="h-6 w-6" /></span>
              <h3 className="mt-6 text-2xl font-black text-slate-950">Game Top-Ups</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">Choose a supported game and package, then enter the player or account information configured for that game.</p>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-white p-4 text-sm text-slate-600"><UserRoundCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700" /><span>Top-up requests use status-based processing after the required order and payment steps.</span></div>
              <Link href="/top-up" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-black text-white hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2">Top Up Now <ArrowRight className="h-4 w-4" /></Link>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
