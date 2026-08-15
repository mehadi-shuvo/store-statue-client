import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api";
import { compareDecimalStrings, formatMoney, formatMoneyCode, getGiftCardErrorMessage, isValidDecimalString, lowestAvailableDenomination, maskSecret } from "@/lib/gift-card";

describe("gift-card utilities", () => {
  it("compares decimal strings without floating-point arithmetic", () => {
    expect(compareDecimalStrings("1280.00", "99.99")).toBeGreaterThan(0);
    expect(compareDecimalStrings("10.0", "10.00")).toBe(0);
  });

  it("finds the lowest active stocked denomination and formats BDT", () => {
    const lowest = lowestAvailableDenomination([
      { id: "high", faceValue: "25.00", faceCurrency: "USD", sellingPriceBdt: "2500.00", inStock: true, isPopular: false },
      { id: "sold", faceValue: "5.00", faceCurrency: "USD", sellingPriceBdt: "500.00", inStock: false, isPopular: false },
      { id: "low", faceValue: "10.00", faceCurrency: "USD", sellingPriceBdt: "1280.00", inStock: true, isPopular: true },
    ]);
    expect(lowest?.id).toBe("low");
    expect(formatMoney(lowest?.sellingPriceBdt, "BDT")).toBe("৳1,280.00");
    expect(formatMoneyCode("20.00", "USD")).toBe("USD 20.00");
    expect(formatMoney(undefined, "USD")).toBe("—");
    expect(formatMoney("not-a-number", "BDT")).toBe("—");
    expect(formatMoneyCode("50.00", "USD")).toBe("USD 50.00");
    expect(formatMoney("9999.00", "BDT")).toBe("৳9,999.00");
    expect(isValidDecimalString("0")).toBe(false);
    expect(isValidDecimalString("0.01")).toBe(true);
  });

  it("maps backend business codes and masks secrets", () => {
    const error = new ApiError({ status: 409, message: "Conflict", payload: { code: "GIFT_CARD_OUT_OF_STOCK" } });
    expect(getGiftCardErrorMessage(error)).toContain("out of stock");
    expect(maskSecret("DEMO-AMAZON-001")).not.toContain("AMAZON");
  });
});
