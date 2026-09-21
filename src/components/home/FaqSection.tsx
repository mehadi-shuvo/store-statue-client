import HomeSectionHeading from "./HomeSectionHeading";

const questions = [
  {
    feature: "giftCards",
    question: "How do Digital Gift Cards work?",
    answer: "Choose an available brand and denomination, then complete the supported purchase flow with a delivery email. Stock and final BDT pricing are confirmed by the backend when the order is created.",
  },
  {
    feature: "giftCards",
    question: "How will I receive my Gift Card?",
    answer: "The order stores your selected delivery email. When an owned order is completed and its item is marked delivered, eligible codes can also be revealed from the protected Gift Card order page.",
  },
  {
    feature: "gameTopUp",
    question: "What information does a Game Top-Up need?",
    answer: "Requirements vary by game. The configured account fields may ask for information such as a player identifier, server, email, or phone before the request can be submitted.",
  },
  {
    feature: "gameTopUp",
    question: "How can I follow a Game Top-Up?",
    answer: "Top-Up orders support pending, processing, completed, failed, and cancelled states. A complete customer-facing Top-Up tracking screen is still being integrated, so the homepage does not promise an unsupported history view.",
  },
  {
    feature: "all",
    question: "What happens if a payment fails or is cancelled?",
    answer: "The storefront keeps failed, cancelled, processing, and successful outcomes separate. A failed or cancelled result is not treated as a completed payment; keep the payment identifier if you need to retry or investigate the transaction.",
  },
];

export default function FaqSection({ giftCardsEnabled, gameTopUpEnabled }: { giftCardsEnabled: boolean; gameTopUpEnabled: boolean }) {
  const visibleQuestions = questions.filter((item) => item.feature === "all" || (item.feature === "giftCards" && giftCardsEnabled) || (item.feature === "gameTopUp" && gameTopUpEnabled));

  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="faq-title">
      <div className="mx-auto w-11/12 max-w-5xl">
        <HomeSectionHeading titleId="faq-title" eyebrow="Common questions" title="Before you place an order" description="Clear answers based on the workflows currently implemented in GameXpress." />
        <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          {visibleQuestions.map((item) => (
            <details key={item.question} className="group px-5 py-1 sm:px-7">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 font-black text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                {item.question}
                <span aria-hidden="true" className="text-xl font-normal text-slate-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pb-6 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
