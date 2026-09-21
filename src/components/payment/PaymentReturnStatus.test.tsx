import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentReturnStatus from "./PaymentReturnStatus";

const mocks = vi.hoisted(() => ({ result: {} as Record<string, unknown> }));
vi.mock("@/hooks/api/use-payment-return", () => ({ usePaymentReturnOrder: () => mocks.result }));
vi.mock("@/components/payment/GiftCardPaymentSuccess", () => ({ default: () => <div>Verified gift card</div> }));

const order = {
  id: "order-1",
  orderNumber: "GT-1001",
  totalBdt: "120.00",
  amount: "120.00",
  currency: "BDT",
  paymentStatus: "PAID",
  fulfillmentStatus: "PROCESSING",
  game: { id: "game-1", title: "Free Fire", slug: "free-fire" },
  package: { id: "package-1", title: "100 Diamonds" },
  accountDetails: { playerId: "***5678" },
  createdAt: "2026-09-14T00:00:00.000Z",
  items: [],
};

describe("PaymentReturnStatus", () => {
  beforeEach(() => {
    mocks.result = { isLoading: false, isError: false, refetch: vi.fn(), data: { kind: "game-top-up", order } };
  });

  it("keeps paid top-ups in processing until backend fulfillment succeeds", () => {
    render(<PaymentReturnStatus orderId="order-1" />);
    expect(screen.getByRole("heading", { name: /payment confirmed.*top-up processing/i })).toBeInTheDocument();
    expect(screen.getByText(/do not submit another order/i)).toBeInTheDocument();
  });

  it("shows top-up success only for backend SUCCESS", () => {
    mocks.result = { ...mocks.result, data: { kind: "game-top-up", order: { ...order, fulfillmentStatus: "SUCCESS" } } };
    render(<PaymentReturnStatus orderId="order-1" />);
    expect(screen.getByRole("heading", { name: "Top-up completed" })).toBeInTheDocument();
  });

  it("distinguishes paid fulfillment failure from payment failure", () => {
    mocks.result = { ...mocks.result, data: { kind: "game-top-up", order: { ...order, fulfillmentStatus: "FAILED" } } };
    render(<PaymentReturnStatus orderId="order-1" />);
    expect(screen.getByRole("heading", { name: /payment confirmed.*top-up not completed/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Payment Failed" })).not.toBeInTheDocument();
  });
});
