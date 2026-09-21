import { describe, expect, it } from "vitest";
import { getSafeReturnPath, withReturnTo } from "./safe-return-path";

describe("getSafeReturnPath", () => {
  it("preserves internal paths, query strings, and fragments", () => {
    expect(getSafeReturnPath("/gift-cards/apple-5-usd?checkout=ready#buy-now"))
      .toBe("/gift-cards/apple-5-usd?checkout=ready#buy-now");
  });

  it.each([
    "https://evil.example/steal",
    "//evil.example/steal",
    "/\\evil.example/steal",
    "javascript:alert(1)",
    "gift-cards/apple",
  ])("rejects unsafe return target %s", (target) => {
    expect(getSafeReturnPath(target, "/gift-cards")).toBe("/gift-cards");
  });

  it("encodes a safe return target for another auth route", () => {
    expect(withReturnTo("/signup", "/gift-cards/apple?checkout=ready"))
      .toBe("/signup?returnTo=%2Fgift-cards%2Fapple%3Fcheckout%3Dready");
  });
});
