import type { DeliveryStatus, OrderStatus, PaymentStatus } from "@/types/api";

export type DecimalString = string;

export interface GiftCardDenomination {
  id: string;
  giftCardId?: string;
  faceValue: DecimalString;
  faceCurrency: string;
  sellingPriceBdt: DecimalString;
  inStock: boolean;
  isPopular: boolean;
  isActive?: boolean;
  sortOrder?: number;
  stock?: GiftCardStockCounts;
  createdAt?: string;
  updatedAt?: string;
}

export interface GiftCardProduct {
  id: string;
  name: string;
  title: string;
  slug: string;
  brand: string;
  description?: string | null;
  shortDescription?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  logoUrl?: string | null;
  currency: string;
  region?: string | null;
  deliveryType?: string | null;
  termsAndConditions?: string | null;
  instructions?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
  denominations: GiftCardDenomination[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GiftCardPage {
  data: GiftCardProduct[];
  meta: PaginationMeta;
}

export interface GiftCardCatalogFilters {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  minPriceBdt?: string;
  maxPriceBdt?: string;
  faceValue?: string;
}

export interface DeliveryEmailInput {
  useAccountEmail: boolean;
  deliveryEmail?: string;
}

export interface InstantBuyInput extends DeliveryEmailInput {
  denominationId: string;
  quantity: number;
}

export interface GiftCardPurchaseResult {
  id: string;
  orderNumber: string;
  deliveryEmail: string;
  totalBdt: DecimalString;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderId: string;
  paymentId: string;
  transactionId: string;
  paymentUrl: string;
  paymentExpiresAt: string;
}

export interface BuyNowCheckoutInput {
  productId: string;
}

export interface CheckoutResponse {
  orderId: string;
  paymentId: string;
  transactionId: string;
  paymentUrl: string;
  paymentExpiresAt: string;
}

export type GiftCardDeliveryVerificationStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED";

export interface VerifiedGiftCardCode {
  code: string;
  pin: string | null;
  expiryDate: string | null;
  emailStatus: DeliveryStatus | null;
}

export interface VerifiedGiftCardProduct {
  name: string;
  brand: string;
  value: DecimalString | null;
  currency: string;
  delivery: VerifiedGiftCardCode[];
}

export interface PendingGiftCardOrderDelivery {
  status: "PENDING" | "PROCESSING";
  orderId: string;
}

export interface CompletedGiftCardOrderDelivery {
  status: "COMPLETED";
  orderId: string;
  orderNumber: string;
  products: VerifiedGiftCardProduct[];
  payment: {
    provider: "AAMARPAY";
    trxId: string;
  };
}

export type GiftCardOrderDelivery =
  | PendingGiftCardOrderDelivery
  | CompletedGiftCardOrderDelivery;

export interface GiftCardCartProduct {
  id: string;
  name?: string;
  title?: string;
  brand?: string;
  imageUrl?: string | null;
  image?: string | null;
}

export interface GiftCardCartItem {
  id: string;
  quantity: number;
  denominationId?: string;
  giftCardDenominationId?: string;
  unitPriceBdt?: DecimalString;
  sellingPriceBdt?: DecimalString;
  product?: GiftCardCartProduct | null;
  giftCard?: GiftCardCartProduct | null;
  denomination?: GiftCardDenomination | null;
  giftCardDenomination?: GiftCardDenomination | null;
}

export interface GiftCardCart {
  id?: string;
  items: GiftCardCartItem[];
  subtotalBdt?: DecimalString;
  totalBdt?: DecimalString;
}

export interface GiftCardDelivery {
  code?: string | null;
  pin?: string | null;
  expiryDate?: string | null;
  status?: DeliveryStatus;
}

export interface GiftCardOrderItem {
  id?: string;
  giftCardName: string;
  brand: string;
  faceValue: DecimalString;
  currency: string;
  quantity: number;
  priceBdt?: DecimalString;
  deliveryStatus: DeliveryStatus;
  imageUrl?: string | null;
  deliveries?: GiftCardDelivery[];
}

export interface GiftCardOrder {
  id: string;
  orderNumber: string;
  deliveryEmail: string;
  totalBdt: DecimalString;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: GiftCardOrderItem[];
  customer?: { id?: string; name?: string; email?: string; phone?: string | null } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface GiftCardOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  email?: string;
  orderNumber?: string;
  from?: string;
  to?: string;
}

export interface GiftCardOrderPage {
  data: GiftCardOrder[];
  meta: PaginationMeta;
}

export interface GiftCardProductInput {
  name: string;
  slug: string;
  brand: string;
  description?: string;
  shortDescription?: string;
  imageUrl?: string;
  logoUrl?: string;
  currency: string;
  region?: string;
  deliveryType?: string;
  termsAndConditions?: string;
  instructions?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export interface GiftCardDenominationInput {
  faceValue: DecimalString;
  faceCurrency: string;
  sellingPriceBdt: DecimalString;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export type GiftCardCodeStatus = "AVAILABLE" | "RESERVED" | "SOLD" | "DISABLED" | "EXPIRED";

export interface GiftCardStockCounts {
  available: number;
  reserved: number;
  sold: number;
  disabled: number;
  expired: number;
  total: number;
}

export interface GiftCardCodeInput {
  code: string;
  pin?: string | null;
  serialNumber?: string | null;
  expiryDate?: string | null;
}

export interface GiftCardCode {
  id: string;
  maskedCode: string;
  code?: string;
  maskedPin?: string | null;
  pin?: string | null;
  serialNumber?: string | null;
  orderItemId?: string | null;
  expiryDate?: string | null;
  status: GiftCardCodeStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface GiftCardCodeFilters {
  page?: number;
  limit?: number;
  status?: GiftCardCodeStatus;
  expiryBefore?: string;
  expiryAfter?: string;
}

export interface GiftCardCodePage {
  data: GiftCardCode[];
  meta: PaginationMeta;
}

export interface GiftCardInventorySummary extends GiftCardStockCounts {
  totalProducts: number;
  lowStock: Array<{
    giftCardId: string;
    giftCardName: string;
    denominationId: string;
    faceValue: DecimalString;
    faceCurrency: string;
    available: number;
  }>;
}
