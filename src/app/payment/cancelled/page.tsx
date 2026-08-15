"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentShell, ResultPanel } from "@/components/payment/PaymentUi";

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelledContent />
    </Suspense>
  );
}

function PaymentCancelledContent() {
  const paymentId = useSearchParams().get("paymentId");

  return (
    <PaymentShell
      eyebrow="Payment Cancelled"
      title="Payment cancelled"
      description="The payment session was not completed."
    >
      <ResultPanel
        status="cancelled"
        title="Payment cancelled"
        message="No successful payment was confirmed. You can safely return to checkout when you are ready."
        paymentId={paymentId}
      />
    </PaymentShell>
  );
}
