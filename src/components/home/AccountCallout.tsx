"use client";

import { useAuth } from "@/context/AuthContext";
import { isPublicFeatureEnabled } from "@/features/feature-config";
import { ArrowRight, LayoutDashboard, LogIn, ReceiptText, UserPlus, UserRound } from "lucide-react";
import Link from "next/link";

const primaryLink = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";
const secondaryLink = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2";

export default function AccountCallout() {
  const { user, loading } = useAuth();
  const giftCardsEnabled = isPublicFeatureEnabled("giftCards");

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="account-callout-title">
      <div className="mx-auto w-11/12 max-w-7xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Your account</p>
          <h2 id="account-callout-title" className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            {user ? `Welcome back, ${user.name || "customer"}.` : "Keep your purchases connected to your account."}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{giftCardsEnabled ? "Sign in to use protected customer workflows and revisit your Gift Card purchase history." : "Sign in to use protected customer workflows and keep your account details together."}</p>
        </div>
        <div className="mt-7 flex min-h-12 flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
          {loading ? (
            <><span className="h-12 w-36 animate-pulse rounded-xl bg-slate-100" /><span className="h-12 w-36 animate-pulse rounded-xl bg-slate-100" /></>
          ) : user?.role === "CUSTOMER" ? (
            <>
              <Link href="/profile" className={primaryLink}><UserRound className="h-4 w-4" />My Profile</Link>
              {giftCardsEnabled ? <Link href="/profile/gift-card-orders" className={secondaryLink}><ReceiptText className="h-4 w-4" />Gift Card Orders</Link> : null}
            </>
          ) : user ? (
            <Link href="/admin" className={primaryLink}><LayoutDashboard className="h-4 w-4" />Admin Dashboard <ArrowRight className="h-4 w-4" /></Link>
          ) : (
            <>
              <Link href="/login" className={primaryLink}><LogIn className="h-4 w-4" />Sign In</Link>
              <Link href="/signup" className={secondaryLink}><UserPlus className="h-4 w-4" />Create Account</Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
