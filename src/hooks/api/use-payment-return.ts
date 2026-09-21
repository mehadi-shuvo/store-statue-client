"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import { gameTopUpService } from "@/services/api/game-top-up.service";
import { giftCardService } from "@/services/api/gift-card.service";
import type { CustomerTopUpOrder } from "@/types/game-top-up";
import type { GiftCardOrder } from "@/types/gift-card";

export type PaymentReturnOrder =
  | { kind: "game-top-up"; order: CustomerTopUpOrder }
  | { kind: "gift-card"; order: GiftCardOrder };

async function fetchPaymentReturnOrder(orderId: string): Promise<PaymentReturnOrder> {
  try {
    return { kind: "game-top-up", order: await gameTopUpService.order(orderId) };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) throw error;
  }
  return { kind: "gift-card", order: await giftCardService.order(orderId) };
}

export function usePaymentReturnOrder(orderId: string) {
  return useQuery({
    queryKey: ["payment-return", orderId],
    queryFn: () => fetchPaymentReturnOrder(orderId),
    enabled: Boolean(orderId),
    staleTime: 0,
    retry: false,
  });
}
