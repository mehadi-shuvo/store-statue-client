import type { Payment, PaymentStatus } from "./api";

export type PaymentResultStatus = PaymentStatus;
export type PaymentMethod = "BKASH";

export interface CreatePaymentRequest {
  orderId: string;
  amount: number;
}

export interface CreatePaymentResponse {
  paymentId: string;
  paymentUrl: string | null;
}

export interface ExecutePaymentRequest {
  paymentId: string;
  scenario?: "success" | "failure" | "cancel";
}

export interface ExecutePaymentResponse {
  transactionId: string | null;
  status: PaymentStatus;
}

export type PaymentStatusResponse = Payment;
