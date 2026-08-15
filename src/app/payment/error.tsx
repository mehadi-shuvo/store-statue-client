"use client";

import { ErrorAlert, PaymentShell } from "@/components/payment/PaymentUi";

export default function PaymentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PaymentShell
      eyebrow="Payment"
      title="We could not load this payment screen"
      description="Your payment status is never assumed from the browser. Please retry the secure verification step."
    >
      <ErrorAlert
        title="Payment screen unavailable"
        message={error.message || "A temporary issue prevented this page from loading."}
        action={
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        }
      />
    </PaymentShell>
  );
}
