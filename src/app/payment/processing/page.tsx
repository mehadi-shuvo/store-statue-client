"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentShell, ResultPanel } from "@/components/payment/PaymentUi";

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={null}>
      <PaymentProcessingContent />
    </Suspense>
  );
}

function PaymentProcessingContent() {
  const paymentId = useSearchParams().get("paymentId");

  return (
    <PaymentShell
      eyebrow="Payment Processing"
      title="Payment is still processing"
      description="The backend has not finalized this payment yet."
    >
      <ResultPanel
        status="processing"
        title="Verification is in progress"
        message="Please check payment history shortly. Contact support if this status does not change after a few minutes."
        paymentId={paymentId}
      />
    </PaymentShell>
  );
}
