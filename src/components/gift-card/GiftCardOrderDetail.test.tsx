import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GiftCardOrderDetail from "./GiftCardOrderDetail";

const mocks = vi.hoisted(() => ({ writeText: vi.fn() }));
vi.mock("@/components/RouteGuard", () => ({ RouteGuard: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("@/hooks/api/use-gift-card-api", () => ({ useGiftCardOrder: () => ({ isLoading: false, isError: false, data: { id: "o1", orderNumber: "GC-1", deliveryEmail: "owner@example.com", totalBdt: "1280.00", status: "COMPLETED", paymentStatus: "PENDING", createdAt: "2026-08-15T00:00:00.000Z", items: [{ id: "i1", giftCardName: "Amazon Gift Card", brand: "Amazon", faceValue: "10.00", currency: "USD", quantity: 1, deliveryStatus: "DELIVERED", deliveries: [{ code: "DEMO-AMAZON-001", pin: "1234", expiryDate: null }] }] } }) }));

describe("GiftCardOrderDetail", () => {
  beforeEach(() => {
    mocks.writeText.mockReset();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: mocks.writeText.mockResolvedValue(undefined) } });
  });

  it("hides codes until reveal and copies without rendering the secret in feedback", async () => {
    render(<GiftCardOrderDetail orderId="o1" />);
    expect(screen.queryByText("DEMO-AMAZON-001")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reveal" }));
    expect(screen.getByText("DEMO-AMAZON-001")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
    expect(mocks.writeText).toHaveBeenCalledWith("DEMO-AMAZON-001");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("never claims a pending payment was successful", () => {
    render(<GiftCardOrderDetail orderId="o1" />);
    expect(screen.getByText(/Payment pending/)).toBeInTheDocument();
    expect(screen.queryByText(/Payment successful/i)).not.toBeInTheDocument();
  });
});
