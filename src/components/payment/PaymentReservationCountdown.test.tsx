import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import PaymentReservationCountdown from "./PaymentReservationCountdown";

describe("PaymentReservationCountdown", () => {
  afterEach(() => vi.useRealTimers());
  it("uses the supplied timestamp across remounts and expires safely", () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-15T10:00:00Z"));
    const expires = "2026-09-15T10:05:00Z";
    const first = render(<PaymentReservationCountdown paymentExpiresAt={expires} />);
    expect(screen.getByText("05:00 remaining")).toBeInTheDocument();
    first.unmount(); vi.setSystemTime(new Date("2026-09-15T10:04:58Z"));
    render(<PaymentReservationCountdown paymentExpiresAt={expires} />);
    expect(screen.getByText("00:02 remaining")).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText(/Reservation expired/i)).toBeInTheDocument();
  });
});
