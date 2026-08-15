import { describe, expect, it } from "vitest";
import { giftCardCodeTransitions, parseBulkGiftCardCodes } from "./GiftCardInventoryManager";

describe("gift-card inventory rules", () => {
  it("parses structured pasted rows and reports masked duplicates", () => {
    const result = parseBulkGiftCardCodes("DEMO-001,1234,2027-12-31\nDEMO-002,,2028-01-01\nDEMO-001,,");
    expect(result.rows).toHaveLength(3);
    expect(result.detected).toBe(3);
    expect(result.invalid).toBe(0);
    expect(result.rows[0]).toEqual({ code: "DEMO-001", pin: "1234", expiryDate: "2027-12-31" });
    expect(result.duplicates).toHaveLength(1);
    expect(result.duplicates[0]).not.toBe("DEMO-001");
  });

  it("rejects invalid rows before submission", () => {
    const result = parseBulkGiftCardCodes("OK-CODE,,2028-01-01\nX,,not-a-date");
    expect(result.detected).toBe(2);
    expect(result.rows).toHaveLength(1);
    expect(result.invalid).toBe(1);
  });

  it("does not offer mutations for sold codes", () => {
    expect(giftCardCodeTransitions.SOLD).toEqual([]);
    expect(giftCardCodeTransitions.RESERVED).toEqual(["AVAILABLE"]);
  });
});
