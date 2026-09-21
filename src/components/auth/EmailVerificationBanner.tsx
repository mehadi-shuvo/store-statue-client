"use client";

import { useAuth } from "@/context/AuthContext";
import { rememberPendingVerificationEmail } from "@/lib/auth-flow";
import { withReturnTo } from "@/lib/safe-return-path";
import { MailWarning } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EmailVerificationBanner() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  if (loading || user?.role !== "CUSTOMER" || user.isEmailVerified !== false || pathname === "/verify-email") return null;

  return (
    <aside className="fixed inset-x-0 top-[72px] z-40 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-amber-950 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm sm:justify-between sm:text-left">
        <span className="inline-flex items-center gap-2 font-semibold"><MailWarning className="h-4 w-4 shrink-0" aria-hidden="true" />Verify your email before purchasing gift cards.</span>
        <Link href={withReturnTo("/verify-email", pathname)} onClick={() => rememberPendingVerificationEmail(user.email)} className="font-black text-amber-900 underline decoration-amber-400 underline-offset-4 hover:text-slate-950">Verify or resend</Link>
      </div>
    </aside>
  );
}
