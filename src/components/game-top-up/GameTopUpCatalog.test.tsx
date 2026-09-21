import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_GAME_TOP_UPS } from "@/data/demo-game-top-ups";
import GameTopUpCatalog from "./GameTopUpCatalog";
import GameTopUpDetails from "./GameTopUpDetails";

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <span role="img" aria-label={props.alt} />,
}));

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  createOrder: vi.fn(),
  initiatePayment: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  user: { id: "u1", role: "CUSTOMER" } as { id: string; role: string } | null,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ user: mocks.user, loading: false }) }));
vi.mock("@/context/ToastContext", () => ({ useToast: () => ({ error: mocks.error, warning: mocks.warning }) }));
vi.mock("@/hooks/api/use-game-top-up-api", () => ({ useCreateTopUpOrder: () => ({ isPending: false, mutateAsync: mocks.createOrder }) }));
vi.mock("@/hooks/api/use-customer-api", () => ({ useCreatePayment: () => ({ isPending: false, mutateAsync: mocks.initiatePayment }) }));

describe("Game Top-Up customer flow", () => {
  beforeEach(() => {
    mocks.user = { id: "u1", role: "CUSTOMER" };
    mocks.push.mockReset();
    mocks.createOrder.mockReset().mockResolvedValue({ orderId: "order-1" });
    mocks.initiatePayment.mockReset().mockReturnValue(new Promise(() => undefined));
  });
  it("renders compact linked game cards and filters the demo catalog", () => {
    render(<GameTopUpCatalog games={DEMO_GAME_TOP_UPS} />);

    expect(screen.getByRole("link", { name: /genshin impact/i })).toHaveAttribute("href", "/top-up/genshin-impact");
    expect(screen.getByRole("link", { name: /free fire/i })).toHaveAttribute("href", "/top-up/free-fire");

    fireEvent.change(screen.getByRole("searchbox", { name: /search games/i }), { target: { value: "PUBG" } });
    expect(screen.getByRole("heading", { name: "PUBG Mobile" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Free Fire" })).not.toBeInTheDocument();
  });

  it("creates an order from configured fields, then initiates backend payment", async () => {
    render(<GameTopUpDetails game={DEMO_GAME_TOP_UPS[0]} />);

    fireEvent.click(screen.getByRole("button", { name: /^60 crystals/i }));
    expect(screen.getByText("60 Crystals", { selector: "p" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /^player id/i }), { target: { value: "812345678" } });
    fireEvent.change(screen.getByRole("combobox", { name: /^server/i }), { target: { value: "asia" } });
    fireEvent.click(screen.getByRole("button", { name: /proceed to payment/i }));

    await waitFor(() => expect(mocks.createOrder).toHaveBeenCalledWith({
      gameId: DEMO_GAME_TOP_UPS[0].id,
      packageId: DEMO_GAME_TOP_UPS[0].packages[0].id,
      accountDetails: { playerId: "812345678", server: "asia" },
    }));
    expect(mocks.initiatePayment).toHaveBeenCalledWith({ orderId: "order-1" });
  });

  it("preserves the selected package when authentication is required", () => {
    mocks.user = null;
    render(<GameTopUpDetails game={DEMO_GAME_TOP_UPS[0]} />);
    fireEvent.click(screen.getByRole("button", { name: /^60 crystals/i }));
    fireEvent.change(screen.getByRole("textbox", { name: /^player id/i }), { target: { value: "812345678" } });
    fireEvent.change(screen.getByRole("combobox", { name: /^server/i }), { target: { value: "asia" } });
    fireEvent.click(screen.getByRole("button", { name: /proceed to payment/i }));
    expect(mocks.createOrder).not.toHaveBeenCalled();
    expect(mocks.push).toHaveBeenCalledWith(expect.stringContaining("/login?returnTo=%2Ftop-up%2Fgenshin-impact%3Fpackage%3D"));
  });
});
