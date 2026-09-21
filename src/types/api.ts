export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN" | "STAFF";
export type AdminRole = Extract<UserRole, "ADMIN" | "SUPER_ADMIN">;
export type DigitalProductType = "GIFT_CARD" | "GAME_TOP_UP" | "SUBSCRIPTION";
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";
export type ProductInputType = "TEXT" | "NUMBER" | "EMAIL" | "PHONE" | "SELECT" | "RADIO" | "TEXTAREA";
export type GiftCardRegion = "GLOBAL" | "USA" | "UK" | "CANADA" | "EUROPE" | "AUSTRALIA" | "INDIA" | "BANGLADESH" | "SINGAPORE" | "JAPAN" | "UAE" | "OTHER";
export type GiftCardDeliveryType = "CODE" | "LINK" | "MANUAL" | "ACCOUNT_RECHARGE";
export type GameTopUpFulfillmentType = "PLAYER_ID" | "PLAYER_ID_AND_SERVER" | "EMAIL" | "PHONE" | "LOGIN_CREDENTIALS" | "REDEEM_CODE" | "MANUAL";
export type SubscriptionDeliveryType = "ACCOUNT_CREDENTIALS" | "CUSTOMER_ACCOUNT_ACTIVATION" | "FAMILY_INVITATION" | "REDEEM_CODE" | "LICENSE_KEY" | "MANUAL";
export type SubscriptionBillingCycle = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY" | "LIFETIME" | "CUSTOM";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "MANUAL_REVIEW" | "REFUND_PENDING" | "REFUNDED" | "PARTIALLY_REFUNDED";
export type PaymentStatus = "CREATED" | "PENDING" | "INITIATED" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED" | "UNKNOWN" | "REFUND_PENDING" | "REFUNDED" | "REFUND_FAILED" | "PARTIALLY_REFUNDED";
export type DeliveryStatus = "PENDING" | "QUEUED" | "PROCESSING" | "PROVIDER_PENDING" | "DELIVERED" | "FAILED" | "FAILED_RETRYABLE" | "FAILED_FINAL" | "MANUAL_REVIEW" | "CANCELLED" | "REFUNDED";
export type PaymentMethod = "AAMARPAY" | "NAGAD" | "ROCKET" | "CARD" | "BANK_TRANSFER" | "CASH" | "MANUAL";
export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export type Money = number | string;
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  statusCode: number;
  message: string;
  code?: string;
  details?: ApiFieldError[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Paginated<T> {
  meta: PaginationMeta;
  data: T[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface RegisteredUser extends User {
  verificationEmailSent: boolean;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInput {
  title: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface PricedOption {
  id: string;
  title: string | null;
  sellingPriceBDT: Money;
  costPriceBDT: Money | null;
  discountAmountBDT: Money | null;
  discountPercent: Money | null;
  discountLabel: string | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  stockQuantity: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardDenomination extends PricedOption {
  giftCardProductId: string;
  cardValue: Money;
  cardCurrency: string;
}

export interface GameTopUpPackage extends PricedOption {
  gameTopUpProductId: string;
  gameCurrencyAmount: number;
  bonusCurrencyAmount: number;
}

export interface SubscriptionPlan extends Omit<PricedOption, "title"> {
  subscriptionProductId: string;
  title: string;
  description: string | null;
  billingCycle: SubscriptionBillingCycle;
  durationDays: number | null;
  durationLabel: string | null;
  maxDevices: number | null;
  maxUsers: number | null;
  screenCount: number | null;
  profileCount: number | null;
  accountType: string | null;
  subscriptionTier: string | null;
  features: string[];
}

export interface ProductInputField {
  id: string;
  name: string;
  label: string;
  type: ProductInputType;
  placeholder: string | null;
  helpText: string | null;
  isRequired: boolean;
  options: JsonValue | null;
  validationRules: JsonValue | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductBase {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  bannerImage: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  sortOrder: number;
  categoryId: string | null;
  category: Pick<Category, "id" | "title" | "slug"> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GiftCardProduct extends ProductBase {
  productType: "GIFT_CARD";
  brand: string;
  image: string;
  cardCurrency: string;
  region: GiftCardRegion;
  deliveryType: GiftCardDeliveryType;
  instructions: string | null;
  termsAndConditions: string | null;
  denominations: GiftCardDenomination[];
}

export interface GameTopUpProduct extends ProductBase {
  productType: "GAME_TOP_UP";
  name: string;
  subHeading: string | null;
  logo: string;
  gameCurrencyName: string;
  fulfillmentType: GameTopUpFulfillmentType;
  instructions: string | null;
  estimatedDelivery: string | null;
  termsAndConditions: string | null;
  packages: GameTopUpPackage[];
  inputFields: ProductInputField[];
}

export interface SubscriptionProduct extends ProductBase {
  productType: "SUBSCRIPTION";
  platformName: string;
  subHeading: string | null;
  logo: string;
  deliveryType: SubscriptionDeliveryType;
  instructions: string | null;
  estimatedDelivery: string | null;
  termsAndConditions: string | null;
  isRenewable: boolean;
  plans: SubscriptionPlan[];
  inputFields: ProductInputField[];
}

export type DigitalProduct = GiftCardProduct | GameTopUpProduct | SubscriptionProduct;

export interface ProductListQuery {
  page?: number;
  limit?: number;
  type?: DigitalProductType;
  productType?: DigitalProductType;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  userId: string;
  productType: DigitalProductType;
  giftCardProductId: string | null;
  gameTopUpProductId: string | null;
  subscriptionProductId: string | null;
  user?: Pick<User, "id" | "name">;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productType: DigitalProductType;
  quantity: number;
  unitPrice: Money;
  customerInputs: JsonValue | null;
  optionKey: string;
  giftCardProductId: string | null;
  giftCardDenominationId: string | null;
  giftCardProduct: Omit<GiftCardProduct, "productType" | "denominations"> | null;
  giftCardDenomination: GiftCardDenomination | null;
  gameTopUpProductId: string | null;
  gameTopUpPackageId: string | null;
  gameTopUpProduct: Omit<GameTopUpProduct, "productType" | "packages" | "inputFields"> | null;
  gameTopUpPackage: GameTopUpPackage | null;
  subscriptionProductId: string | null;
  subscriptionPlanId: string | null;
  subscriptionProduct: Omit<SubscriptionProduct, "productType" | "plans" | "inputFields"> | null;
  subscriptionPlan: SubscriptionPlan | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export type CartOptionSelection =
  | { giftCardDenominationId: string; gameTopUpPackageId?: never; subscriptionPlanId?: never }
  | { giftCardDenominationId?: never; gameTopUpPackageId: string; subscriptionPlanId?: never }
  | { giftCardDenominationId?: never; gameTopUpPackageId?: never; subscriptionPlanId: string };

export type AddCartItemInput = CartOptionSelection & {
  productId: string;
  quantity: number;
  customerInputs?: Record<string, JsonValue>;
};

export type CartItemIdentity = CartOptionSelection & { productId: string };
export type UpdateCartItemInput = CartItemIdentity & { quantity: number };

export type OrderCustomer = Pick<User, "id" | "email" | "name" | "phone">;

export interface OrderItem {
  id: string;
  orderId: string;
  productType: DigitalProductType;
  quantity: number;
  unitPrice: Money;
  totalPrice: Money;
  productTitle: string;
  optionTitle: string | null;
  productImage: string | null;
  customerInputs: JsonValue | null;
  deliveryStatus: DeliveryStatus;
  fulfillmentReference: string | null;
  fulfillmentData: JsonValue | null;
  failureReason: string | null;
  fulfilledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  notes: string | null;
  subtotal: Money;
  discountTotal: Money;
  totalCost: Money;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  userId: string;
  user?: OrderCustomer;
  items?: OrderItem[];
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  paymentProvider: string;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  transactionId: string | null;
  providerPaymentId: string | null;
  merchantInvoiceNumber: string | null;
  payerAccount: string | null;
  amount: Money;
  currency: string;
  providerResponse?: JsonValue | null;
  rawResponse?: JsonValue | null;
  failureReason: string | null;
  reconciliationReason?: string | null;
  attempts?: Array<{ id: string; gateway: string; merchantTransactionId: string; gatewayTransactionId?: string | null; status: string; initiatedAt: string; verifiedAt?: string | null; failureReason?: string | null }>;
  paidAt: string | null;
  order?: Order;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResult { orderId: string; paymentId: string; transactionId: string; paymentUrl: string; paymentExpiresAt?: string }

export interface ManagedUser extends User {
  _count?: { orders: number; reviews: number; addresses: number };
}

export interface SalesStatistics {
  totalSales: Money;
  paidOrders: number;
  totalOrders: number;
  pendingPayments: number;
  failedPayments: number;
  recentOrders: Order[];
}

export interface AuditLog {
  id: string;
  actorId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: JsonValue | null;
  actor?: Pick<User, "id" | "email" | "name" | "role"> | null;
  createdAt: string;
}

export interface ApplicationLog {
  level: LogLevel | string;
  message: string;
  time?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface DigitalProductOverview {
  counts: { giftCards: number; topUps: number; subscriptions: number; inactiveDigitalProducts: number };
  lowStock: Array<PricedOption & { productType: DigitalProductType; product: { id: string; title: string; image?: string; logo?: string } }>;
}
