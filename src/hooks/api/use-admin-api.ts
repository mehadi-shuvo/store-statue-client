"use client";

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { adminService, type ProductFiles, type ProductMutation } from "@/services/api/admin.service";
import type { CategoryInput, DeliveryStatus, JsonValue, LogLevel, OrderStatus, PaymentStatus, UserRole } from "@/types/api";
import { apiKeys } from "./query-keys";

function useInvalidatingMutation<TInput, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
  keys: QueryKey[],
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all(keys.map((queryKey) => client.invalidateQueries({ queryKey })));
    },
  });
}

export function useAdminProfile(enabled = true) {
  return useQuery({ queryKey: [...apiKeys.admin, "profile"], queryFn: () => adminService.profile(), enabled, retry: false });
}

export function useUpdateAdminProfile() {
  return useInvalidatingMutation(adminService.updateProfile, [apiKeys.admin, apiKeys.profile]);
}

export function useChangeAdminPassword() {
  return useMutation({ mutationFn: adminService.changePassword });
}

export function useAdminUsers(query?: { role?: UserRole; status?: "active" | "inactive" | "all"; search?: string }) {
  return useQuery({ queryKey: [...apiKeys.adminUsers, query], queryFn: () => adminService.users(query) });
}

export function useAdminUser(userId: string) {
  return useQuery({ queryKey: [...apiKeys.adminUsers, userId], queryFn: () => adminService.user(userId), enabled: Boolean(userId) });
}

export function useUpdateUserStatus() {
  return useInvalidatingMutation(
    ({ userId, input }: { userId: string; input: { isDeleted: boolean; reason: string } }) => adminService.updateUserStatus(userId, input),
    [apiKeys.adminUsers, apiKeys.adminAuditLogs],
  );
}

export function useResolveUserIssue() {
  return useInvalidatingMutation(
    ({ userId, note }: { userId: string; note: string }) => adminService.resolveUserIssue(userId, note),
    [apiKeys.adminUsers, apiKeys.adminAuditLogs],
  );
}

export function useAdminOrders(query?: { status?: OrderStatus; paymentStatus?: PaymentStatus; userId?: string; search?: string }) {
  return useQuery({ queryKey: [...apiKeys.adminOrders, query], queryFn: () => adminService.orders(query) });
}

export function useAdminOrder(orderId: string) {
  return useQuery({ queryKey: [...apiKeys.adminOrders, orderId], queryFn: () => adminService.order(orderId), enabled: Boolean(orderId) });
}

export function useUpdateOrderStatus() {
  return useInvalidatingMutation(
    ({ orderId, input }: { orderId: string; input: { status: OrderStatus; notes?: string } }) => adminService.updateOrderStatus(orderId, input),
    [apiKeys.adminOrders, apiKeys.adminStats, apiKeys.adminAuditLogs],
  );
}

export function useDeliveryItems(deliveryStatus?: DeliveryStatus) {
  return useQuery({ queryKey: [...apiKeys.adminDelivery, deliveryStatus], queryFn: () => adminService.deliveryItems(deliveryStatus) });
}

export function useUpdateDeliveryStatus() {
  return useInvalidatingMutation(
    ({ orderItemId, input }: { orderItemId: string; input: { deliveryStatus: DeliveryStatus; fulfillmentReference?: string | null } }) => adminService.updateDeliveryStatus(orderItemId, input),
    [apiKeys.adminDelivery, apiKeys.adminOrders, apiKeys.adminAuditLogs],
  );
}

export function useAdminPayments(paymentStatus?: PaymentStatus) {
  return useQuery({ queryKey: [...apiKeys.adminPayments, paymentStatus], queryFn: () => adminService.payments(paymentStatus) });
}

export function useAdminPayment(paymentId: string) {
  return useQuery({ queryKey: [...apiKeys.adminPayments, paymentId], queryFn: () => adminService.payment(paymentId), enabled: Boolean(paymentId) });
}

export function useVerifyPayment() {
  return useInvalidatingMutation(
    ({ paymentId, input }: { paymentId: string; input: { paymentStatus: PaymentStatus; transactionId?: string | null; providerPaymentId?: string | null; failureReason?: string | null; rawResponse?: JsonValue } }) => adminService.verifyPayment(paymentId, input),
    [apiKeys.adminPayments, apiKeys.adminOrders, apiKeys.adminStats, apiKeys.adminAuditLogs],
  );
}

export function useAdminDigitalProducts(query?: { type?: "GIFT_CARD" | "GAME_TOP_UP" | "SUBSCRIPTION"; isActive?: boolean; search?: string }) {
  return useQuery({ queryKey: [...apiKeys.adminProducts, query], queryFn: () => adminService.digitalProducts(query) });
}

export function useDigitalProductOverview() {
  return useQuery({ queryKey: [...apiKeys.adminProducts, "overview"], queryFn: adminService.digitalProductOverview });
}

export function useSalesStatistics(query?: { from?: string; to?: string }) {
  return useQuery({ queryKey: [...apiKeys.adminStats, query], queryFn: () => adminService.salesStatistics(query) });
}

export function useAuditLogs() {
  return useQuery({ queryKey: apiKeys.adminAuditLogs, queryFn: adminService.auditLogs });
}

export function useApplicationLogs(query?: { limit?: number; level?: LogLevel }) {
  return useQuery({ queryKey: [...apiKeys.adminLogs, query], queryFn: () => adminService.logs(query) });
}

export function useAdminAccounts(includeInactive = false) {
  return useQuery({ queryKey: [...apiKeys.adminAccounts, includeInactive], queryFn: () => adminService.admins(includeInactive) });
}

export function useAdminAccount(adminId: string) {
  return useQuery({ queryKey: [...apiKeys.adminAccounts, adminId], queryFn: () => adminService.admin(adminId), enabled: Boolean(adminId) });
}

export function useCreateAdmin() {
  return useInvalidatingMutation(adminService.createAdmin, [apiKeys.adminAccounts, apiKeys.adminAuditLogs]);
}

export function useUpdateAdminAccount() {
  return useInvalidatingMutation(
    ({ adminId, input }: { adminId: string; input: { name?: string; phone?: string | null; currentPassword: string } }) => adminService.updateAdmin(adminId, input),
    [apiKeys.adminAccounts, apiKeys.adminAuditLogs],
  );
}

export function useDeactivateAdmin() {
  return useInvalidatingMutation(
    ({ adminId, currentPassword }: { adminId: string; currentPassword: string }) => adminService.deactivateAdmin(adminId, currentPassword),
    [apiKeys.adminAccounts, apiKeys.adminAuditLogs],
  );
}

export function useRestoreAdmin() {
  return useInvalidatingMutation(
    ({ adminId, currentPassword }: { adminId: string; currentPassword: string }) => adminService.restoreAdmin(adminId, currentPassword),
    [apiKeys.adminAccounts, apiKeys.adminAuditLogs],
  );
}

export function useAdminCategories(includeInactive = true) {
  return useQuery({ queryKey: [...apiKeys.adminCategories, includeInactive], queryFn: () => adminService.categories(includeInactive) });
}

export function useCreateCategory() {
  return useInvalidatingMutation(adminService.createCategory, [apiKeys.adminCategories, apiKeys.categories]);
}

export function useBulkCreateCategories() {
  return useInvalidatingMutation((categories: CategoryInput[]) => adminService.bulkCreateCategories(categories), [apiKeys.adminCategories, apiKeys.categories]);
}

export function useUpdateCategory() {
  return useInvalidatingMutation(
    ({ categoryId, input }: { categoryId: string; input: Partial<CategoryInput> }) => adminService.updateCategory(categoryId, input),
    [apiKeys.adminCategories, apiKeys.categories, apiKeys.adminProducts],
  );
}

export function useDeleteCategory() {
  return useInvalidatingMutation(adminService.deleteCategory, [apiKeys.adminCategories, apiKeys.categories, apiKeys.adminProducts]);
}

export function useCreateProduct() {
  return useInvalidatingMutation(
    ({ mutation, files }: { mutation: ProductMutation; files?: ProductFiles }) => adminService.createProduct(mutation, files),
    [apiKeys.adminProducts, apiKeys.products, apiKeys.adminStats],
  );
}

export function useUpdateProduct() {
  return useInvalidatingMutation(
    ({ productId, mutation, files }: { productId: string; mutation: ProductMutation; files?: ProductFiles }) => adminService.updateProduct(productId, mutation, files),
    [apiKeys.adminProducts, apiKeys.products, apiKeys.adminStats],
  );
}

export function useDeleteProduct() {
  return useInvalidatingMutation(adminService.deleteProduct, [apiKeys.adminProducts, apiKeys.products, apiKeys.adminStats]);
}
