import { ApiError } from "@/lib/api";

const PENDING_VERIFICATION_EMAIL_KEY = "ontor:pending-verification-email";

export function maskEmail(email: string): string {
  const [localPart, domain] = email.trim().split("@");
  if (!localPart || !domain) return "your email address";
  return `${localPart.charAt(0)}***@${domain}`;
}

export function rememberPendingVerificationEmail(email: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email.trim().toLowerCase());
}

export function readPendingVerificationEmail(): string {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) ?? "";
}

export function forgetPendingVerificationEmail(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
}

export function verificationErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "We could not verify your email. Please try again.";
  if (error.code === "INVALID_OR_EXPIRED_VERIFICATION_CODE") {
    return "That verification code is invalid or expired. Request a new code and try again.";
  }
  if (error.code === "EMAIL_ALREADY_VERIFIED" || error.status === 409) {
    return "This email address is already verified.";
  }
  if (error.status === 429) return "Too many verification attempts. Please wait before trying again.";
  if (error.status === 0) return "We could not reach the server. Check your connection and try again.";
  return "We could not verify your email right now. Please try again later.";
}

export function resendVerificationErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 429) {
    return "Too many resend attempts. Please wait before requesting another email.";
  }
  if (error instanceof ApiError && error.status === 0) {
    return "We could not reach the server. Check your connection and try again.";
  }
  return "We could not request another verification email right now. Please try again later.";
}

export function passwordResetErrorMessage(error: unknown, stage: "request" | "reset"): string {
  if (error instanceof ApiError && error.status === 429) {
    return "Too many attempts. Please wait before trying again.";
  }
  if (error instanceof ApiError && error.status === 0) {
    return "We could not reach the server. Check your connection and try again.";
  }
  if (stage === "reset" && error instanceof ApiError && error.status === 400) {
    return "That reset code is invalid or expired. Request a new code and try again.";
  }
  return stage === "request"
    ? "We could not request a password reset right now. Please try again later."
    : "We could not reset your password right now. Please try again later.";
}

export function registrationErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 409) {
    return "An account already exists for this email address. Try signing in instead.";
  }
  if (error instanceof ApiError && error.status === 429) {
    return "Too many signup attempts. Please wait before trying again.";
  }
  if (error instanceof ApiError && error.status === 0) {
    return "We could not reach the server. Check your connection and try again.";
  }
  if (error instanceof ApiError && error.details.length) return error.details[0].message;
  return "We could not create your account right now. Please try again later.";
}

export function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) return "The email or password is incorrect.";
  if (error instanceof ApiError && error.status === 429) return "Too many login attempts. Please wait before trying again.";
  if (error instanceof ApiError && error.status === 0) return "We could not reach the server. Check your connection and try again.";
  if (error instanceof ApiError && error.details.length) return error.details[0].message;
  return "We could not sign you in right now. Please try again later.";
}
