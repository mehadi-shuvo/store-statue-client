"use client";

import type { AuthUser } from "@/lib/auth";
import {
  LayoutDashboard,
  Gamepad2,
  LogIn,
  LogOut,
  ReceiptText,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CustomerBrand from "./CustomerBrand";
import NavItems from "./NavItems";
import { isGameTopUpOrderHistoryAvailable, isGiftCardOrderHistoryAvailable } from "./customer-navigation";

interface MobileMenuProps {
  open: boolean;
  pathname: string;
  user: AuthUser | null;
  authLoading: boolean;
  onClose: () => void;
  onDismiss: () => void;
  onLogout: () => Promise<void>;
}

const actionClass =
  "flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";

export default function MobileMenu({
  open,
  pathname,
  user,
  authLoading,
  onClose,
  onDismiss,
  onLogout,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onDismiss, open]);

  if (!open) return null;

  const isCustomer = user?.role === "CUSTOMER";
  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await onLogout();
      onClose();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] md:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onDismiss}
        className="absolute inset-0 bg-slate-950/65"
      />
      <div
        ref={panelRef}
        id="customer-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Customer navigation"
        className="absolute inset-y-0 right-0 flex w-[min(22.5rem,calc(100%-1rem))] flex-col overflow-y-auto bg-white shadow-2xl"
      >
        <div className="flex min-h-[72px] items-center justify-between border-b border-slate-200 bg-slate-950 px-4">
          <CustomerBrand />
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={onDismiss}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Explore
          </p>
          <NavItems pathname={pathname} variant="mobile" onNavigate={onClose} />

          <div className="my-6 border-t border-slate-200" />
          <p className="mb-3 px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Account
          </p>

          {authLoading ? (
            <div className="mx-4 h-12 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <div className="space-y-1">
              <div className="mb-3 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="truncate text-sm font-black text-slate-950">
                  {user.name || "Account"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
              </div>
              {isCustomer ? (
                <>
                  <Link href="/profile" onClick={onClose} className={actionClass}>
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                    My profile
                  </Link>
                  {isGiftCardOrderHistoryAvailable() ? (
                    <Link href="/profile/gift-card-orders" onClick={onClose} className={actionClass}>
                      <ReceiptText className="h-5 w-5" aria-hidden="true" />
                      Gift Card Orders
                    </Link>
                  ) : null}
                  {isGameTopUpOrderHistoryAvailable() ? (
                    <Link href="/profile/game-topup-orders" onClick={onClose} className={actionClass}>
                      <Gamepad2 className="h-5 w-5" aria-hidden="true" />
                      Top-Up Orders
                    </Link>
                  ) : null}
                </>
              ) : (
                <Link href="/admin" onClick={onClose} className={actionClass}>
                  <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                  Admin dashboard
                </Link>
              )}
              <button
                type="button"
                disabled={signingOut}
                onClick={handleLogout}
                className={`${actionClass} w-full text-rose-700 hover:bg-rose-50 hover:text-rose-800 disabled:opacity-50`}
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/login" onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Sign in
              </Link>
              <Link href="/signup" onClick={onClose} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Create account
              </Link>
            </div>
          )}
        </div>

        <p className="border-t border-slate-200 px-6 py-5 text-xs leading-5 text-slate-500">
          Secure Gift Cards and Game Top-Ups from GameXpress.
        </p>
      </div>
    </div>
  );
}
