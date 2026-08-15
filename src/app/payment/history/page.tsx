import Link from "next/link";
import { CircleOff } from "lucide-react";
import { PaymentShell } from "@/components/payment/PaymentUi";

export default function PaymentHistoryPage() {
  return (
    <PaymentShell
      eyebrow="Payments"
      title="Payment history is unavailable"
      description="The backend exposes lookup by payment ID, but it does not expose a customer payment-history list."
    >
      <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <CircleOff className="mx-auto h-12 w-12 text-slate-500" />
        <p className="mt-4 text-sm leading-6 text-slate-600">
          No transaction list is fabricated or read from browser storage. Keep the payment ID from your provider redirect to check an individual payment status.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </section>
    </PaymentShell>
  );
}
