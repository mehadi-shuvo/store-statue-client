import { describe, expect, it } from "vitest";
import {
  getCustomerNavigation,
  isCustomerCartAvailable,
  isCustomerNavigationActive,
  isGiftCardOrderHistoryAvailable,
} from "./customer-navigation";

describe("customer navigation", () => {
  it("exposes only the focused launch services", () => {
    expect(getCustomerNavigation().map((item) => item.href)).toEqual([
      "/",
      "/gift-cards",
      "/top-up",
    ]);
  });

  it("matches nested service routes without marking home active", () => {
    const [home, giftCards, topUp] = getCustomerNavigation();
    expect(isCustomerNavigationActive("/gift-cards/steam", giftCards)).toBe(true);
    expect(isCustomerNavigationActive("/top-up/mobile-legends", topUp)).toBe(true);
    expect(isCustomerNavigationActive("/gift-cards", home)).toBe(false);
  });

  it("keeps supported gift-card customer actions available", () => {
    expect(isCustomerCartAvailable()).toBe(true);
    expect(isGiftCardOrderHistoryAvailable()).toBe(true);
  });
});
