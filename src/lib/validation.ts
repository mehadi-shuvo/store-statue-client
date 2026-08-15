import type { ApiFieldError } from "@/types/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s-]+$/;

export type ValidationResult =
  | { valid: true; errors: [] }
  | { valid: false; errors: ApiFieldError[] };

function result(errors: ApiFieldError[]): ValidationResult {
  return errors.length === 0
    ? { valid: true, errors: [] }
    : { valid: false, errors };
}

export function validateEmail(email: string): ApiFieldError[] {
  const value = email.trim();
  if (!EMAIL_PATTERN.test(value)) return [{ field: "email", message: "A valid email is required" }];
  if (value.length > 255) return [{ field: "email", message: "Email is too long" }];
  return [];
}

export function validateStrongPassword(password: string, field = "password"): ApiFieldError[] {
  const errors: ApiFieldError[] = [];
  if (password.length < 8) errors.push({ field, message: "Password must be at least 8 characters" });
  if (password.length > 128) errors.push({ field, message: "Password must be at most 128 characters" });
  if (!/[a-z]/.test(password)) errors.push({ field, message: "Password must contain a lowercase letter" });
  if (!/[A-Z]/.test(password)) errors.push({ field, message: "Password must contain an uppercase letter" });
  if (!/[0-9]/.test(password)) errors.push({ field, message: "Password must contain a number" });
  if (!/[^A-Za-z0-9]/.test(password)) errors.push({ field, message: "Password must contain a special character" });
  return errors;
}

export function validatePhone(phone: string | null | undefined): ApiFieldError[] {
  if (phone === undefined || phone === null) return [];
  const value = phone.trim();
  if (value.length < 6) return [{ field: "phone", message: "Phone number is too short" }];
  if (value.length > 20) return [{ field: "phone", message: "Phone number is too long" }];
  if (!PHONE_PATTERN.test(value)) return [{ field: "phone", message: "Phone number can only contain digits, spaces, hyphens, and an optional leading plus" }];
  return [];
}

export function validateRegistration(input: { email: string; name: string; phone?: string; password: string }): ValidationResult {
  const errors = [...validateEmail(input.email), ...validateStrongPassword(input.password), ...validatePhone(input.phone)];
  const name = input.name.trim();
  if (name.length < 2) errors.push({ field: "name", message: "Name is required" });
  if (name.length > 80) errors.push({ field: "name", message: "Name is too long" });
  return result(errors);
}

export function validateResetPassword(input: { email: string; otp: string; newPassword: string }): ValidationResult {
  const errors = [...validateEmail(input.email), ...validateStrongPassword(input.newPassword, "newPassword")];
  if (!/^\d{6}$/.test(input.otp.trim())) errors.push({ field: "otp", message: "OTP must be a 6-digit code" });
  return result(errors);
}

export function validateProfile(input: { name?: string; phone?: string | null }): ValidationResult {
  const errors = validatePhone(input.phone);
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (name.length < 2) errors.push({ field: "name", message: "Name is required" });
    if (name.length > 80) errors.push({ field: "name", message: "Name is too long" });
  }
  if (input.name === undefined && input.phone === undefined) {
    errors.push({ field: "", message: "At least one profile field is required" });
  }
  return result(errors);
}

export function validateReview(input: { rating?: number; comment?: string }, creating = false): ValidationResult {
  const errors: ApiFieldError[] = [];
  if (input.rating !== undefined && (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5)) {
    errors.push({ field: "rating", message: "Rating must be an integer between 1 and 5" });
  }
  if (creating && input.rating === undefined) errors.push({ field: "rating", message: "Rating is required" });
  if (!creating && input.rating === undefined && input.comment === undefined) {
    errors.push({ field: "", message: "At least one review field is required" });
  }
  return result(errors);
}

export function validateCreatePayment(input: { orderId: string; amount: number }): ValidationResult {
  const errors: ApiFieldError[] = [];
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.orderId)) {
    errors.push({ field: "orderId", message: "Invalid order id" });
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    errors.push({ field: "amount", message: "Amount must be greater than 0" });
  }
  return result(errors);
}

export function validateAdminReason(reason: string): ValidationResult {
  const value = reason.trim();
  const errors: ApiFieldError[] = [];
  if (value.length < 3) errors.push({ field: "reason", message: "Reason is required" });
  if (value.length > 500) errors.push({ field: "reason", message: "Reason is too long" });
  return result(errors);
}

// These checks mirror server UX constraints. The backend remains the security boundary.
