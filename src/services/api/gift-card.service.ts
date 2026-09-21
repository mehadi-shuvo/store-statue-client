import { apiData, apiRequest, queryString } from "@/lib/api";
import { validatePaymentUrl } from "@/lib/payment-url";
import type {
  CheckoutResponse,
  CompletedGiftCardOrderDelivery,
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
  GiftCardOrderDelivery,
  InstantBuyInput,
  VerifiedGiftCardCode,
  VerifiedGiftCardProduct,
} from "@/types/gift-card";
import {
  mapGiftCardCode,
  mapGiftCardCodePage,
  mapGiftCardDenomination,
  mapGiftCardInventorySummary,
  mapGiftCardPage,
  mapGiftCardProduct,
} from "@/services/api/gift-card.mapper";

function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`The server returned an invalid ${label} response.`);
  }
  return value as Record<string, unknown>;
}

function requiredString(
  value: unknown,
  field: string,
  label: string,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`The server returned an invalid ${label} response (${field}).`);
  }
  return value;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function requiredIsoTimestamp(value: unknown, field: string): string {
  const timestamp = requiredString(value, field, "checkout");
  if (Number.isNaN(Date.parse(timestamp))) throw new Error(`The server returned an invalid checkout response (${field}).`);
  return timestamp;
}

export function parseCheckoutResponse(value: unknown): CheckoutResponse {
  const data = record(value, "checkout");
  return {
    orderId: requiredString(data.orderId, "orderId", "checkout"),
    paymentId: requiredString(data.paymentId, "paymentId", "checkout"),
    transactionId: requiredString(data.transactionId, "transactionId", "checkout"),
    paymentUrl: validatePaymentUrl(data.paymentUrl),
    paymentExpiresAt: requiredIsoTimestamp(data.paymentExpiresAt, "paymentExpiresAt"),
  };
}

const deliveryStatuses = new Set([
  "PENDING",
  "QUEUED",
  "PROCESSING",
  "PROVIDER_PENDING",
  "DELIVERED",
  "FAILED",
  "FAILED_RETRYABLE",
  "FAILED_FINAL",
  "MANUAL_REVIEW",
  "CANCELLED",
  "REFUNDED",
]);

function parseDeliveredCode(value: unknown): VerifiedGiftCardCode {
  const data = record(value, "gift-card delivery");
  const emailStatus =
    typeof data.emailStatus === "string" && deliveryStatuses.has(data.emailStatus)
      ? (data.emailStatus as VerifiedGiftCardCode["emailStatus"])
      : null;
  return {
    code: requiredString(data.code, "code", "gift-card delivery"),
    pin: optionalString(data.pin),
    expiryDate: optionalString(data.expiryDate),
    emailStatus,
  };
}

function parseDeliveredProduct(value: unknown): VerifiedGiftCardProduct {
  const data = record(value, "gift-card product delivery");
  if (!Array.isArray(data.delivery) || data.delivery.length === 0) {
    throw new Error("The server returned gift-card delivery without a code.");
  }
  const cardValue = data.value;
  if (cardValue !== null && typeof cardValue !== "string") {
    throw new Error("The server returned an invalid gift-card value.");
  }
  return {
    name: requiredString(data.name, "name", "gift-card product delivery"),
    brand: requiredString(data.brand, "brand", "gift-card product delivery"),
    value: cardValue,
    currency: requiredString(data.currency, "currency", "gift-card product delivery"),
    delivery: data.delivery.map(parseDeliveredCode),
  };
}

export function parseGiftCardOrderDelivery(
  value: unknown,
  expectedOrderId: string,
): GiftCardOrderDelivery {
  const data = record(value, "order delivery");
  const orderId = requiredString(data.orderId, "orderId", "order delivery");
  if (orderId !== expectedOrderId) {
    throw new Error("The server returned delivery for a different order.");
  }

  if (data.status === "PENDING" || data.status === "PROCESSING") {
    return { status: data.status, orderId };
  }
  if (!Array.isArray(data.products) || data.products.length === 0) {
    throw new Error("The server returned an invalid order delivery response (products).");
  }
  const payment = record(data.payment, "order payment");
  if (payment.provider !== "AAMARPAY") {
    throw new Error("The server returned an unexpected payment provider.");
  }

  const completed: CompletedGiftCardOrderDelivery = {
    status: "COMPLETED",
    orderId,
    orderNumber: requiredString(data.orderNumber, "orderNumber", "order delivery"),
    products: data.products.map(parseDeliveredProduct),
    payment: {
      provider: "AAMARPAY",
      trxId: requiredString(payment.trxId, "trxId", "order payment"),
    },
  };
  return completed;
}

export function createCheckoutIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  }
  throw new Error("Secure checkout is unavailable in this browser.");
}

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
  createBuyNowCheckout(productId: string, idempotencyKey = createCheckoutIdempotencyKey()) {
    return apiData<unknown>("/checkout/buy-now", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: { productId },
    }).then(parseCheckoutResponse);
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
  checkout(input: DeliveryEmailInput, idempotencyKey = createCheckoutIdempotencyKey()) {
    return apiData<GiftCardPurchaseResult>("/cart/checkout", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: input,
    }).then(data => ({ ...data, ...parseCheckoutResponse(data) }));
  },
  orders(filters?: Pick<GiftCardOrderFilters, "page" | "limit">) {
    return apiData<GiftCardOrderPage>(`/me/gift-card-orders${queryString(filters)}`);
  },
  order(orderId: string) {
    return apiData<GiftCardOrder>(`/me/gift-card-orders/${encodeURIComponent(orderId)}`);
  },
  getOrderDelivery(orderId: string) {
    return apiData<unknown>(`/orders/${encodeURIComponent(orderId)}/delivery`)
      .then(value => parseGiftCardOrderDelivery(value, orderId));
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
