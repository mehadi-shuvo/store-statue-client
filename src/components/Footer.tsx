"use client";

import { useAuth } from "@/context/AuthContext";
import { isPublicFeatureEnabled } from "@/features/feature-config";
import { ArrowUpRight, Gamepad2, Gift, LayoutDashboard, LogIn, ReceiptText, UserRound } from "lucide-react";
import Link from "next/link";

const footerLink =
  "inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400";

export default function Footer() {
  const { user, loading } = useAuth();
  const giftCardsEnabled = isPublicFeatureEnabled("giftCards");
  const gameTopUpEnabled = isPublicFeatureEnabled("gameTopUp");

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid w-11/12 max-w-7xl gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr] md:py-14">
        <div className="max-w-md">
          <Link
            href="/"
            aria-label="GameXpress home"
            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-base font-black">GX</span>
            <span>
              <span className="block text-lg font-black tracking-tight">GameXpress</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Digital services</span>
            </span>
          </Link>
          <p className="mt-5 text-sm leading-7 text-slate-400">
            Digital Gift Cards and supported Game Top-Ups with clear BDT catalog pricing and account-based workflows.
          </p>
        </div>

        <nav aria-label="Footer services">
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Services</h2>
          <ul className="mt-3 space-y-1">
            {giftCardsEnabled ? (
              <li><Link href="/gift-cards" className={footerLink}><Gift className="h-4 w-4" />Gift Cards</Link></li>
            ) : null}
            {gameTopUpEnabled ? (
              <li><Link href="/top-up" className={footerLink}><Gamepad2 className="h-4 w-4" />Game Top-Ups</Link></li>
            ) : null}
          </ul>
        </nav>

        <nav aria-label="Footer account links">
          <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Account</h2>
          <ul className="mt-3 space-y-1">
            {loading ? <li className="h-11 w-32 animate-pulse rounded-lg bg-slate-900" /> : user?.role === "CUSTOMER" ? (
              <>
                <li><Link href="/profile" className={footerLink}><UserRound className="h-4 w-4" />My Profile</Link></li>
                {giftCardsEnabled ? <li><Link href="/profile/gift-card-orders" className={footerLink}><ReceiptText className="h-4 w-4" />Gift Card Orders</Link></li> : null}
                {gameTopUpEnabled ? <li><Link href="/profile/game-topup-orders" className={footerLink}><Gamepad2 className="h-4 w-4" />Top-Up Orders</Link></li> : null}
              </>
            ) : user ? (
              <li><Link href="/admin" className={footerLink}><LayoutDashboard className="h-4 w-4" />Admin Dashboard</Link></li>
            ) : (
              <>
                <li><Link href="/login" className={footerLink}><LogIn className="h-4 w-4" />Sign In</Link></li>
                <li><Link href="/signup" className={footerLink}>Create Account<ArrowUpRight className="h-4 w-4" /></Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex w-11/12 max-w-7xl flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GameXpress.</p>
          <p>Catalog prices shown in BDT · Order states confirmed by the backend</p>
        </div>
      </div>
    </footer>
  );
}
