"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PaymentShell, ResultPanel } from "@/components/payment/PaymentUi";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const paymentId = useSearchParams().get("paymentId");

  return (
    <PaymentShell
      eyebrow="Payment Complete"
      title="Payment successful"
      description="Your payment was verified by the backend and the order is ready for fulfilment."
    >
      <ResultPanel
        status="success"
        title="Thank you for your payment"
        message="We have confirmed the bKash payment. You can review this transaction from your payment history."
        paymentId={paymentId}
      />
    </PaymentShell>
  );
}
