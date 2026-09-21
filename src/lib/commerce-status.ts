import type { DeliveryStatus, OrderStatus, PaymentStatus } from "@/types/api";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";
export type StatusPresentation = { label: string; title: string; message: string; tone: StatusTone };

export const PAYMENT_STATUS: Record<PaymentStatus, StatusPresentation> = {
  CREATED: { label: "Payment created", title: "Payment ready", message: "Your payment attempt has been created.", tone: "info" },
  PENDING: { label: "Payment pending", title: "Waiting for payment confirmation", message: "Waiting for payment confirmation.", tone: "info" },
  INITIATED: { label: "Payment initiated", title: "Waiting for payment confirmation", message: "Waiting for payment confirmation.", tone: "info" },
  PROCESSING: { label: "Verifying payment", title: "Verifying your payment", message: "The payment provider response is being verified.", tone: "info" },
  UNKNOWN: { label: "Verification pending", title: "Payment confirmation pending", message: "We haven't been able to confirm the payment yet. Please don't pay again.", tone: "warning" },
  PAID: { label: "Payment confirmed", title: "Payment confirmed", message: "Your payment has been verified.", tone: "success" },
  FAILED: { label: "Payment failed", title: "Payment failed", message: "Your payment could not be confirmed.", tone: "danger" },
  CANCELLED: { label: "Payment cancelled", title: "Payment cancelled", message: "The payment was cancelled.", tone: "warning" },
  EXPIRED: { label: "Payment expired", title: "Payment reservation expired", message: "This payment attempt expired. Check the order before taking another action.", tone: "warning" },
  REFUND_PENDING: { label: "Refund processing", title: "Refund is being processed", message: "Your payment was received and a refund is being processed.", tone: "warning" },
  REFUNDED: { label: "Payment refunded", title: "Payment refunded", message: "The backend reports that this payment was refunded.", tone: "neutral" },
  REFUND_FAILED: { label: "Refund needs attention", title: "Refund needs attention", message: "The automatic refund could not be confirmed. Please contact support with this order number.", tone: "danger" },
  PARTIALLY_REFUNDED: { label: "Partially refunded", title: "Payment partially refunded", message: "The backend reports a partial refund for this payment.", tone: "warning" },
};

export const pendingPaymentStatuses = new Set<PaymentStatus>(["CREATED", "PENDING", "INITIATED", "PROCESSING", "UNKNOWN"]);
export const activeFulfillmentStatuses = new Set(["PENDING", "QUEUED", "PROCESSING", "PROVIDER_PENDING", "FAILED_RETRYABLE"]);

export function paymentPresentation(status: PaymentStatus) { return PAYMENT_STATUS[status]; }
export function isPaymentPending(status: PaymentStatus) { return pendingPaymentStatuses.has(status); }
export function isFulfillmentActive(status?: string | null) { return activeFulfillmentStatuses.has(status ?? "PENDING"); }
export function isFulfillmentComplete(status?: string | null) { return status === "SUCCESS" || status === "COMPLETED" || status === "DELIVERED"; }
export function humanizeStatus(status: PaymentStatus | DeliveryStatus | OrderStatus | string) {
  if (status in PAYMENT_STATUS) return PAYMENT_STATUS[status as PaymentStatus].label;
  const labels: Record<string, string> = { PROVIDER_PENDING: "Provider processing", FAILED_RETRYABLE: "Retrying automatically", FAILED_FINAL: "Fulfillment failed", MANUAL_REVIEW: "Manual review", QUEUED: "Queued", DELIVERED: "Delivered", COMPLETED: "Completed", REFUND_PENDING: "Refund processing" };
  return labels[status] ?? status.toLowerCase().replaceAll("_", " ").replace(/^./, value => value.toUpperCase());
}
