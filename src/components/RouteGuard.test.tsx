import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RouteGuard } from "./RouteGuard";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  pathname: "/admin/gift-cards",
  user: { id: "u1", name: "Customer", email: "c@example.com", phone: null, role: "CUSTOMER" } as Record<string, unknown> | null,
}));
vi.mock("next/navigation", () => ({ usePathname: () => mocks.pathname, useRouter: () => ({ replace: mocks.replace }) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ user: mocks.user, loading: false }) }));

describe("RouteGuard", () => {
  beforeEach(() => {
    mocks.replace.mockClear();
    mocks.pathname = "/admin/gift-cards";
    mocks.user = { id: "u1", name: "Customer", email: "c@example.com", phone: null, role: "CUSTOMER" };
    window.history.replaceState({}, "", "/");
  });
  it("denies a non-admin role", () => {
    render(<RouteGuard roles={["ADMIN", "SUPER_ADMIN"]}><div>secret admin page</div></RouteGuard>);
    expect(screen.getByText("Permission denied")).toBeInTheDocument();
    expect(screen.queryByText("secret admin page")).not.toBeInTheDocument();
  });

  it("preserves the order query when a customer session expires", () => {
    mocks.pathname = "/payment/success";
    mocks.user = null;
    window.history.replaceState({}, "", "/payment/success?orderId=order-1");
    render(<RouteGuard roles={["CUSTOMER"]}><div>delivery</div></RouteGuard>);
    expect(mocks.replace).toHaveBeenCalledWith(
      "/login?returnTo=%2Fpayment%2Fsuccess%3ForderId%3Dorder-1",
    );
    expect(screen.queryByText("delivery")).not.toBeInTheDocument();
  });
});
