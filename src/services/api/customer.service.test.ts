import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api";
import { customerService } from "./customer.service";

describe("customerService authentication contracts", () => {
  afterEach(() => vi.unstubAllGlobals());

  function mockApi(data: unknown, status = 200, headers?: Record<string, string>) {
    const fetchMock = vi.fn().mockResolvedValue(new Response(
      JSON.stringify(status < 400
        ? { success: true, message: "ok", data }
        : data),
      { status, headers: { "content-type": "application/json", ...headers } },
    ));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("uses the exact email verification and resend endpoints", async () => {
    const fetchMock = mockApi({ isEmailVerified: true });
    await customerService.verifyEmail({ email: "member@example.com", otp: "123456" });
    const resendFetchMock = mockApi({ cooldownSeconds: 75 });
    await customerService.resendVerification("member@example.com");

    const [verifyUrl, verifyInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URL(verifyUrl).pathname).toBe("/api/v1/user/verify-email");
    expect(verifyInit.method).toBe("POST");
    expect(JSON.parse(String(verifyInit.body))).toEqual({ email: "member@example.com", otp: "123456" });
    const [resendUrl, resendInit] = resendFetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URL(resendUrl).pathname).toBe("/api/v1/user/resend-verification");
    expect(JSON.parse(String(resendInit.body))).toEqual({ email: "member@example.com" });
  });

  it("preserves backend error codes and retry timing", async () => {
    mockApi(
      { success: false, statusCode: 429, code: "RATE_LIMITED", message: "backend text" },
      429,
      { "retry-after": "42" },
    );
    const error = await customerService.resendVerification("member@example.com").catch(value => value);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 429, code: "RATE_LIMITED", retryAfterSeconds: 42 });
  });

  it("keeps the password reset request and reset payload compatible", async () => {
    const fetchMock = mockApi(null);
    await customerService.forgotPassword("member@example.com");
    await customerService.resetPassword({ email: "member@example.com", otp: "654321", newPassword: "New!Password1" });
    const calls = fetchMock.mock.calls as Array<[string, RequestInit]>;
    expect(new URL(calls[0][0]).pathname).toBe("/api/v1/user/forgot-password");
    expect(new URL(calls[1][0]).pathname).toBe("/api/v1/user/reset-password");
    expect(JSON.parse(String(calls[1][1].body))).toEqual({ email: "member@example.com", otp: "654321", newPassword: "New!Password1" });
  });
});
