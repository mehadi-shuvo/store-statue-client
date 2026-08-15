import { apiData, apiRequest, queryString } from "@/lib/api";
import type {
  ApplicationLog,
  AuditLog,
  Category,
  CategoryInput,
  DeliveryStatus,
  DigitalProduct,
  DigitalProductOverview,
  DigitalProductType,
  GameTopUpFulfillmentType,
  GameTopUpProduct,
  GiftCardDeliveryType,
  GiftCardProduct,
  GiftCardRegion,
  JsonValue,
  LogLevel,
  ManagedUser,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  PaymentStatus,
  ProductInputType,
  ProductStatus,
  SalesStatistics,
  SubscriptionBillingCycle,
  SubscriptionDeliveryType,
  SubscriptionProduct,
  User,
  UserRole,
} from "@/types/api";

export interface OptionInputBase {
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

export interface GiftCardDenominationInput extends OptionInputBase {
  cardValue: number;
  cardCurrency?: string;
}

export interface GameTopUpPackageInput extends OptionInputBase {
  gameCurrencyAmount: number;
  bonusCurrencyAmount?: number;
}

export interface ProductInputFieldInput {
  name: string;
  label: string;
  type?: ProductInputType;
  placeholder?: string;
  helpText?: string;
  isRequired?: boolean;
  options?: Array<{ label: string; value: string }>;
  validationRules?: JsonValue;
  isActive?: boolean;
  sortOrder?: number;
}

export interface SubscriptionPlanInput extends OptionInputBase {
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

interface ProductInputBase {
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  status?: ProductStatus;
  isFeatured?: boolean;
  sortOrder?: number;
  categoryId?: string;
}

export interface GiftCardInput extends ProductInputBase {
  brand: string;
  image?: string;
  cardCurrency?: string;
  region?: GiftCardRegion;
  deliveryType?: GiftCardDeliveryType;
  instructions?: string;
  termsAndConditions?: string;
  denominations: GiftCardDenominationInput[];
}

export interface GameTopUpInput extends ProductInputBase {
  name: string;
  subHeading?: string;
  logo?: string;
  gameCurrencyName: string;
  fulfillmentType: GameTopUpFulfillmentType;
  instructions?: string;
  estimatedDelivery?: string;
  termsAndConditions?: string;
  packages: GameTopUpPackageInput[];
  inputFields?: ProductInputFieldInput[];
}

export interface SubscriptionInput extends ProductInputBase {
  platformName: string;
  subHeading?: string;
  logo?: string;
  deliveryType: SubscriptionDeliveryType;
  instructions?: string;
  estimatedDelivery?: string;
  termsAndConditions?: string;
  isRenewable?: boolean;
  plans: SubscriptionPlanInput[];
  inputFields?: ProductInputFieldInput[];
}

export type ProductMutation =
  | { type: "GIFT_CARD"; product: GiftCardInput }
  | { type: "GAME_TOP_UP"; product: GameTopUpInput }
  | { type: "SUBSCRIPTION"; product: SubscriptionInput };

export interface ProductFiles {
  thumbnail?: File;
  bannerImage?: File;
}

function productFormData(mutation: ProductMutation, files: ProductFiles = {}) {
  if (mutation.type === "GAME_TOP_UP" && files.thumbnail) {
    throw new Error("The backend does not currently map generic thumbnail uploads to a game top-up logo. Provide a hosted logo URL instead.");
  }
  const form = new FormData();
  form.append("type", mutation.type);
  const detailKey = mutation.type === "GIFT_CARD"
    ? "giftCard"
    : mutation.type === "GAME_TOP_UP"
      ? "gameTopUp"
      : "subscription";
  const detail = { ...mutation.product };
  if (files.bannerImage) delete detail.bannerImage;
  form.append(detailKey, JSON.stringify(detail));
  if (files.thumbnail) form.append("thumbnail", files.thumbnail);
  if (files.bannerImage) form.append("bannerImage", files.bannerImage);
  return form;
}

function directResource(type: DigitalProductType) {
  return type === "GIFT_CARD"
    ? "/gift-cards"
    : type === "GAME_TOP_UP"
      ? "/top-ups"
      : "/subscriptions";
}

export const adminService = {
  profile(options?: { restore?: boolean }) {
    return apiData<User>("/admins/profile", {
      handleUnauthorized: options?.restore ? false : true,
    });
  },

  updateProfile(input: { name?: string; phone?: string | null }) {
    return apiData<User>("/admins/profile", { method: "PATCH", body: input });
  },

  async changePassword(input: { currentPassword: string; newPassword: string }) {
    await apiRequest<never>("/admins/profile/password", { method: "PATCH", body: input });
  },

  users(query?: { role?: UserRole; status?: "active" | "inactive" | "all"; search?: string }) {
    return apiData<ManagedUser[]>(`/admins/users${queryString(query)}`);
  },

  user(userId: string) {
    return apiData<ManagedUser>(`/admins/users/${encodeURIComponent(userId)}`);
  },

  updateUserStatus(userId: string, input: { isDeleted: boolean; reason: string }) {
    return apiData<ManagedUser>(`/admins/users/${encodeURIComponent(userId)}/status`, {
      method: "PATCH",
      body: input,
    });
  },

  async resolveUserIssue(userId: string, note: string) {
    await apiRequest<never>(`/admins/users/${encodeURIComponent(userId)}/resolve-issue`, {
      method: "POST",
      body: { note },
    });
  },

  orders(query?: { status?: OrderStatus; paymentStatus?: PaymentStatus; userId?: string; search?: string }) {
    return apiData<Order[]>(`/admins/orders${queryString(query)}`);
  },

  order(orderId: string) {
    return apiData<Order>(`/admins/orders/${encodeURIComponent(orderId)}`);
  },

  updateOrderStatus(orderId: string, input: { status: OrderStatus; notes?: string }) {
    return apiData<Order>(`/admins/orders/${encodeURIComponent(orderId)}/status`, {
      method: "PATCH",
      body: input,
    });
  },

  deliveryItems(deliveryStatus?: DeliveryStatus) {
    return apiData<OrderItem[]>(`/admins/delivery/items${queryString({ deliveryStatus })}`);
  },

  updateDeliveryStatus(orderItemId: string, input: { deliveryStatus: DeliveryStatus; fulfillmentReference?: string | null }) {
    return apiData<OrderItem>(`/admins/delivery/items/${encodeURIComponent(orderItemId)}`, {
      method: "PATCH",
      body: input,
    });
  },

  payments(paymentStatus?: PaymentStatus) {
    return apiData<Payment[]>(`/admins/payments${queryString({ paymentStatus })}`);
  },

  payment(paymentId: string) {
    return apiData<Payment>(`/admins/payments/${encodeURIComponent(paymentId)}`);
  },

  verifyPayment(paymentId: string, input: {
    paymentStatus: PaymentStatus;
    transactionId?: string | null;
    providerPaymentId?: string | null;
    failureReason?: string | null;
    rawResponse?: JsonValue;
  }) {
    return apiData<Payment>(`/admins/payments/${encodeURIComponent(paymentId)}/verify`, {
      method: "PATCH",
      body: input,
    });
  },

  digitalProducts(query?: { type?: DigitalProductType; isActive?: boolean; search?: string }) {
    return apiData<DigitalProduct[]>(`/admins/digital-products${queryString(query)}`);
  },

  digitalProductOverview() {
    return apiData<DigitalProductOverview>("/admins/digital-products/overview");
  },

  salesStatistics(query?: { from?: string; to?: string }) {
    return apiData<SalesStatistics>(`/admins/stats/sales${queryString(query)}`);
  },

  auditLogs() {
    return apiData<AuditLog[]>("/admins/audit-logs");
  },

  logs(query?: { limit?: number; level?: LogLevel }) {
    return apiData<ApplicationLog[]>(`/admins/logs${queryString(query)}`);
  },

  admins(includeInactive = false) {
    return apiData<User[]>(`/admins${queryString({ includeInactive: includeInactive || undefined })}`);
  },

  admin(adminId: string) {
    return apiData<User>(`/admins/${encodeURIComponent(adminId)}`);
  },

  createAdmin(input: { email: string; name: string; phone?: string; password: string; currentPassword: string }) {
    return apiData<User>("/admins", { method: "POST", body: input });
  },

  updateAdmin(adminId: string, input: { name?: string; phone?: string | null; currentPassword: string }) {
    return apiData<User>(`/admins/${encodeURIComponent(adminId)}`, { method: "PATCH", body: input });
  },

  deactivateAdmin(adminId: string, currentPassword: string) {
    return apiData<User>(`/admins/${encodeURIComponent(adminId)}/deactivate`, {
      method: "PATCH",
      body: { currentPassword },
    });
  },

  restoreAdmin(adminId: string, currentPassword: string) {
    return apiData<User>(`/admins/${encodeURIComponent(adminId)}/restore`, {
      method: "PATCH",
      body: { currentPassword },
    });
  },

  categories(includeInactive = true) {
    return apiData<Category[]>(`/categories${queryString({ includeInactive: includeInactive || undefined })}`);
  },

  createCategory(input: CategoryInput) {
    return apiData<Category>("/categories", { method: "POST", body: input });
  },

  bulkCreateCategories(categories: CategoryInput[]) {
    return apiData<Category[]>("/categories/bulk", { method: "POST", body: { categories } });
  },

  updateCategory(categoryId: string, input: Partial<CategoryInput>) {
    return apiData<Category>(`/categories/${encodeURIComponent(categoryId)}`, {
      method: "PATCH",
      body: input,
    });
  },

  async deleteCategory(categoryId: string) {
    await apiRequest<Category>(`/categories/${encodeURIComponent(categoryId)}`, { method: "DELETE" });
  },

  createProduct(mutation: ProductMutation, files?: ProductFiles) {
    return apiData<DigitalProduct>("/products", {
      method: "POST",
      body: productFormData(mutation, files),
    });
  },

  updateProduct(productId: string, mutation: ProductMutation, files?: ProductFiles) {
    return apiData<DigitalProduct>(`/products/${encodeURIComponent(productId)}`, {
      method: "PATCH",
      body: productFormData(mutation, files),
    });
  },

  async deleteProduct(productId: string) {
    await apiRequest<DigitalProduct>(`/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
  },

  bulkCreateProducts(products: ProductMutation[]) {
    const payload = products.map(({ type, product }) => ({ type, ...product }));
    return apiData<DigitalProduct[]>("/products/multiple", { method: "POST", body: { products: payload } });
  },

  createDirectProduct(mutation: ProductMutation) {
    return apiData<GiftCardProduct | GameTopUpProduct | SubscriptionProduct>(
      directResource(mutation.type),
      { method: "POST", body: mutation.product },
    );
  },

  updateDirectProduct(productId: string, mutation: ProductMutation) {
    return apiData<GiftCardProduct | GameTopUpProduct | SubscriptionProduct>(
      `${directResource(mutation.type)}/${encodeURIComponent(productId)}`,
      { method: "PATCH", body: mutation.product },
    );
  },

  async deleteDirectProduct(productId: string, type: DigitalProductType) {
    await apiRequest<never>(`${directResource(type)}/${encodeURIComponent(productId)}`, { method: "DELETE" });
  },
};
