import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GiftCardProduct } from "@/types/gift-card";
import type { GameTopUp } from "@/types/game-top-up";
import FeaturedGiftCards, { prioritizeGiftCards } from "./FeaturedGiftCards";
import FeaturedTopUps, { prioritizeGames } from "./FeaturedTopUps";
import FaqSection from "./FaqSection";
import ServiceSelector from "./ServiceSelector";

const { giftCatalogQuery, gameCatalogQuery } = vi.hoisted(() => ({
  giftCatalogQuery: vi.fn(),
  gameCatalogQuery: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <span role="img" aria-label={props.alt} />,
}));
vi.mock("@/hooks/api/use-gift-card-api", () => ({
  useGiftCardCatalog: giftCatalogQuery,
}));
vi.mock("@/hooks/api/use-game-top-up-api", () => ({
  usePublicGames: gameCatalogQuery,
}));

const gift = (id: string, isFeatured: boolean, sortOrder: number) => ({
  id,
  name: id,
  title: id,
  slug: id,
  brand: "Brand",
  currency: "USD",
  denominations: [],
  isFeatured,
  sortOrder,
}) as GiftCardProduct;

const game = (id: string, isFeatured: boolean, sortOrder: number, isActive = true) => ({
  id,
  name: id,
  title: id,
  slug: id,
  logoUrl: "",
  gameCurrencyName: "Coins",
  fulfillmentType: "PLAYER_ID",
  status: "ACTIVE",
  isActive,
  isFeatured,
  sortOrder,
  packages: [],
  accountFields: [],
}) as GameTopUp;

describe("homepage featured catalogs", () => {
  beforeEach(() => {
    giftCatalogQuery.mockReset();
    gameCatalogQuery.mockReset();
  });

  it("prioritizes featured records and limits each collection to four", () => {
    expect(prioritizeGiftCards([
      gift("regular", false, 0),
      gift("featured-late", true, 4),
      gift("featured-first", true, 1),
      gift("another", false, 2),
      gift("last", false, 3),
    ]).map((item) => item.id)).toEqual([
      "featured-first",
      "featured-late",
      "regular",
      "another",
    ]);

    expect(prioritizeGames([
      game("inactive", true, 0, false),
      game("regular", false, 0),
      game("featured", true, 2),
    ]).map((item) => item.id)).toEqual(["featured", "regular"]);
  });

  it("keeps the working catalog visible when the other API fails", () => {
    giftCatalogQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: new Error("Gift catalog unavailable"),
      refetch: vi.fn(),
    });
    gameCatalogQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: [game("Arena Quest", true, 0)], meta: { page: 1, limit: 6, total: 1, totalPages: 1 } },
    });

    render(<><FeaturedGiftCards /><FeaturedTopUps /></>);

    expect(screen.getByRole("alert")).toHaveTextContent("Gift catalog unavailable");
    expect(screen.getByRole("heading", { name: "Arena Quest" })).toBeInTheDocument();
  });

  it("removes a disabled service and its service-specific FAQ", () => {
    render(
      <>
        <ServiceSelector giftCardsEnabled gameTopUpEnabled={false} />
        <FaqSection giftCardsEnabled gameTopUpEnabled={false} />
      </>,
    );

    expect(screen.getByRole("link", { name: /explore gift cards/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /top up now/i })).not.toBeInTheDocument();
    expect(screen.queryByText("How can I follow a Game Top-Up?")).not.toBeInTheDocument();
  });
});
