"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: "Accessories", href: "/accessories", icon: "🎧" },
    { name: "Game Top-Up", href: "/top-up", icon: "⚡" },
    { name: "Gift Cards", href: "/gift-cards", icon: "🎁" },
    { name: "Subscriptions", href: "/subscriptions", icon: "🔄" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-900/98 shadow-2xl border-b border-purple-500/20"
            : "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900"
        }`}
      >
        <div className="max-w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo & Mobile Menu */}
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/20 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-3 ml-6 lg:ml-0"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">GX</span>
                </div>
                <div className="">
                  <h1 className="text-white font-bold text-xl bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text">
                    GameXpress
                  </h1>
                  <p className="text-gray-400 text-xs">Gaming & Electronics</p>
                </div>
              </Link>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-200 group"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Section - Search, Cart, Profile */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Search Bar */}
              <div className="relative">
                {isSearchOpen ? (
                  <div className="absolute right-0 top-12 w-80 bg-slate-800 rounded-xl shadow-2xl border border-purple-500/30 p-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Search games, products, brands..."
                        className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : null}

                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
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
              </div>

              {/* Cart */}
              <button className="relative p-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User Profile */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="hidden md:block font-medium">User</span>
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-12 w-48 bg-slate-800 rounded-xl shadow-2xl border border-purple-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      📦 Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      ❤️ Wishlist
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors">
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsDrawerOpen(false)}
            ></div>

            {/* Drawer Content */}
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-slate-900 border-r border-purple-500/20 shadow-2xl z-50">
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center space-x-3"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">GX</span>
                    </div>
                    <div>
                      <h1 className="text-white font-bold text-lg">
                        GameXpress
                      </h1>
                      <p className="text-gray-400 text-xs">
                        Gaming & Electronics
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* User Section in Mobile */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      📦 Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      ❤️ Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
