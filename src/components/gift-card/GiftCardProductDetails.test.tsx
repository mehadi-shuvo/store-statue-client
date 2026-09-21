import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GiftCardProductDetails from "./GiftCardProductDetails";

const mocks = vi.hoisted(() => ({
  add: vi.fn(),
  checkout: vi.fn(),
  push: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  refetch: vi.fn(),
  user: { id: "u1", email: "owner@example.com", role: "CUSTOMER" } as { id: string; email: string; role: string } | null,
}));
vi.mock("next/image", () => ({ default: (props: { alt: string }) => <span role="img" aria-label={props.alt} /> }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ user: mocks.user, loading: false }) }));
vi.mock("@/context/ToastContext", () => ({ useToast: () => ({ success: mocks.success, error: mocks.error, warning: mocks.warning }) }));
vi.mock("@/hooks/api/use-gift-card-api", () => ({
  useGiftCardDetail: () => ({ isLoading: false, isError: false, refetch: mocks.refetch, data: { id: "g1", name: "Amazon Gift Card", title: "Amazon Gift Card", slug: "amazon", brand: "Amazon", currency: "USD", denominations: [{ id: "sold", faceValue: "5.00", faceCurrency: "USD", sellingPriceBdt: "500.00", inStock: false, isPopular: false }, { id: "d1", faceValue: "10.00", faceCurrency: "USD", sellingPriceBdt: "1280.00", inStock: true, isPopular: true }, { id: "d2", faceValue: "25.00", faceCurrency: "USD", sellingPriceBdt: "2500.00", inStock: true, isPopular: false }] } }),
  useAddGiftCardToCart: () => ({ isPending: false, mutateAsync: mocks.add }),
  useBuyNowCheckout: () => ({ isPending: false, mutateAsync: mocks.checkout }),
}));

describe("GiftCardProductDetails", () => {
  beforeEach(() => {
    mocks.user = { id: "u1", email: "owner@example.com", role: "CUSTOMER" };
    mocks.add.mockReset().mockResolvedValue({});
    mocks.checkout.mockReset();
    mocks.push.mockReset();
    mocks.success.mockReset();
  });
  it("disables unavailable denominations and updates the BDT display", async () => {
    render(<GiftCardProductDetails slug="amazon" />);
    expect(screen.getByRole("button", { name: /\$5\.00/ })).toBeDisabled();
    await waitFor(() => expect(screen.getByRole("button", { name: /\$10\.00/ })).toHaveAttribute("aria-pressed", "true"));
    fireEvent.click(screen.getByRole("button", { name: /\$25\.00/ }));
    expect(screen.getAllByText("৳2,500.00").length).toBeGreaterThan(1);
    fireEvent.click(screen.getByRole("button", { name: "Add to cart" }));
    await waitFor(() => expect(mocks.add).toHaveBeenCalledWith({ denominationId: "d2", quantity: 1 }));
  });

  it("allows only one active Buy Now checkout", async () => {
    mocks.checkout.mockReturnValue(new Promise(() => undefined));
    render(<GiftCardProductDetails slug="amazon" />);
    const button = await screen.findByRole("button", { name: "Buy now" });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mocks.checkout).toHaveBeenCalledTimes(1);
    expect(mocks.checkout).toHaveBeenCalledWith({
      productId: "d1",
      idempotencyKey: expect.any(String),
    });
  });

  it("sends logged-out customers to login with only a safe internal intent", async () => {
    mocks.user = null;
    render(<GiftCardProductDetails slug="amazon" />);
    fireEvent.click(await screen.findByRole("button", { name: "Buy now" }));
    expect(mocks.checkout).not.toHaveBeenCalled();
    expect(mocks.push).toHaveBeenCalledWith(
      "/login?returnTo=%2Fgift-cards%2Famazon%3Fbuy%3Dd1%23buy-now",
    );
  });
});
