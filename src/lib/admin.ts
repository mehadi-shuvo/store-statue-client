import { apiUrl, fetchApiJson } from "./api";
import { type AuthUser } from "./auth";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";
export type UserRole = "CUSTOMER" | "STAFF" | AdminRole;
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "MANUAL_REVIEW"
  | "REFUND_PENDING"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";
export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "INITIATED"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "UNKNOWN"
  | "REFUND_PENDING"
  | "REFUNDED"
  | "REFUND_FAILED"
  | "PARTIALLY_REFUNDED";
export type DeliveryStatus =
  | "PENDING"
  | "QUEUED"
  | "PROCESSING"
  | "PROVIDER_PENDING"
  | "DELIVERED"
  | "FAILED"
  | "FAILED_RETRYABLE"
  | "FAILED_FINAL"
  | "MANUAL_REVIEW"
  | "CANCELLED"
  | "REFUNDED";
export type ProductType = ProductResourceType;
export type ProductResourceType = "GIFT_CARD" | "GAME_TOP_UP" | "SUBSCRIPTION";
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "ARCHIVED";
export type GiftCardRegion = "GLOBAL" | "USA" | "UK" | "CANADA" | "EUROPE" | "AUSTRALIA" | "INDIA" | "BANGLADESH" | "SINGAPORE" | "JAPAN" | "UAE" | "OTHER";
export type GiftCardDeliveryType = "CODE" | "LINK" | "MANUAL" | "ACCOUNT_RECHARGE";
export type GameTopUpFulfillmentType = "PLAYER_ID" | "PLAYER_ID_AND_SERVER" | "EMAIL" | "PHONE" | "LOGIN_CREDENTIALS" | "REDEEM_CODE" | "MANUAL";
export type ProductInputType = "TEXT" | "NUMBER" | "EMAIL" | "PHONE" | "SELECT" | "RADIO" | "TEXTAREA";
export type SubscriptionDeliveryType = "ACCOUNT_CREDENTIALS" | "CUSTOMER_ACCOUNT_ACTIVATION" | "FAMILY_INVITATION" | "REDEEM_CODE" | "LICENSE_KEY" | "MANUAL";
export type SubscriptionBillingCycle = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY" | "LIFETIME" | "CUSTOM";

export interface AdminProfile extends AuthUser {
  role: AdminRole;
  isDeleted?: boolean;
}

export interface ManagedUser {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    orders?: number;
    reviews?: number;
    addresses?: number;
  };
}

export interface OrderCustomer {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
}

export interface AdminOrderItem {
  id: string;
  price?: number | string;
  quantity: number;
  totalPrice?: number | string | null;
  productTitle?: string | null;
  productType?: ProductType | null;
  optionTitle?: string | null;
  deliveryStatus?: DeliveryStatus;
  fulfillmentReference?: string | null;
  fulfilledAt?: string | null;
  createdAt?: string;
  product?: {
    id: string;
    title: string;
    type?: ProductType;
    thumbnail?: string | null;
  };
  order?: {
    id: string;
    orderNumber?: string | null;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    user?: OrderCustomer;
  };
}

export interface AdminOrder {
  id: string;
  orderNumber?: string | null;
  subtotal?: number | string | null;
  discountTotal?: number | string | null;
  totalCost: number | string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: OrderCustomer;
  address?: Record<string, unknown> | null;
  payment?: AdminPayment | null;
  items?: AdminOrderItem[];
}

export interface AdminPayment {
  id: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId?: string | null;
  providerPaymentId?: string | null;
  merchantInvoiceNumber?: string | null;
  payerAccount?: string | null;
  amount?: number | string | null;
  currency?: string;
  failureReason?: string | null;
  createdAt: string;
  updatedAt?: string;
  paidAt?: string | null;
  order?: AdminOrder;
}

export interface DigitalProduct {
  id: string;
  title: string;
  type: ProductType;
  price: number | string;
  stockQuantity: number;
  isActive: boolean;
  createdAt?: string;
  category?: {
    id: string;
    title: string;
  };
  reviews?: unknown[];
  orderItems?: unknown[];
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: unknown;
  createdAt: string;
  actor?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  } | null;
}

export interface ApplicationLog {
  id?: string;
  level: "debug" | "info" | "warn" | "error" | string;
  message: string;
  timestamp?: string;
  createdAt?: string;
  context?: unknown;
  metadata?: unknown;
}

interface ApiDataPayload<T> {
  data?: T;
}

export interface SalesStats {
  totalSales: number;
  paidOrders: number;
  totalOrders: number;
  pendingPayments: number;
  failedPayments: number;
  recentOrders: AdminOrder[];
}

export interface DigitalProductOverview {
  counts: {
    giftCards: number;
    topUps: number;
    subscriptions: number;
    inactiveDigitalProducts: number;
  };
  lowStock: Array<{
    id: string;
    title: string;
    type: ProductType;
    stockQuantity?: number | null;
    isActive?: boolean;
    thumbnail?: string | null;
  }>;
}

export interface AdminCategory {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInputField {
  label: string;
  name: string;
  type?: ProductInputType;
  isRequired?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ label: string; value: string }>;
  validationRules?: unknown;
  isActive?: boolean;
  sortOrder?: number;
}

export interface PricedOption {
  title?: string;
  sellingPriceBDT: number;
  costPriceBDT?: number;
  discountAmountBDT?: number;
  discountPercent?: number;
  discountLabel?: string;
  isPopular?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  stockQuantity?: number | null;
}

export interface GiftCardDenomination extends PricedOption {
  cardValue: number;
  cardCurrency?: string;
}

export interface GameTopUpPackage extends PricedOption {
  gameCurrencyAmount: number;
  bonusCurrencyAmount?: number;
}

export interface SubscriptionPlan extends PricedOption {
  title: string;
  description?: string;
  billingCycle: SubscriptionBillingCycle;
  durationDays?: number;
  durationLabel?: string;
  maxDevices?: number;
  maxUsers?: number;
  screenCount?: number;
  profileCount?: number;
  accountType?: string;
  subscriptionTier?: string;
  features?: string[];
}

interface ProductBase {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  bannerImage?: string | null;
  categoryId?: string | null;
  category?: {
    id: string;
    title?: string;
    name?: string;
  } | null;
  sortOrder?: number | null;
  status: ProductStatus;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GiftCard extends ProductBase {
  productType: "GIFT_CARD";
  brand: string;
  image: string;
  cardCurrency?: string;
  region?: GiftCardRegion;
  deliveryType?: GiftCardDeliveryType;
  instructions?: string | null;
  termsAndConditions?: string | null;
  denominations: GiftCardDenomination[];
}

export interface GameTopUp extends ProductBase {
  productType: "GAME_TOP_UP";
  name: string;
  subHeading?: string | null;
  logo: string;
  gameCurrencyName: string;
  fulfillmentType: GameTopUpFulfillmentType;
  instructions?: string | null;
  estimatedDelivery?: string | null;
  termsAndConditions?: string | null;
  packages: GameTopUpPackage[];
  inputFields?: ProductInputField[];
}

export interface Subscription extends ProductBase {
  productType: "SUBSCRIPTION";
  platformName: string;
  subHeading?: string | null;
  logo: string;
  deliveryType: SubscriptionDeliveryType;
  instructions?: string | null;
  estimatedDelivery?: string | null;
  termsAndConditions?: string | null;
  isRenewable?: boolean;
  plans: SubscriptionPlan[];
  inputFields?: ProductInputField[];
}

export type AdminProduct = GiftCard | GameTopUp | Subscription;
export type GiftCardPayload = Omit<GiftCard, "id" | "productType" | "category" | "createdAt" | "updatedAt">;
export type GameTopUpPayload = Omit<GameTopUp, "id" | "productType" | "category" | "createdAt" | "updatedAt">;
export type SubscriptionPayload = Omit<Subscription, "id" | "productType" | "category" | "createdAt" | "updatedAt">;
export type AdminProductPayload = GiftCardPayload | GameTopUpPayload | SubscriptionPayload;

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  type?: ProductResourceType;
}

export interface PaginatedProducts {
  meta: { total: number; page: number; limit: number; totalPages: number };
  data: AdminProduct[];
}

function withQuery(path: string, query?: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function apiData<T>(
  path: string,
  init: RequestInit | undefined,
  fallback: string,
) {
  const response = await fetchApiJson<ApiDataPayload<T>>(
    apiUrl(path),
    init,
    fallback,
  );

  return response.data;
}

function normalizeApiList<T>(payload: unknown): T[] {
  const candidates = [
    payload,
    (payload as { data?: unknown })?.data,
    (payload as { data?: { data?: unknown } })?.data?.data,
    (payload as { data?: { data?: { data?: unknown } } })?.data?.data?.data,
    (payload as { products?: unknown })?.products,
    (payload as { categories?: unknown })?.categories,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as T[];
    }
  }

  return [];
}

function jsonInit(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export async function getAdminProfile() {
  const profile = await apiData<AdminProfile>(
    "/api/admins/profile",
    undefined,
    "Could not load admin profile.",
  );

  if (!profile?.id) {
    throw new Error("Admin profile data was missing.");
  }

  return profile;
}

export async function updateAdminProfile(payload: {
  name?: string;
  phone?: string | null;
}) {
  return apiData<AdminProfile>(
    "/api/admins/profile",
    jsonInit("PATCH", payload),
    "Could not update admin profile.",
  );
}

export async function changeAdminPassword(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  await apiData<unknown>(
    "/api/admins/profile/password",
    jsonInit("PATCH", payload),
    "Could not change password.",
  );
}

export async function createAdmin(payload: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  currentPassword: string;
}) {
  return apiData<AdminProfile>(
    "/api/admins",
    jsonInit("POST", payload),
    "Could not create admin.",
  );
}

export async function getAdmins(includeInactive?: boolean) {
  return (
    (await apiData<AdminProfile[]>(
      withQuery("/api/admins", {
        includeInactive: includeInactive ? "true" : undefined,
      }),
      undefined,
      "Could not load admins.",
    )) ?? []
  );
}

export async function getAdminById(adminId: string) {
  return apiData<AdminProfile>(
    `/api/admins/${adminId}`,
    undefined,
    "Could not load admin details.",
  );
}

export async function updateAdminById(
  adminId: string,
  payload: { name?: string; phone?: string | null; currentPassword: string },
) {
  return apiData<AdminProfile>(
    `/api/admins/${adminId}`,
    jsonInit("PATCH", payload),
    "Could not update admin.",
  );
}

export async function deactivateAdmin(
  adminId: string,
  currentPassword: string,
) {
  return apiData<AdminProfile>(
    `/api/admins/${adminId}/deactivate`,
    jsonInit("PATCH", { currentPassword }),
    "Could not deactivate admin.",
  );
}

export async function restoreAdmin(adminId: string, currentPassword: string) {
  return apiData<AdminProfile>(
    `/api/admins/${adminId}/restore`,
    jsonInit("PATCH", { currentPassword }),
    "Could not restore admin.",
  );
}

export async function getUsers(query?: {
  role?: UserRole;
  status?: "active" | "inactive" | "all";
  search?: string;
}) {
  return (
    (await apiData<ManagedUser[]>(
      withQuery("/api/admins/users", query),
      undefined,
      "Could not load users.",
    )) ?? []
  );
}

export async function getUserById(userId: string) {
  return apiData<ManagedUser>(
    `/api/admins/users/${userId}`,
    undefined,
    "Could not load user details.",
  );
}

export async function updateUserStatus(
  userId: string,
  payload: { isDeleted: boolean; reason: string },
) {
  return apiData<ManagedUser>(
    `/api/admins/users/${userId}/status`,
    jsonInit("PATCH", payload),
    "Could not update user status.",
  );
}

export async function resolveUserIssue(userId: string, note: string) {
  await apiData<unknown>(
    `/api/admins/users/${userId}/resolve-issue`,
    jsonInit("POST", { note }),
    "Could not resolve user issue.",
  );
}

export async function getOrders(query?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  userId?: string;
  search?: string;
}) {
  return (
    (await apiData<AdminOrder[]>(
      withQuery("/api/admins/orders", query),
      undefined,
      "Could not load orders.",
    )) ?? []
  );
}

export async function getOrderById(orderId: string) {
  return apiData<AdminOrder>(
    `/api/admins/orders/${orderId}`,
    undefined,
    "Could not load order details.",
  );
}

export async function updateOrderStatus(
  orderId: string,
  payload: { status: OrderStatus; notes?: string },
) {
  return apiData<AdminOrder>(
    `/api/admins/orders/${orderId}/status`,
    jsonInit("PATCH", payload),
    "Could not update order status.",
  );
}

export async function getDeliveryItems(query?: {
  deliveryStatus?: DeliveryStatus;
}) {
  return (
    (await apiData<AdminOrderItem[]>(
      withQuery("/api/admins/delivery/items", query),
      undefined,
      "Could not load delivery items.",
    )) ?? []
  );
}

export async function updateDeliveryStatus(
  orderItemId: string,
  payload: {
    deliveryStatus: DeliveryStatus;
    fulfillmentReference?: string | null;
  },
) {
  return apiData<AdminOrderItem>(
    `/api/admins/delivery/items/${orderItemId}`,
    jsonInit("PATCH", payload),
    "Could not update delivery status.",
  );
}

export async function getPayments(query?: { paymentStatus?: PaymentStatus }) {
  return (
    (await apiData<AdminPayment[]>(
      withQuery("/api/admins/payments", query),
      undefined,
      "Could not load payments.",
    )) ?? []
  );
}

export async function getPaymentById(paymentId: string) {
  return apiData<AdminPayment>(
    `/api/admins/payments/${paymentId}`,
    undefined,
    "Could not load payment details.",
  );
}

export async function verifyPayment(
  paymentId: string,
  payload: {
    paymentStatus: PaymentStatus;
    transactionId?: string | null;
    providerPaymentId?: string | null;
    failureReason?: string | null;
  },
) {
  return apiData<AdminPayment>(
    `/api/admins/payments/${paymentId}/verify`,
    jsonInit("PATCH", payload),
    "Could not verify payment.",
  );
}

export async function getDigitalProducts(query?: {
  type?: Exclude<ProductType, "PHYSICAL">;
  isActive?: "true" | "false";
  search?: string;
}) {
  return (
    (await apiData<DigitalProduct[]>(
      withQuery("/api/admins/digital-products", query),
      undefined,
      "Could not load digital products.",
    )) ?? []
  );
}

export async function getDigitalProductOverview() {
  return apiData<DigitalProductOverview>(
    "/api/admins/digital-products/overview",
    undefined,
    "Could not load digital product overview.",
  );
}

export async function getApplicationLogs(query?: { limit?: number; level?: string }) {
  return (
    (await apiData<ApplicationLog[]>(
      withQuery("/api/admins/logs", query),
      undefined,
      "Could not load application logs.",
    )) ?? []
  );
}

export async function getProducts(query?: ProductListQuery): Promise<PaginatedProducts> {
  const response = await fetchApiJson<unknown>(
    apiUrl(withQuery("/products", query ? { ...query } : undefined)),
    undefined,
    "Could not load products.",
  );
  const payload = (response as { data?: PaginatedProducts }).data;
  if (payload?.meta && Array.isArray(payload.data)) return payload;
  const data = normalizeApiList<AdminProduct>(response);
  return { meta: { total: data.length, page: 1, limit: data.length || 10, totalPages: 1 }, data };
}

const resourcePath: Record<ProductResourceType, string> = {
  GIFT_CARD: "/gift-cards",
  GAME_TOP_UP: "/top-ups",
  SUBSCRIPTION: "/subscriptions",
};

export async function getProductById(idOrSlug: string, type: ProductResourceType) {
  return apiData<AdminProduct>(`${resourcePath[type]}/${idOrSlug}`, undefined, "Could not load product.");
}

export type ProductUploadFiles = { image?: File; bannerImage?: File };

function productFormData(type: ProductResourceType, payload: Partial<AdminProductPayload>, files: ProductUploadFiles) {
  if (type === "GAME_TOP_UP" && files.image) {
    throw new Error("The backend does not currently map generic thumbnail uploads to a game top-up logo. Provide a hosted logo URL instead.");
  }
  const body = new FormData();
  body.append("type", type);
  const detailKey = type === "GIFT_CARD" ? "giftCard" : type === "GAME_TOP_UP" ? "gameTopUp" : "subscription";
  const detail = { ...payload } as Record<string, unknown>;
  if (files.bannerImage) delete detail.bannerImage;
  body.append(detailKey, JSON.stringify(detail));
  if (files.image) body.append("thumbnail", files.image);
  if (files.bannerImage) body.append("bannerImage", files.bannerImage);
  return { method: "POST", body } satisfies RequestInit;
}

export async function createProduct(type: ProductResourceType, payload: AdminProductPayload, files: ProductUploadFiles = {}) {
  return apiData<AdminProduct>("/products", productFormData(type, payload, files), "Could not create product.");
}

export async function updateProduct(
  type: ProductResourceType,
  productId: string,
  payload: Partial<AdminProductPayload>,
  files: ProductUploadFiles = {},
) {
  const request = productFormData(type, payload, files);
  request.method = "PATCH";
  return apiData<AdminProduct>(`/products/${productId}`, request, "Could not update product.");
}

export async function deleteProduct(_type: ProductResourceType, productId: string) {
  await apiData<unknown>(`/products/${productId}`, { method: "DELETE" }, "Could not archive product.");
}

export async function getCategories() {
  const response = await fetchApiJson<unknown>(
    apiUrl("/api/categories?includeInactive=true"),
    undefined,
    "Could not load categories.",
  );

  return normalizeApiList<AdminCategory>(response);
}

export type CategoryMutationPayload = Pick<AdminCategory, "title"> &
  Partial<Pick<AdminCategory, "slug" | "description" | "isActive">> &
  { sortOrder?: number };

export async function createCategory(payload: CategoryMutationPayload) {
  return apiData<AdminCategory>(
    "/api/categories",
    jsonInit("POST", payload),
    "Could not create category.",
  );
}

export async function updateCategory(
  categoryId: string,
  payload: CategoryMutationPayload,
) {
  return apiData<AdminCategory>(
    `/api/categories/${categoryId}`,
    jsonInit("PATCH", payload),
    "Could not update category.",
  );
}

export async function deleteCategory(categoryId: string) {
  await apiData<unknown>(
    `/api/categories/${categoryId}`,
    { method: "DELETE" },
    "Could not delete category.",
  );
}

export async function getSalesStats(query?: { from?: string; to?: string }) {
  return apiData<SalesStats>(
    withQuery("/api/admins/stats/sales", query),
    undefined,
    "Could not load sales stats.",
  );
}

export async function getAuditLogs() {
  return (
    (await apiData<AuditLog[]>(
      "/api/admins/audit-logs",
      undefined,
      "Could not load audit logs.",
    )) ?? []
  );
}

export function isAdminProfile(user: AuthUser | AdminProfile | null) {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}
