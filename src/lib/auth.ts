import { ApiError, getApiErrorMessage } from "./api";
import { adminService } from "@/services/api/admin.service";
import { customerService } from "@/services/api/customer.service";
import type { User } from "@/types/api";

export type AuthUser = User;

export const loginCustomer = customerService.login;
export const loginUser = customerService.login;
export const registerCustomer = customerService.register;
export const verifyCustomerEmail = customerService.verifyEmail;
export const resendCustomerVerification = customerService.resendVerification;
export const getCustomerProfile = customerService.profile;
export const updateCustomerProfile = customerService.updateProfile;
export const deleteCustomerProfile = customerService.deleteProfile;
export const logoutCustomer = customerService.logout;
export const forgotPassword = customerService.forgotPassword;
export const resetPassword = customerService.resetPassword;

export async function getSessionProfile(): Promise<AuthUser> {
  try {
    return await customerService.profile({ restore: true });
  } catch (customerError) {
    try {
      return await adminService.profile({ restore: true });
    } catch (adminError) {
      if (customerError instanceof ApiError && customerError.status !== 401 && customerError.status !== 403) {
        throw customerError;
      }
      throw adminError;
    }
  }
}

export function getAuthErrorMessage(payload: unknown, fallback: string) {
  return getApiErrorMessage(payload, fallback);
}
