"use client";

import { useCallback, useEffect, useRef } from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorAlert, LoadingSpinner, PaymentShell } from "@/components/payment/PaymentUi";
import { getHttpErrorMessage } from "@/lib/http";
import { useExecutePayment } from "@/hooks/usePayments";

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentResultContent />
    </Suspense>
  );
}

function PaymentResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const executePaymentMutation = useExecutePayment();
  const executedRef = useRef(false);

  const verifyPayment = useCallback(() => {
    if (!paymentId || executedRef.current) {
      return;
    }

    executedRef.current = true;

    executePaymentMutation
      .mutateAsync({ paymentId })
      .then((result) => {
        const status = result.status === "PAID" ? "SUCCESS" : result.status;
        const nextPath =
          status === "SUCCESS"
            ? "/payment/success"
            : status === "CANCELLED"
              ? "/payment/cancelled"
              : status === "PROCESSING" || status === "PENDING"
                ? "/payment/processing"
                : "/payment/failed";

        router.replace(`${nextPath}?paymentId=${encodeURIComponent(paymentId)}`);
      })
      .catch(() => {
        executedRef.current = false;
      });
  }, [executePaymentMutation, paymentId, router]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return (
    <PaymentShell
      eyebrow="Payment Verification"
      title="Verifying your bKash payment"
      description="Please keep this tab open while the backend confirms the payment result."
    >
      <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        {!paymentId ? (
          <ErrorAlert
            title="Payment ID missing"
            message="We could not verify this payment because the redirect did not include a payment ID. Please contact support with your order details."
          />
        ) : null}

        {paymentId && executePaymentMutation.isError ? (
          <ErrorAlert
            title="Verification failed"
            message={`${getHttpErrorMessage(executePaymentMutation.error, "We could not verify the payment after retrying.")} Please contact support if money was deducted.`}
            action={
              <button
                type="button"
                onClick={() => {
                  executePaymentMutation.reset();
                  verifyPayment();
                }}
                className="rounded-2xl bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Retry verification
              </button>
            }
          />
        ) : null}

        {paymentId && !executePaymentMutation.isError ? (
          <div className="text-center">
            <LoadingSpinner label="Checking payment status..." />
            <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 font-mono text-xs text-slate-600">
              Payment ID: {paymentId}
            </p>
          </div>
        ) : null}
      </section>
    </PaymentShell>
  );
}

function PaymentResultFallback() {
  return (
    <PaymentShell
      eyebrow="Payment Verification"
      title="Preparing verification"
      description="Loading the payment redirect details."
    >
      <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <LoadingSpinner label="Preparing payment check..." />
      </section>
    </PaymentShell>
  );
}
