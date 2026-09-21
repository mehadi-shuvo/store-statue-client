import { BadgeCheck, CreditCard, ListChecks, Send } from "lucide-react";
import HomeSectionHeading from "./HomeSectionHeading";

export default function HowItWorks({ giftCardsEnabled, gameTopUpEnabled }: { giftCardsEnabled: boolean; gameTopUpEnabled: boolean }) {
  const serviceChoice = giftCardsEnabled && gameTopUpEnabled
    ? "Open the Gift Card catalog or select a supported game."
    : giftCardsEnabled
      ? "Open the Gift Card catalog and choose an available brand."
      : "Select a supported game from the Top-Up catalog.";
  const optionChoice = giftCardsEnabled && gameTopUpEnabled
    ? "Pick an available denomination or a configured top-up package."
    : giftCardsEnabled
      ? "Pick one of the available denominations for that Gift Card."
      : "Choose one of the active packages configured for that game.";
  const orderDetails = giftCardsEnabled && gameTopUpEnabled
    ? "Review pricing, add the required email or game account fields, and complete the supported payment step."
    : giftCardsEnabled
      ? "Review the BDT price, add the delivery email, and complete the supported payment step."
      : "Review the package price, provide the configured game account fields, and submit the request.";
  const outcome = giftCardsEnabled && gameTopUpEnabled
    ? "Gift Card details appear on eligible completed orders. Top-Up requests move through processing statuses."
    : giftCardsEnabled
      ? "Eligible Gift Card details become available when the owned order is completed and delivered."
      : "Top-Up requests move through pending, processing, completed, failed, or cancelled states.";
  const steps = [
    { icon: ListChecks, title: "Choose your service", description: serviceChoice },
    { icon: BadgeCheck, title: "Select the right option", description: optionChoice },
    { icon: CreditCard, title: "Provide order details", description: orderDetails },
    { icon: Send, title: "Receive or follow status", description: outcome },
  ];

  return (
    <section className="bg-slate-950 py-16 text-white sm:py-20" aria-labelledby="how-it-works-title">
      <div className="mx-auto w-11/12 max-w-7xl">
        <HomeSectionHeading tone="dark" titleId="how-it-works-title" eyebrow="Straightforward workflow" title="How it works" description="Each order follows a clear sequence, with the exact fields and fulfillment determined by the selected service." />
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
                <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-slate-950"><Icon className="h-5 w-5" /></span><span className="text-sm font-black text-slate-500">0{index + 1}</span></div>
                <h3 className="mt-6 text-lg font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
