import { customerService } from "@/services/api/customer.service";
import type { CreatePaymentRequest, ExecutePaymentRequest } from "@/types/payment";

export const createPayment = (payload: CreatePaymentRequest) =>
  customerService.createPayment(payload);

export const executePayment = ({ paymentId, scenario }: ExecutePaymentRequest) =>
  customerService.executePayment(paymentId, scenario);

export const getPaymentStatus = (paymentId: string) =>
  customerService.paymentStatus(paymentId);
