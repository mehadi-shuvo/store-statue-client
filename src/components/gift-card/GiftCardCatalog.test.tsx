import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GiftCardCatalog from "./GiftCardCatalog";

vi.mock("next/image", () => ({ default: (props: { alt: string }) => <span role="img" aria-label={props.alt} /> }));
vi.mock("@/hooks/api/use-gift-card-api", () => ({ useGiftCardCatalog: () => ({ isLoading: false, isError: false, data: { data: [{ id: "g1", name: "Amazon Gift Card", title: "Amazon Gift Card", slug: "amazon", brand: "Amazon", currency: "USD", denominations: [{ id: "d2", faceValue: "25.00", faceCurrency: "USD", sellingPriceBdt: "2500.00", inStock: true, isPopular: false }, { id: "d1", faceValue: "10.00", faceCurrency: "USD", sellingPriceBdt: "1280.00", inStock: true, isPopular: true }] }, { id: "g2", name: "Sold Out Card", title: "Sold Out Card", slug: "sold", brand: "Demo", currency: "USD", denominations: [{ id: "d3", faceValue: "5.00", faceCurrency: "USD", sellingPriceBdt: "500.00", inStock: false, isPopular: false }] }], meta: { page: 1, limit: 20, total: 2, totalPages: 1 } } }) }));

describe("GiftCardCatalog", () => {
  it("renders products, the lowest stocked price, and an all-out-of-stock state", () => {
    render(<GiftCardCatalog />);
    expect(screen.getByText("Amazon Gift Card")).toBeInTheDocument();
    expect(screen.getByText("৳1,280.00")).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
    expect(screen.queryByText("DEMO-AMAZON-001")).not.toBeInTheDocument();
  });
});
