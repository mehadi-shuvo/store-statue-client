import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GiftCardPaymentSuccess from "./GiftCardPaymentSuccess";

const mocks = vi.hoisted(() => ({
  copy: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  result: {} as Record<string, unknown>,
  orderResult: {} as Record<string, unknown>,
}));

vi.mock("@/context/ToastContext", () => ({
  useToast: () => ({ success: mocks.success, error: mocks.error }),
}));
vi.mock("@/hooks/api/use-gift-card-api", () => ({
  useGiftCardOrderDelivery: () => mocks.result,
  useGiftCardOrder: () => mocks.orderResult,
}));

const completed = {
  status: "COMPLETED",
  orderId: "order-1",
  orderNumber: "GX-1001",
  products: [{
    name: "Apple Gift Card",
    brand: "Apple",
    value: "5.00",
    currency: "USD",
    delivery: [{
      code: "APPLE-SECRET-ABCD",
      pin: "1234",
      expiryDate: null,
      emailStatus: "DELIVERED",
    }],
  }],
  payment: { provider: "AAMARPAY", trxId: "TRX-1001" },
};

describe("GiftCardPaymentSuccess", () => {
  beforeEach(() => {
    mocks.copy.mockReset().mockResolvedValue(undefined);
    mocks.success.mockReset();
    mocks.orderResult = { isLoading: false, data: { paymentStatus: "PAID", totalBdt: "650.00" }, refetch: vi.fn() };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: mocks.copy },
    });
  });

  it("keeps the code masked until reveal and reports actual email delivery", async () => {
    mocks.result = { isLoading: false, isFetching: false, data: completed, error: null, refetch: vi.fn() };
    render(<GiftCardPaymentSuccess orderId="order-1" />);
    expect(screen.queryByText("APPLE-SECRET-ABCD")).not.toBeInTheDocument();
    expect(screen.getByText(/A copy has been sent/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reveal gift card code" }));
    expect(screen.getByText("APPLE-SECRET-ABCD")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy gift card code" }));
    expect(mocks.copy).toHaveBeenCalledWith("APPLE-SECRET-ABCD");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("shows verification and no code while the backend reports processing", () => {
    mocks.orderResult = { isLoading: false, data: { paymentStatus: "PROCESSING", totalBdt: "650.00" }, refetch: vi.fn().mockResolvedValue({}) };
    mocks.result = {
      isLoading: false,
      isFetching: false,
      data: { status: "PROCESSING", orderId: "order-1" },
      error: null,
      refetch: vi.fn().mockResolvedValue({}),
    };
    render(<GiftCardPaymentSuccess orderId="order-1" />);
    expect(screen.getByText("Confirming your payment...")).toBeInTheDocument();
    expect(screen.queryByText("APPLE-SECRET-ABCD")).not.toBeInTheDocument();
  });
});
