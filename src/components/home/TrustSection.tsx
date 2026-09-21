import { BadgeDollarSign, History, ShieldCheck, Workflow } from "lucide-react";
import HomeSectionHeading from "./HomeSectionHeading";

export default function TrustSection({ giftCardsEnabled, gameTopUpEnabled }: { giftCardsEnabled: boolean; gameTopUpEnabled: boolean }) {
  const benefits = [
    { icon: BadgeDollarSign, title: "Transparent BDT pricing", description: "Catalog cards show prices returned by the backend rather than browser-side currency estimates.", visible: true },
    { icon: ShieldCheck, title: "Validated Gift Card orders", description: "Gift Card stock and pricing are checked again by the backend when an order is submitted.", visible: giftCardsEnabled },
    { icon: History, title: "Protected purchase details", description: "Authenticated customers can revisit their Gift Card orders and reveal delivered codes only when eligible.", visible: giftCardsEnabled },
    { icon: Workflow, title: gameTopUpEnabled ? "Status-aware processing" : "Clear payment states", description: gameTopUpEnabled ? "Payment and Top-Up fulfillment states stay distinct, so pending work is not presented as completed." : "Payment and fulfillment states stay distinct, so a pending payment is not presented as completed.", visible: true },
  ].filter((benefit) => benefit.visible);

  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="trust-title">
      <div className="mx-auto w-11/12 max-w-7xl">
        <HomeSectionHeading titleId="trust-title" eyebrow="Built for clarity" title="Why customers can shop with confidence" description="Trust comes from clear states, real catalog data, and protected account workflows—not unsupported promises." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return <article key={benefit.title} className="rounded-3xl border border-slate-200 bg-white p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon className="h-5 w-5" /></span><h3 className="mt-5 font-black text-slate-950">{benefit.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p></article>;
          })}
        </div>
      </div>
    </section>
  );
}
