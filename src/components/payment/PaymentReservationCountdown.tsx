"use client";
import { useEffect, useState } from "react";

export default function PaymentReservationCountdown({ paymentExpiresAt, onExpired }: { paymentExpiresAt: string; onExpired?: () => void }) {
  const expiresAt = Date.parse(paymentExpiresAt);
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, expiresAt - Date.now()));
    update(); const timer = window.setInterval(update, 1_000); return () => window.clearInterval(timer);
  }, [expiresAt]);
  useEffect(() => { if (remaining === 0) onExpired?.(); }, [onExpired, remaining]);
  if (remaining === 0) return <div role="status" className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">Reservation expired. Checking payment status...</div>;
  const seconds = Math.ceil(remaining / 1000);
  return <div role="timer" aria-live="polite" className="rounded-2xl bg-blue-50 p-4 text-blue-900"><p className="text-xs font-bold uppercase tracking-wider">Payment reservation</p><p className="mt-1 text-xl font-black tabular-nums">{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")} remaining</p></div>;
}
