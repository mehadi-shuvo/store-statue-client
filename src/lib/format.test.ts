import { describe, expect, it } from "vitest";
import { formatBdt, formatDate, formatDateTime, formatMoney, formatMoneyCode } from "@/lib/format";

describe("shared presentation formatters", () => {
  it("formats supported and unknown currencies consistently", () => {
    expect(formatMoney("1250", "BDT")).toBe("৳1,250.00");
    expect(formatMoney(12.5, "usd")).toBe("$12.50");
    expect(formatMoneyCode(12.5, "usd")).toBe("USD 12.50");
    expect(formatMoney(12.5, "JPY")).toBe("JPY 12.50");
  });

  it("uses safe fallbacks for invalid values", () => {
    expect(formatMoney(null, "BDT")).toBe("—");
    expect(formatMoney("invalid", "BDT")).toBe("—");
    expect(formatMoney(10, " ")).toBe("—");
    expect(formatBdt("invalid")).toContain("0");
    expect(formatDateTime("invalid")).toBe("Not available");
    expect(formatDate(null, "—")).toBe("—");
  });
});
