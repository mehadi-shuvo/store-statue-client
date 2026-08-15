"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customerService, type LoginInput, type RegisterInput, type ResetPasswordInput } from "@/services/api/customer.service";
import type { AddCartItemInput, CartItemIdentity, DigitalProductType, MockPaymentScenario, UpdateCartItemInput } from "@/types/api";
import { apiKeys } from "./query-keys";

export function useCustomerProfile(enabled = true) {
  return useQuery({ queryKey: apiKeys.profile, queryFn: () => customerService.profile(), enabled, retry: false });
}

export function useLogin() { return useMutation({ mutationFn: (input: LoginInput) => customerService.login(input) }); }
export function useRegister() { return useMutation({ mutationFn: (input: RegisterInput) => customerService.register(input) }); }
export function useForgotPassword() { return useMutation({ mutationFn: (email: string) => customerService.forgotPassword(email) }); }
export function useResetPassword() { return useMutation({ mutationFn: (input: ResetPasswordInput) => customerService.resetPassword(input) }); }

export function useUpdateCustomerProfile() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; phone?: string | null }) => customerService.updateProfile(input),
    onSuccess: () => client.invalidateQueries({ queryKey: apiKeys.profile }),
  });
}

export function useDeleteCustomerProfile() {
  const client = useQueryClient();
  return useMutation({ mutationFn: customerService.deleteProfile, onSuccess: () => client.clear() });
}

export function useCartQuery(enabled = true) {
  return useQuery({ queryKey: apiKeys.cart, queryFn: customerService.cart, enabled });
}

function useCartMutation<T>(mutationFn: (input: T) => Promise<unknown>) {
  const client = useQueryClient();
  return useMutation({ mutationFn, onSuccess: () => client.invalidateQueries({ queryKey: apiKeys.cart }) });
}

export function useAddCartItem() { return useCartMutation<AddCartItemInput>(customerService.addCartItem); }
export function useUpdateCartItem() { return useCartMutation<UpdateCartItemInput>(customerService.updateCartItem); }
export function useRemoveCartItem() { return useCartMutation<CartItemIdentity>(customerService.removeCartItem); }

export function useClearCart() {
  const client = useQueryClient();
  return useMutation({ mutationFn: customerService.clearCart, onSuccess: () => client.invalidateQueries({ queryKey: apiKeys.cart }) });
}

export function useCreateReview() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { productId: string; productType: DigitalProductType; rating: number; comment?: string }) => customerService.createReview(input),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: apiKeys.reviews(input.productId) }),
  });
}

export function useUpdateReview(productId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, input }: { reviewId: string; input: { rating?: number; comment?: string } }) => customerService.updateReview(reviewId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: apiKeys.reviews(productId) }),
  });
}

export function useDeleteReview(productId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: customerService.deleteReview,
    onSuccess: () => client.invalidateQueries({ queryKey: apiKeys.reviews(productId) }),
  });
}

export function useCreatePayment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: customerService.createPayment,
    onSuccess: (payment) => client.invalidateQueries({ queryKey: apiKeys.payment(payment.paymentId) }),
  });
}

export function useExecutePayment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, scenario }: { paymentId: string; scenario?: MockPaymentScenario }) => customerService.executePayment(paymentId, scenario),
    onSuccess: (_, input) => client.invalidateQueries({ queryKey: apiKeys.payment(input.paymentId) }),
  });
}

export function usePaymentStatus(paymentId: string) {
  return useQuery({ queryKey: apiKeys.payment(paymentId), queryFn: () => customerService.paymentStatus(paymentId), enabled: Boolean(paymentId) });
}
