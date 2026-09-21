"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useGiftCardCart } from "@/hooks/api/use-gift-card-api";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AccountMenu from "./navbar/AccountMenu";
import CartLink from "./navbar/CartLink";
import CustomerBrand from "./navbar/CustomerBrand";
import MobileMenu from "./navbar/MobileMenu";
import NavItems from "./navbar/NavItems";
import { isCustomerCartAvailable } from "./navbar/customer-navigation";

export default function NavbarNew() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();
  const { user, loading: authLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const cartAvailable = isCustomerCartAvailable();
  const isCustomer = user?.role === "CUSTOMER";
  const giftCardCart = useGiftCardCart(
    Boolean(cartAvailable && isCustomer && user?.id),
  );
  const cartQuantity =
    giftCardCart.data?.items.reduce(
      (quantity, item) => quantity + item.quantity,
      0,
    ) ?? 0;

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
  const dismissMobileMenu = useCallback(() => {
    setMobileOpen(false);
    window.requestAnimationFrame(() => mobileTriggerRef.current?.focus());
  }, []);
  useEffect(() => closeMobileMenu(), [closeMobileMenu, pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-sm">
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
        <CustomerBrand />

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <NavItems pathname={pathname} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {cartAvailable ? <CartLink quantity={cartQuantity} /> : null}
          <div className="hidden md:block">
            <AccountMenu user={user} loading={authLoading} onLogout={handleLogout} />
          </div>
          <button
            ref={mobileTriggerRef}
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="customer-mobile-menu"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-700 text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        pathname={pathname}
        user={user}
        authLoading={authLoading}
        onClose={closeMobileMenu}
        onDismiss={dismissMobileMenu}
        onLogout={handleLogout}
      />
    </header>
  );
}
