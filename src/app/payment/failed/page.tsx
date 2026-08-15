"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentShell, ResultPanel } from "@/components/payment/PaymentUi";

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailedContent />
    </Suspense>
  );
}

function PaymentFailedContent() {
  const paymentId = useSearchParams().get("paymentId");

  return (
    <PaymentShell
      eyebrow="Payment Failed"
      title="Payment could not be verified"
      description="The backend did not confirm a successful payment for this session."
    >
      <ResultPanel
        status="failed"
        title="Payment failed"
        message="Please retry checkout or contact support if your bKash account was charged."
        paymentId={paymentId}
      />
    </PaymentShell>
  );
}
