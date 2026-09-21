"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { giftCardService } from "@/services/api/gift-card.service";
import type {
  DeliveryEmailInput,
  GiftCardCatalogFilters,
  GiftCardCodeFilters,
  GiftCardCodeInput,
  GiftCardDenominationInput,
  GiftCardOrderFilters,
  GiftCardProductInput,
  InstantBuyInput,
} from "@/types/gift-card";
import { apiKeys, giftCardKeys } from "@/hooks/api/query-keys";

const sensitiveQueryOptions = { staleTime: 0, gcTime: 0, retry: false } as const;

export function useGiftCardCatalog(filters?: GiftCardCatalogFilters) {
  return useQuery({ queryKey: giftCardKeys.list(filters), queryFn: () => giftCardService.catalog(filters), placeholderData: previous => previous });
}

export function useGiftCardDetail(slug: string) {
  return useQuery({ queryKey: giftCardKeys.detail(slug), queryFn: () => giftCardService.detail(slug), enabled: Boolean(slug) });
}

export function useInstantGiftCardBuy() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: InstantBuyInput) => giftCardService.instantBuy(input),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: giftCardKeys.lists() }),
      client.invalidateQueries({ queryKey: giftCardKeys.details() }),
      client.invalidateQueries({ queryKey: giftCardKeys.cart() }),
      client.invalidateQueries({ queryKey: giftCardKeys.orders() }),
      client.invalidateQueries({ queryKey: apiKeys.cart }),
    ]),
  });
}

export function useBuyNowCheckout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, idempotencyKey }: { productId: string; idempotencyKey: string }) =>
      giftCardService.createBuyNowCheckout(productId, idempotencyKey),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: giftCardKeys.lists() }),
      client.invalidateQueries({ queryKey: giftCardKeys.details() }),
      client.invalidateQueries({ queryKey: giftCardKeys.orders() }),
    ]),
  });
}

export function useGiftCardCart(enabled = true) {
  return useQuery({ queryKey: giftCardKeys.cart(), queryFn: giftCardService.cart, enabled, retry: false });
}

function useCartInvalidation() {
  const client = useQueryClient();
  return () => Promise.all([
    client.invalidateQueries({ queryKey: giftCardKeys.cart() }),
    client.invalidateQueries({ queryKey: apiKeys.cart }),
  ]);
}

export function useAddGiftCardToCart() {
  const invalidate = useCartInvalidation();
  return useMutation({ mutationFn: ({ denominationId, quantity = 1 }: { denominationId: string; quantity?: number }) => giftCardService.addCartItem(denominationId, quantity), onSuccess: invalidate });
}

export function useUpdateGiftCardCartItem() {
  const invalidate = useCartInvalidation();
  return useMutation({ mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => giftCardService.updateCartItem(itemId, quantity), onSuccess: invalidate });
}

export function useRemoveGiftCardCartItem() {
  const invalidate = useCartInvalidation();
  return useMutation({ mutationFn: giftCardService.removeCartItem, onSuccess: invalidate });
}

export function useClearGiftCardCart() {
  const invalidate = useCartInvalidation();
  return useMutation({ mutationFn: giftCardService.clearCart, onSuccess: invalidate });
}

export function useGiftCardCheckout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ delivery, idempotencyKey }: { delivery: DeliveryEmailInput; idempotencyKey: string }) =>
      giftCardService.checkout(delivery, idempotencyKey),
    onSuccess: async () => Promise.all([
      client.invalidateQueries({ queryKey: giftCardKeys.cart() }),
      client.invalidateQueries({ queryKey: giftCardKeys.lists() }),
      client.invalidateQueries({ queryKey: giftCardKeys.details() }),
      client.invalidateQueries({ queryKey: giftCardKeys.orders() }),
      client.invalidateQueries({ queryKey: apiKeys.cart }),
    ]),
  });
}

export function useGiftCardOrders(filters?: Pick<GiftCardOrderFilters, "page" | "limit">) {
  return useQuery({ queryKey: giftCardKeys.orderList(filters), queryFn: () => giftCardService.orders(filters), placeholderData: previous => previous });
}

export function useGiftCardOrder(id: string) {
  return useQuery({ queryKey: giftCardKeys.orderDetail(id), queryFn: () => giftCardService.order(id), enabled: Boolean(id), ...sensitiveQueryOptions });
}

export function useGiftCardOrderDelivery(id: string) {
  return useQuery({
    queryKey: giftCardKeys.orderDelivery(id),
    queryFn: () => giftCardService.getOrderDelivery(id),
    enabled: Boolean(id),
    ...sensitiveQueryOptions,
  });
}

export function useAdminGiftCards(filters?: GiftCardCatalogFilters & { isActive?: boolean }) {
  return useQuery({ queryKey: giftCardKeys.adminList(filters), queryFn: () => giftCardService.adminProducts(filters), placeholderData: previous => previous });
}

export function useAdminGiftCard(id: string) {
  return useQuery({ queryKey: giftCardKeys.adminDetail(id), queryFn: () => giftCardService.adminProduct(id), enabled: Boolean(id) });
}

export function useCreateGiftCard() {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: GiftCardProductInput) => giftCardService.createProduct(input), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.adminLists() }), client.invalidateQueries({ queryKey: giftCardKeys.lists() })]) });
}

export function useUpdateGiftCard() {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<GiftCardProductInput> }) => giftCardService.updateProduct(id, input), onSuccess: (_, { id }) => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.adminLists() }), client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(id) }), client.invalidateQueries({ queryKey: giftCardKeys.lists() }), client.invalidateQueries({ queryKey: giftCardKeys.details() })]) });
}

export function useArchiveGiftCard() {
  const client = useQueryClient();
  return useMutation({ mutationFn: giftCardService.archiveProduct, onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.adminLists() }), client.invalidateQueries({ queryKey: giftCardKeys.lists() })]) });
}

export function useGiftCardDenominations(productId: string) {
  return useQuery({ queryKey: giftCardKeys.denominations(productId), queryFn: () => giftCardService.denominations(productId), enabled: Boolean(productId) });
}

export function useCreateGiftCardDenomination(productId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (input: GiftCardDenominationInput) => giftCardService.createDenomination(productId, input), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.denominations(productId) }), client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) }), client.invalidateQueries({ queryKey: giftCardKeys.details() })]) });
}

export function useUpdateGiftCardDenomination(productId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<GiftCardDenominationInput> }) => giftCardService.updateDenomination(id, input), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.denominations(productId) }), client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) }), client.invalidateQueries({ queryKey: giftCardKeys.details() })]) });
}

export function useDeactivateGiftCardDenomination(productId: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: giftCardService.deactivateDenomination, onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.denominations(productId) }), client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) }), client.invalidateQueries({ queryKey: giftCardKeys.details() })]) });
}

export function useGiftCardInventorySummary(enabled = true) {
  return useQuery({ queryKey: giftCardKeys.inventorySummary(), queryFn: giftCardService.inventorySummary, enabled });
}

export function useGiftCardCodes(denominationId: string, filters?: GiftCardCodeFilters) {
  return useQuery({ queryKey: giftCardKeys.inventory(denominationId, filters), queryFn: () => giftCardService.codes(denominationId, filters), enabled: Boolean(denominationId), placeholderData: previous => previous });
}

export function useGiftCardCode(id: string, enabled: boolean) {
  return useQuery({ queryKey: giftCardKeys.codeDetail(id), queryFn: () => giftCardService.code(id), enabled: enabled && Boolean(id), ...sensitiveQueryOptions });
}

export function useAddGiftCardCode(denominationId: string, productId?: string) {
  const client = useQueryClient();
  const invalidate = () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.inventories(denominationId) }), client.invalidateQueries({ queryKey: giftCardKeys.inventorySummary() }), client.invalidateQueries({ queryKey: giftCardKeys.denominationLists() }), ...(productId ? [client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) })] : []), client.invalidateQueries({ queryKey: giftCardKeys.details() })]);
  return useMutation({ mutationFn: (input: GiftCardCodeInput) => giftCardService.addCode(denominationId, input), onSuccess: invalidate });
}

export function useAddGiftCardCodes(denominationId: string, productId?: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: (codes: GiftCardCodeInput[]) => giftCardService.addCodes(denominationId, codes), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.inventories(denominationId) }), client.invalidateQueries({ queryKey: giftCardKeys.inventorySummary() }), client.invalidateQueries({ queryKey: giftCardKeys.denominationLists() }), ...(productId ? [client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) })] : []), client.invalidateQueries({ queryKey: giftCardKeys.details() })]) });
}

export function useUpdateGiftCardCode(denominationId: string, productId?: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<GiftCardCodeInput> & { status?: string } }) => giftCardService.updateCode(id, input), onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.inventories(denominationId) }), client.invalidateQueries({ queryKey: giftCardKeys.inventorySummary() }), client.invalidateQueries({ queryKey: giftCardKeys.denominationLists() }), ...(productId ? [client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) })] : []), client.removeQueries({ queryKey: giftCardKeys.codeDetails() })]) });
}

export function useDeleteGiftCardCode(denominationId: string, productId?: string) {
  const client = useQueryClient();
  return useMutation({ mutationFn: giftCardService.deleteCode, onSuccess: () => Promise.all([client.invalidateQueries({ queryKey: giftCardKeys.inventories(denominationId) }), client.invalidateQueries({ queryKey: giftCardKeys.inventorySummary() }), client.invalidateQueries({ queryKey: giftCardKeys.denominationLists() }), ...(productId ? [client.invalidateQueries({ queryKey: giftCardKeys.adminDetail(productId) })] : [])]) });
}

export function useAdminGiftCardOrders(filters?: GiftCardOrderFilters) {
  return useQuery({ queryKey: giftCardKeys.adminOrders(filters), queryFn: () => giftCardService.adminOrders(filters), placeholderData: previous => previous });
}

export function useAdminGiftCardOrder(id: string) {
  return useQuery({ queryKey: giftCardKeys.adminOrderDetail(id), queryFn: () => giftCardService.adminOrder(id), enabled: Boolean(id), ...sensitiveQueryOptions });
}
