import { apiData, apiRequest, queryString } from "@/lib/api";
import type {
  DeliveryEmailInput,
  GiftCardCatalogFilters,
  GiftCardCodeFilters,
  GiftCardCodeInput,
  GiftCardDenominationInput,
  GiftCardOrder,
  GiftCardOrderFilters,
  GiftCardOrderPage,
  GiftCardPage,
  GiftCardProduct,
  GiftCardProductInput,
  GiftCardPurchaseResult,
  GiftCardCart,
  InstantBuyInput,
} from "@/types/gift-card";
import {
  mapGiftCardCode,
  mapGiftCardCodePage,
  mapGiftCardDenomination,
  mapGiftCardInventorySummary,
  mapGiftCardPage,
  mapGiftCardProduct,
} from "@/services/api/gift-card.mapper";

export const giftCardService = {
  catalog(filters?: GiftCardCatalogFilters) {
    return apiData<GiftCardPage>(`/gift-cards${queryString(filters)}`);
  },
  detail(slug: string) {
    return apiData<GiftCardProduct>(`/gift-cards/${encodeURIComponent(slug)}`);
  },
  instantBuy(input: InstantBuyInput) {
    return apiData<GiftCardPurchaseResult>("/gift-cards/instant-buy", { method: "POST", body: input });
  },
  cart() {
    return apiData<GiftCardCart>("/cart");
  },
  addCartItem(denominationId: string, quantity = 1) {
    return apiData<GiftCardCart>("/cart/items", { method: "POST", body: { denominationId, quantity } });
  },
  updateCartItem(cartItemId: string, quantity: number) {
    return apiData<GiftCardCart>(`/cart/items/${encodeURIComponent(cartItemId)}`, { method: "PATCH", body: { quantity } });
  },
  async removeCartItem(cartItemId: string) {
    await apiRequest<never>(`/cart/items/${encodeURIComponent(cartItemId)}`, { method: "DELETE" });
  },
  async clearCart() {
    await apiRequest<never>("/cart", { method: "DELETE" });
  },
  checkout(input: DeliveryEmailInput) {
    return apiData<GiftCardPurchaseResult>("/cart/checkout", { method: "POST", body: input });
  },
  orders(filters?: Pick<GiftCardOrderFilters, "page" | "limit">) {
    return apiData<GiftCardOrderPage>(`/me/gift-card-orders${queryString(filters)}`);
  },
  order(orderId: string) {
    return apiData<GiftCardOrder>(`/me/gift-card-orders/${encodeURIComponent(orderId)}`);
  },

  adminProducts(filters?: GiftCardCatalogFilters & { isActive?: boolean }) {
    const { isActive, ...rest } = filters ?? {};
    const query = { ...rest, ...(isActive !== undefined && { status: isActive ? "ACTIVE" : "INACTIVE" }) };
    return apiData<unknown>(`/admin/gift-cards${queryString(query)}`).then(mapGiftCardPage);
  },
  adminProduct(id: string) {
    return apiData<unknown>(`/admin/gift-cards/${encodeURIComponent(id)}`).then(mapGiftCardProduct);
  },
  createProduct(input: GiftCardProductInput) {
    return apiData<unknown>("/admin/gift-cards", { method: "POST", body: input }).then(mapGiftCardProduct);
  },
  updateProduct(id: string, input: Partial<GiftCardProductInput>) {
    return apiData<unknown>(`/admin/gift-cards/${encodeURIComponent(id)}`, { method: "PATCH", body: input }).then(mapGiftCardProduct);
  },
  async archiveProduct(id: string) {
    await apiRequest<never>(`/admin/gift-cards/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  denominations(productId: string) {
    return apiData<unknown[]>(`/admin/gift-cards/${encodeURIComponent(productId)}/denominations`).then(items => items.map(mapGiftCardDenomination));
  },
  createDenomination(productId: string, input: GiftCardDenominationInput) {
    return apiData<unknown>(`/admin/gift-cards/${encodeURIComponent(productId)}/denominations`, { method: "POST", body: input }).then(mapGiftCardDenomination);
  },
  updateDenomination(id: string, input: Partial<GiftCardDenominationInput>) {
    return apiData<unknown>(`/admin/gift-card-denominations/${encodeURIComponent(id)}`, { method: "PATCH", body: input }).then(mapGiftCardDenomination);
  },
  async deactivateDenomination(id: string) {
    await apiRequest<never>(`/admin/gift-card-denominations/${encodeURIComponent(id)}`, { method: "DELETE" });
  },
  addCode(denominationId: string, input: GiftCardCodeInput) {
    return apiData<unknown>(`/admin/gift-card-denominations/${encodeURIComponent(denominationId)}/codes`, { method: "POST", body: input }).then(mapGiftCardCode);
  },
  addCodes(denominationId: string, codes: GiftCardCodeInput[]) {
    return apiData<{ inserted: number; duplicates?: string[] }>(`/admin/gift-card-denominations/${encodeURIComponent(denominationId)}/codes/bulk`, { method: "POST", body: { codes } });
  },
  codes(denominationId: string, filters?: GiftCardCodeFilters) {
    return apiData<unknown>(`/admin/gift-card-denominations/${encodeURIComponent(denominationId)}/codes${queryString(filters)}`).then(mapGiftCardCodePage);
  },
  code(codeId: string) {
    return apiData<unknown>(`/admin/gift-card-codes/${encodeURIComponent(codeId)}`).then(value => mapGiftCardCode(value, true));
  },
  updateCode(codeId: string, input: Partial<GiftCardCodeInput> & { status?: string }) {
    return apiData<unknown>(`/admin/gift-card-codes/${encodeURIComponent(codeId)}`, { method: "PATCH", body: input }).then(mapGiftCardCode);
  },
  async deleteCode(codeId: string) {
    await apiRequest<never>(`/admin/gift-card-codes/${encodeURIComponent(codeId)}`, { method: "DELETE" });
  },
  inventorySummary() {
    return apiData<unknown>("/admin/gift-card-inventory/summary").then(mapGiftCardInventorySummary);
  },
  adminOrders(filters?: GiftCardOrderFilters) {
    return apiData<GiftCardOrderPage>(`/admin/gift-card-orders${queryString(filters)}`);
  },
  adminOrder(orderId: string) {
    return apiData<GiftCardOrder>(`/admin/gift-card-orders/${encodeURIComponent(orderId)}`);
  },
};
