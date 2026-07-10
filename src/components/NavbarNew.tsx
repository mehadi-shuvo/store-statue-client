"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import NavItems from "./navbar/NavItems";
import GlobalSearch from "./navbar/GlobalSearch";

const NavbarNew = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchMobileOpen, setSearchMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const { totalQuantity } = useCart();
  const { wishlistCount } = useWishlist();
  const toast = useToast();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setMobileOpen(false);
    toast.success("Signed out");
    router.replace("/login");
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setSearchMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-lg"
          : "bg-slate-950"
      }`}
    >
      {/* ================= TOP NAVBAR ================= */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo Section */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="Home"
          >
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-bold text-lg">GX</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:block tracking-tight">
              GameXpress
            </span>
          </Link>

          {/* Desktop Search - Centered */}
          <div className="hidden md:block flex-1 max-w-2xl mx-4 lg:mx-8">
            <Suspense
              fallback={
                <div className="h-11 rounded-xl border border-slate-800 bg-slate-900/70 animate-pulse" />
              }
            >
              <GlobalSearch />
            </Suspense>
          </div>

          {/* Right Side Actions - Essential E-commerce Features */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchMobileOpen(!searchMobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Wishlist Icon - Essential E-commerce Feature */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors group"
              aria-label="Wishlist"
            >
              <svg
                className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>

              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-lg min-w-[18px] text-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-slate-800 transition-colors group"
              aria-label="Cart"
            >
              <svg
                className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white shadow-lg min-w-[18px] text-center">
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold hover:scale-105 transition-transform shadow-md"
                aria-label="Profile menu"
              >
                {user?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "G"}
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                      <p className="text-white font-semibold">
                        {user?.name || "Guest User"}
                      </p>
                      <p className="text-slate-400 text-xs mt-1 truncate">
                        {user?.email || "Sign in to access your account"}
                      </p>
                    </div>

                    <div className="py-2">
                      {user ? (
                        <>
                          <Link
                            href="/profile"
                            className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            My Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            Wishlist
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 transition w-full text-left"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              />
                            </svg>
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                            Create Account
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchMobileOpen && (
          <div className="md:hidden pb-3 animate-in slide-in-from-top-1 duration-200">
            <Suspense
              fallback={
                <div className="h-11 rounded-xl border border-slate-800 bg-slate-900/70 animate-pulse" />
              }
            >
              <GlobalSearch />
            </Suspense>
          </div>
        )}
      </div>

      {/* ================= DESKTOP CATEGORY NAV ================= */}
      <div className="hidden lg:block border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8">
          <NavItems pathname={pathname} />
        </div>
      </div>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed top-[72px] left-0 right-0 bottom-0 bg-slate-950 z-40 overflow-y-auto animate-in slide-in-from-top-5 duration-300">
            <div className="p-5 space-y-6">
              {/* Mobile Categories */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Categories
                </h3>
                <NavItems pathname={pathname} mobile />
              </div>

              {/* Mobile Quick Links */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/deals"
                    className="block py-2 text-slate-300 hover:text-white transition"
                  >
                    🔥 Today&apos;s Deals
                  </Link>
                  <Link
                    href="/new-arrivals"
                    className="block py-2 text-slate-300 hover:text-white transition"
                  >
                    ✨ New Arrivals
                  </Link>
                  <Link
                    href="/best-sellers"
                    className="block py-2 text-slate-300 hover:text-white transition"
                  >
                    ⭐ Best Sellers
                  </Link>
                  <Link
                    href="/support"
                    className="block py-2 text-slate-300 hover:text-white transition"
                  >
                    🎧 Customer Support
                  </Link>
                </div>
              </div>

              {/* Mobile User Actions if not logged in */}
              {!user && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full text-center border border-slate-700 text-slate-300 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default NavbarNew;
