import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";
import {
  forgetPendingVerificationEmail,
  maskEmail,
  readPendingVerificationEmail,
  rememberPendingVerificationEmail,
  verificationErrorMessage,
} from "./auth-flow";

describe("authentication flow helpers", () => {
  it("masks the local part of an email address", () => {
    expect(maskEmail("member@example.com")).toBe("m***@example.com");
    expect(maskEmail("not-an-email")).toBe("your email address");
  });

  it("keeps only the pending email in session storage", () => {
    rememberPendingVerificationEmail(" Member@Example.com ");
    expect(readPendingVerificationEmail()).toBe("member@example.com");
    forgetPendingVerificationEmail();
    expect(readPendingVerificationEmail()).toBe("");
  });

  it("maps the backend verification code to safe copy", () => {
    const error = new ApiError({
      message: "backend message",
      status: 400,
      code: "INVALID_OR_EXPIRED_VERIFICATION_CODE",
    });
    expect(verificationErrorMessage(error)).toMatch(/invalid or expired/i);
    expect(verificationErrorMessage(error)).not.toContain("backend message");
  });
});
