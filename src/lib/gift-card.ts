import { ApiError } from "@/lib/api";
import type { GiftCardDenomination } from "@/types/gift-card";
export { formatMoney, formatMoneyCode } from "@/lib/format";

export const giftCardBusinessMessages = {
  GIFT_CARD_NOT_FOUND: "This gift card is no longer available.",
  GIFT_CARD_DENOMINATION_NOT_FOUND: "That denomination is no longer available.",
  GIFT_CARD_INACTIVE: "This gift card is currently inactive.",
  GIFT_CARD_DENOMINATION_INACTIVE: "That denomination is currently inactive.",
  GIFT_CARD_OUT_OF_STOCK: "That denomination just went out of stock. Choose another option.",
  INSUFFICIENT_GIFT_CARD_STOCK: "There is not enough stock for the requested quantity.",
  GIFT_CARD_CODE_ALREADY_EXISTS: "One or more codes already exist in inventory.",
  GIFT_CARD_CODE_ALREADY_SOLD: "A sold code cannot be changed.",
  INVALID_GIFT_CARD_CODE_STATE: "That inventory status change is not allowed.",
  DELIVERY_EMAIL_REQUIRED: "Choose your account email or enter a delivery email.",
  ACCOUNT_EMAIL_NOT_AVAILABLE: "Your account does not have an email available for delivery.",
  EMAIL_NOT_VERIFIED: "Verify your account email before purchasing a gift card.",
  DENOMINATION_REQUIRED: "Select a gift-card denomination before continuing.",
  DUPLICATE_CHECKOUT: "This checkout was already processed. Check your orders before trying again.",
  ORDER_NOT_FOUND: "That order could not be found.",
  DELIVERY_NOT_FOUND: "Verified delivery is not available for this order yet.",
  INVALID_CART: "The cart could not be checked out. Review its items and try again.",
  EMPTY_CART: "Your cart is empty.",
} as const;

export type GiftCardBusinessCode = keyof typeof giftCardBusinessMessages;

function responseCode(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const record = payload as Record<string, unknown>;
  if (typeof record.code === "string") return record.code;
  if (record.data && typeof record.data === "object") {
    const code = (record.data as Record<string, unknown>).code;
    if (typeof code === "string") return code;
  }
  return null;
}

export function getGiftCardErrorCode(error: unknown): string | null {
  return error instanceof ApiError ? responseCode(error.payload) : responseCode(error);
}

export function getGiftCardErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  const code = getGiftCardErrorCode(error) as GiftCardBusinessCode | null;
  if (code && code in giftCardBusinessMessages) return giftCardBusinessMessages[code];
  return error instanceof Error && error.message ? error.message : fallback;
}

function decimalParts(value: string) {
  const normalized = value.trim().replace(/^\+/, "");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return { whole: "0", fraction: "" };
  const [whole, fraction = ""] = normalized.split(".");
  return { whole: whole.replace(/^0+(?=\d)/, ""), fraction: fraction.replace(/0+$/, "") };
}

export function compareDecimalStrings(left: string, right: string) {
  const a = decimalParts(left);
  const b = decimalParts(right);
  if (a.whole.length !== b.whole.length) return a.whole.length - b.whole.length;
  if (a.whole !== b.whole) return a.whole < b.whole ? -1 : 1;
  const width = Math.max(a.fraction.length, b.fraction.length);
  const af = a.fraction.padEnd(width, "0");
  const bf = b.fraction.padEnd(width, "0");
  return af === bf ? 0 : af < bf ? -1 : 1;
}

export function lowestAvailableDenomination(denominations: GiftCardDenomination[]) {
  return denominations
    .filter((item) => item.inStock && item.isActive !== false)
    .sort((a, b) => compareDecimalStrings(a.sellingPriceBdt, b.sellingPriceBdt))[0] ?? null;
}

export function productImage(product: { imageUrl?: string | null; image?: string | null }) {
  return product.imageUrl || product.image || "/window.svg";
}

export function isValidDecimalString(value: string) {
  const normalized = value.trim();
  return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(normalized) && Number(normalized) > 0;
}

export function maskSecret(value: string) {
  const trimmed = value.trim();
  if (trimmed.length <= 4) return "••••";
  return `${trimmed.slice(0, 2)}${"•".repeat(Math.min(10, trimmed.length - 4))}${trimmed.slice(-2)}`;
}
