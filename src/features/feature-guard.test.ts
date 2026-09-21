import { describe, expect, it } from "vitest";
import { getDisabledPublicFeature } from "./feature-guard";

describe("public feature route guard", () => {
  it.each([
    ["/products", "generalProducts"],
    ["/product/product-1", "generalProducts"],
    ["/categories/controllers", "generalProducts"],
    ["/accessories", "accessories"],
    ["/decoration/lighting", "decoration"],
    ["/subscriptions", "subscriptions"],
    ["/wishlist/", "wishlist"],
    ["/checkout", "generalCheckout"],
  ])("blocks %s as %s", (pathname, feature) => {
    expect(getDisabledPublicFeature(pathname)).toBe(feature);
  });

  it.each([
    "/",
    "/gift-cards",
    "/gift-cards/amazon",
    "/top-up",
    "/cart",
    "/profile/gift-card-orders/order-1",
    "/payment/success",
    "/admin/products",
  ])("allows %s", (pathname) => {
    expect(getDisabledPublicFeature(pathname)).toBeNull();
  });

  it("does not confuse similarly prefixed routes", () => {
    expect(getDisabledPublicFeature("/productivity")).toBeNull();
    expect(getDisabledPublicFeature("/checkout-status")).toBeNull();
  });
});
