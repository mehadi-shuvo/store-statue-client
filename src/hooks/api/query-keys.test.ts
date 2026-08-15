import { describe, expect, it } from "vitest";
import { giftCardKeys, sensitiveGiftCardKey } from "./query-keys";

describe("gift-card query keys", () => {
  it("separates list filters and marks secret-bearing detail keys as sensitive", () => {
    expect(giftCardKeys.list({ page: 1 })).not.toEqual(giftCardKeys.list({ page: 2 }));
    expect(giftCardKeys.orderDetail("o1").slice(0, 2)).toEqual(sensitiveGiftCardKey);
    expect(giftCardKeys.adminOrderDetail("o1").slice(0, 2)).toEqual(sensitiveGiftCardKey);
    expect(giftCardKeys.codeDetail("c1").slice(0, 2)).toEqual(sensitiveGiftCardKey);
  });
});
