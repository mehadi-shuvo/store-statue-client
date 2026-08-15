import { describe, expect, it, vi } from "vitest";
import {
  mapGiftCardDenomination,
  mapGiftCardInventorySummary,
  mapGiftCardProduct,
} from "./gift-card.mapper";

describe("gift-card API mappers", () => {
  it("maps the admin Prisma denomination contract and enum stock keys", () => {
    const result = mapGiftCardDenomination({
      id: "d20",
      giftCardProductId: "g1",
      cardValue: "20.00",
      cardCurrency: "USD",
      sellingPriceBDT: "3000.00",
      isActive: true,
      isPopular: true,
      sortOrder: 8,
      stock: { AVAILABLE: 34, RESERVED: 3, SOLD: 18, DISABLED: 1, EXPIRED: 0 },
    });
    expect(result).toMatchObject({
      id: "d20",
      giftCardId: "g1",
      faceValue: "20.00",
      faceCurrency: "USD",
      sellingPriceBdt: "3000.00",
      isPopular: true,
      inStock: true,
      stock: { available: 34, reserved: 3, sold: 18, disabled: 1, expired: 0, total: 56 },
    });
  });

  it("normalizes the amount/currency/bdtPrice response variant centrally", () => {
    expect(mapGiftCardDenomination({ id: "d5", giftCardId: "g1", amount: "5.00", currency: "USD", bdtPrice: "500.00" })).toMatchObject({
      faceValue: "5.00",
      faceCurrency: "USD",
      sellingPriceBdt: "500.00",
    });
  });

  it("maps admin product fields and global inventory summary fields", () => {
    const product = mapGiftCardProduct({ id: "g1", title: "Amazon Gift Card", image: "/amazon.png", cardCurrency: "USD", status: "ACTIVE", denominations: [] });
    expect(product).toMatchObject({ name: "Amazon Gift Card", imageUrl: "/amazon.png", currency: "USD", isActive: true });
    const summary = mapGiftCardInventorySummary({ totalProducts: 1, totalCodes: 56, availableCodes: 34, reservedCodes: 3, soldCodes: 18, disabledCodes: 1, expiredCodes: 0, lowStockDenominations: [] });
    expect(summary).toMatchObject({ total: 56, available: 34, reserved: 3, sold: 18, disabled: 1, expired: 0 });
  });

  it("returns empty display values and reports field names without response values", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(mapGiftCardDenomination({ id: "d-broken" })).toMatchObject({ faceValue: "", faceCurrency: "", sellingPriceBdt: "" });
    if (process.env.NODE_ENV !== "production") expect(error).toHaveBeenCalledOnce();
    error.mockRestore();
  });
});
