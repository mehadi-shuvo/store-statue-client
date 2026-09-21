import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { AuthUser } from "@/lib/auth";
import MobileMenu from "./MobileMenu";

const customer: AuthUser = {
  id: "customer-1",
  name: "A Customer With A Deliberately Long Name",
  email: "customer@example.com",
  phone: null,
  role: "CUSTOMER",
};

describe("MobileMenu", () => {
  it("shows focused service and guest actions without disabled features", () => {
    const onClose = vi.fn();
    const onDismiss = vi.fn();

    render(
      <MobileMenu
        open
        pathname="/gift-cards/steam"
        user={null}
        authLoading={false}
        onClose={onClose}
        onDismiss={onDismiss}
        onLogout={vi.fn()}
      />,
    );

    expect(screen.getByRole("link", { name: /gift cards/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /game top-up/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create account/i })).toBeInTheDocument();
    expect(screen.queryByText("Wishlist")).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("shows supported customer account actions and logs out", async () => {
    const onClose = vi.fn();
    const onLogout = vi.fn().mockResolvedValue(undefined);

    render(
      <MobileMenu
        open
        pathname="/profile"
        user={customer}
        authLoading={false}
        onClose={onClose}
        onDismiss={vi.fn()}
        onLogout={onLogout}
      />,
    );

    expect(screen.getByRole("link", { name: /my profile/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /gift card orders/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
    await waitFor(() => expect(onLogout).toHaveBeenCalledOnce());
    expect(onClose).toHaveBeenCalledOnce();
  });
});
