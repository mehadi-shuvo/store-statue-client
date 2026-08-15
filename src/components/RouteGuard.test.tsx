import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RouteGuard } from "./RouteGuard";

const mocks = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => "/admin/gift-cards", useRouter: () => ({ replace: mocks.replace }) }));
vi.mock("@/context/AuthContext", () => ({ useAuth: () => ({ user: { id: "u1", name: "Customer", email: "c@example.com", phone: null, role: "CUSTOMER" }, loading: false }) }));

describe("RouteGuard", () => {
  beforeEach(() => mocks.replace.mockClear());
  it("denies a non-admin role", () => {
    render(<RouteGuard roles={["ADMIN", "SUPER_ADMIN"]}><div>secret admin page</div></RouteGuard>);
    expect(screen.getByText("Permission denied")).toBeInTheDocument();
    expect(screen.queryByText("secret admin page")).not.toBeInTheDocument();
  });
});
