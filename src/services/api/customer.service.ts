import { apiData, apiRequest } from "@/lib/api";
import type {
  AddCartItemInput,
  Cart,
  CartItem,
  CartItemIdentity,
  CreatePaymentResult,
  DigitalProductType,
  Payment,
  RegisteredUser,
  Review,
  UpdateCartItemInput,
  User,
} from "@/types/api";

export interface LoginInput { email: string; password: string }
export interface RegisterInput { email: string; name: string; phone?: string; password: string }
export interface ResetPasswordInput { email: string; otp: string; newPassword: string }
export interface VerifyEmailInput { email: string; otp: string }
export interface VerifyEmailResult { isEmailVerified: true }
export interface ResendVerificationResult { cooldownSeconds: number }

export const customerService = {
  async login(input: LoginInput) {
    const result = await apiData<{ user: User }>("/user/login", {
      method: "POST",
      body: input,
      handleUnauthorized: false,
    });
    return result.user;
  },

  register(input: RegisterInput) {
    return apiData<RegisteredUser>("/user/register", { method: "POST", body: input });
  },

  verifyEmail(input: VerifyEmailInput) {
    return apiData<VerifyEmailResult>("/user/verify-email", {
      method: "POST",
      body: input,
      handleUnauthorized: false,
    });
  },

  resendVerification(email: string) {
    return apiData<ResendVerificationResult>("/user/resend-verification", {
      method: "POST",
      body: { email },
      handleUnauthorized: false,
    });
  },

  async logout() {
    await apiRequest<never>("/user/logout", { method: "POST", handleUnauthorized: false });
  },

  profile(options?: { restore?: boolean }) {
    return apiData<User>("/user/profile", {
      handleUnauthorized: options?.restore ? false : true,
    });
  },

  updateProfile(input: { name?: string; phone?: string | null }) {
    return apiData<User>("/user/profile", { method: "PATCH", body: input });
  },

  async deleteProfile(password: string) {
    await apiRequest<never>("/user/profile", {
      method: "DELETE",
      body: { password },
    });
  },

  async forgotPassword(email: string) {
    return apiRequest<never>("/user/forgot-password", {
      method: "POST",
      body: { email },
      handleUnauthorized: false,
    });
  },

  async resetPassword(input: ResetPasswordInput) {
    return apiRequest<never>("/user/reset-password", {
      method: "POST",
      body: input,
      handleUnauthorized: false,
    });
  },

  cart() {
    return apiData<Cart>("/user-cart");
  },

  addCartItem(input: AddCartItemInput) {
    return apiData<CartItem>("/user-cart/add", { method: "POST", body: input });
  },

  updateCartItem(input: UpdateCartItemInput) {
    return apiData<CartItem>("/user-cart/update", { method: "PATCH", body: input });
  },

  removeCartItem(input: CartItemIdentity) {
    return apiData<CartItem>("/user-cart/remove", { method: "DELETE", body: input });
  },

  async clearCart() {
    await apiRequest<{ message: string }>("/user-cart/clear", { method: "DELETE" });
  },

  createReview(input: {
    productId: string;
    productType: DigitalProductType;
    rating: number;
    comment?: string;
  }) {
    return apiData<Review>("/review", { method: "POST", body: input });
  },

  updateReview(reviewId: string, input: { rating?: number; comment?: string }) {
    return apiData<Review>(`/review/${encodeURIComponent(reviewId)}`, {
      method: "PATCH",
      body: input,
    });
  },

  async deleteReview(reviewId: string) {
    await apiRequest<never>(`/review/${encodeURIComponent(reviewId)}`, { method: "DELETE" });
  },

  createPayment(input: { orderId: string }) {
    return apiData<CreatePaymentResult>("/payments/aamarpay/initiate", { method: "POST", body: input });
  },

  paymentStatus(paymentId: string) {
    return apiData<Payment>(`/payments/status/${encodeURIComponent(paymentId)}`);
  },
};
