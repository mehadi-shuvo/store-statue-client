"use client";

import type { AuthUser } from "@/lib/auth";
import {
  ChevronDown,
  Gamepad2,
  LayoutDashboard,
  LogIn,
  LogOut,
  ReceiptText,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isGameTopUpOrderHistoryAvailable, isGiftCardOrderHistoryAvailable } from "./customer-navigation";

interface AccountMenuProps {
  user: AuthUser | null;
  loading: boolean;
  onLogout: () => Promise<void>;
}

const menuItemClass =
  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600";

export default function AccountMenu({
  user,
  loading,
  onLogout,
}: AccountMenuProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (loading) {
    return (
      <div
        aria-label="Loading account"
        className="h-11 w-28 animate-pulse rounded-xl border border-slate-800 bg-slate-900 lg:w-36"
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-11 w-28 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:w-36"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Sign in
      </Link>
    );
  }

  const isCustomer = user.role === "CUSTOMER";
  const displayName = user.name?.trim() || "Account";

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await onLogout();
      setOpen(false);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="customer-account-menu"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-28 items-center gap-2 rounded-xl border border-slate-700 px-3 text-left text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 lg:w-36"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-800 text-slate-200">
          <UserRound className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-bold">{displayName}</span>
          <span className="block text-[10px] text-slate-400">Account</span>
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id="customer-account-menu"
          role="menu"
          aria-label="Account menu"
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-950 shadow-2xl"
        >
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-black text-slate-950">{displayName}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="space-y-1 py-2">
            {isCustomer ? (
              <>
                <Link role="menuitem" href="/profile" className={menuItemClass}>
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                  My profile
                </Link>
                {isGiftCardOrderHistoryAvailable() ? (
                  <Link role="menuitem" href="/profile/gift-card-orders" className={menuItemClass}>
                    <ReceiptText className="h-4 w-4" aria-hidden="true" />
                    Gift Card Orders
                  </Link>
                ) : null}
                {isGameTopUpOrderHistoryAvailable() ? (
                  <Link role="menuitem" href="/profile/game-topup-orders" className={menuItemClass}>
                    <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                    Top-Up Orders
                  </Link>
                ) : null}
              </>
            ) : (
              <Link role="menuitem" href="/admin" className={menuItemClass}>
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Admin dashboard
              </Link>
            )}
          </div>
          <div className="border-t border-slate-100 pt-2">
            <button
              role="menuitem"
              type="button"
              disabled={signingOut}
              onClick={handleLogout}
              className={`${menuItemClass} text-rose-700 hover:bg-rose-50 hover:text-rose-800 disabled:opacity-50`}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
