"use client";

import { RouteGuard } from "@/components/RouteGuard";
import PaymentReturnStatus from "@/components/payment/PaymentReturnStatus";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function PaymentOutcome() {
  return <Suspense fallback={null}><PaymentOutcomeContent /></Suspense>;
}

function PaymentOutcomeContent() {
  const orderId = useSearchParams().get("orderId")?.trim() ?? "";
  return <RouteGuard roles={["CUSTOMER"]}><PaymentReturnStatus orderId={orderId} /></RouteGuard>;
}
