import { describe, expect, it } from "vitest";
import { isPaymentPending, paymentPresentation } from "./commerce-status";

describe("commerce payment states", () => {
  it("treats unknown as pending and warns against another payment", () => {
    expect(isPaymentPending("UNKNOWN")).toBe(true);
    expect(paymentPresentation("UNKNOWN").message).toMatch(/don't pay again/i);
  });
  it("presents refund states without raw enum labels", () => {
    expect(paymentPresentation("REFUND_PENDING").label).toBe("Refund processing");
    expect(paymentPresentation("REFUNDED").title).toBe("Payment refunded");
  });
});
