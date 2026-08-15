"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPayment, executePayment, getPaymentStatus } from "@/lib/payments";
import type { CreatePaymentRequest, ExecutePaymentRequest } from "@/types/payment";

export function useCreatePayment() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["payments", "create"],
    mutationFn: (payload: CreatePaymentRequest) => createPayment(payload),
    onSuccess: (payment) => client.invalidateQueries({ queryKey: ["payments", payment.paymentId] }),
  });
}

export function useExecutePayment() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["payments", "execute"],
    mutationFn: (payload: ExecutePaymentRequest) => executePayment(payload),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: ["payments", input.paymentId] }),
  });
}

export function usePaymentStatus(paymentId: string) {
  return useQuery({
    queryKey: ["payments", paymentId],
    queryFn: () => getPaymentStatus(paymentId),
    enabled: Boolean(paymentId),
  });
}
