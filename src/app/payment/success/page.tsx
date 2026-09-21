"use client";

import { LoadingSpinner, PaymentShell } from "@/components/payment/PaymentUi";
import PaymentReturnStatus from "@/components/payment/PaymentReturnStatus";
import { RouteGuard } from "@/components/RouteGuard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SuccessPageFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const orderId = useSearchParams().get("orderId")?.trim() ?? "";

  return (
    <RouteGuard roles={["CUSTOMER"]}>
      <PaymentReturnStatus orderId={orderId} />
    </RouteGuard>
  );
}

function SuccessPageFallback() {
  return (
    <PaymentShell eyebrow="Secure delivery" title="Confirming your purchase" description="Preparing the authenticated payment check.">
      <section className="mx-auto max-w-3xl rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <LoadingSpinner label="Preparing verification..." />
      </section>
    </PaymentShell>
  );
}
