import { afterEach, describe, expect, it, vi } from "vitest";
import { giftCardService } from "./gift-card.service";

describe("giftCardService", () => {
  afterEach(() => vi.unstubAllGlobals());

  function mockApi(data: unknown = {}) {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ success: true, message: "ok", data }), { status: 200, headers: { "content-type": "application/json" } })));
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
  }

  it("sends denomination money as decimal strings to the dedicated endpoint", async () => {
    const fetchMock = mockApi({ id: "d1" });
    await giftCardService.createDenomination("g1", { faceValue: "10.00", faceCurrency: "USD", sellingPriceBdt: "1280.00", isPopular: true, isActive: true, sortOrder: 0 });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url.endsWith("/admin/gift-cards/g1/denominations")).toBe(true);
    expect(JSON.parse(String(init.body))).toMatchObject({ faceValue: "10.00", sellingPriceBdt: "1280.00" });
    expect(init.credentials).toBe("include");
  });

  it("uses the exact instant-buy and cart contracts", async () => {
    const fetchMock = mockApi({ id: "o1" });
    await giftCardService.instantBuy({ denominationId: "d1", quantity: 1, useAccountEmail: false, deliveryEmail: "customer@example.com" });
    await giftCardService.addCartItem("d1", 1);
    await giftCardService.checkout({ useAccountEmail: true });
    const calls = fetchMock.mock.calls as Array<[string, RequestInit]>;
    expect(calls[0][0].endsWith("/gift-cards/instant-buy")).toBe(true);
    expect(JSON.parse(String(calls[0][1].body))).toEqual({ denominationId: "d1", quantity: 1, useAccountEmail: false, deliveryEmail: "customer@example.com" });
    expect(calls[1][0].endsWith("/cart/items")).toBe(true);
    expect(JSON.parse(String(calls[1][1].body))).toEqual({ denominationId: "d1", quantity: 1 });
    expect(calls[2][0].endsWith("/cart/checkout")).toBe(true);
    expect(JSON.parse(String(calls[2][1].body))).toEqual({ useAccountEmail: true });
  });

  it("uses dedicated product create, update, and archive endpoints", async () => {
    const fetchMock = mockApi({ id: "g1" });
    const product = { name: "Amazon", slug: "amazon", brand: "Amazon", currency: "USD", isActive: true, isFeatured: false, sortOrder: 0 };
    await giftCardService.createProduct(product);
    await giftCardService.updateProduct("g1", { isFeatured: true });
    await giftCardService.archiveProduct("g1");
    const calls = fetchMock.mock.calls as Array<[string, RequestInit]>;
    expect(calls.map(([url]) => new URL(url).pathname)).toEqual(["/api/v1/admin/gift-cards", "/api/v1/admin/gift-cards/g1", "/api/v1/admin/gift-cards/g1"]);
    expect(calls.map(([, init]) => init.method)).toEqual(["POST", "PATCH", "DELETE"]);
  });

  it("sends single and bulk inventory without storing a browser draft", async () => {
    const fetchMock = mockApi({ inserted: 2 });
    await giftCardService.addCode("d1", { code: "DEMO-001", pin: null, expiryDate: "2027-12-31" });
    await giftCardService.addCodes("d1", [{ code: "DEMO-002", pin: null }, { code: "DEMO-003", pin: "1234" }]);
    const calls = fetchMock.mock.calls as Array<[string, RequestInit]>;
    expect(calls[0][0].endsWith("/admin/gift-card-denominations/d1/codes")).toBe(true);
    expect(calls[1][0].endsWith("/admin/gift-card-denominations/d1/codes/bulk")).toBe(true);
    expect(JSON.parse(String(calls[1][1].body)).codes).toHaveLength(2);
  });

  it("forwards inventory and admin-order filters", async () => {
    const fetchMock = mockApi({ data: [], meta: { page: 2, limit: 20, total: 0, totalPages: 1 } });
    await giftCardService.codes("d1", { page: 2, status: "AVAILABLE", expiryBefore: "2028-01-01" });
    await giftCardService.inventorySummary();
    await giftCardService.adminOrders({ page: 2, email: "owner@example.com", paymentStatus: "PENDING", from: "2026-08-01", to: "2026-08-15" });
    const urls = fetchMock.mock.calls.map(call => new URL(String(call[0])));
    expect(urls[0].searchParams.get("status")).toBe("AVAILABLE");
    expect(urls[0].searchParams.get("expiryBefore")).toBe("2028-01-01");
    expect(urls[1].pathname.endsWith("/admin/gift-card-inventory/summary")).toBe(true);
    expect(urls[2].searchParams.get("email")).toBe("owner@example.com");
    expect(urls[2].searchParams.get("paymentStatus")).toBe("PENDING");
  });

  it("translates the admin active filter to the server status contract", async () => {
    const fetchMock = mockApi({ data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 1 } });
    await giftCardService.adminProducts({ isActive: false });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("status")).toBe("INACTIVE");
    expect(url.searchParams.has("isActive")).toBe(false);
  });
});
