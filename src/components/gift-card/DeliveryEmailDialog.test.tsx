import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DeliveryEmailDialog from "./DeliveryEmailDialog";

describe("DeliveryEmailDialog", () => {
  it("submits the account-email choice without exposing the address in a URL", () => {
    const submit = vi.fn();
    render(<DeliveryEmailDialog open accountEmail="account@example.com" onClose={() => {}} onSubmit={submit} />);
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(submit).toHaveBeenCalledWith({ useAccountEmail: true });
  });

  it("requires and validates a custom email", () => {
    const submit = vi.fn();
    render(<DeliveryEmailDialog open accountEmail="account@example.com" onClose={() => {}} onSubmit={submit} />);
    fireEvent.click(screen.getByLabelText("Use another email"));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("alert")).toHaveTextContent("valid email");
    fireEvent.change(screen.getByPlaceholderText("customer@example.com"), { target: { value: "custom@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(submit).toHaveBeenLastCalledWith({ useAccountEmail: false, deliveryEmail: "custom@example.com" });
  });

  it("prevents duplicate submission while a purchase is pending", () => {
    render(<DeliveryEmailDialog open loading accountEmail="account@example.com" onClose={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();
  });
});
