"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const NavItems = ({
  pathname,
  mobile = false,
}: {
  pathname: string;
  mobile?: boolean;
}) => {
  const navItems: NavItem[] = [
    {
      name: "Accessories",
      href: "/accessories",
      icon: (
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
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Game Top-Up",
      href: "/top-up",
      icon: (
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      name: "Gift Cards",
      href: "/gift-cards",
      icon: (
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
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
    },
    {
      name: "Decoration",
      href: "/decoration",
      icon: (
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => pathname === href;

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition ${
              isActive(item.href)
                ? "bg-purple-600/20 text-purple-400"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <span className="w-6">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-1 py-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            isActive(item.href)
              ? "bg-purple-600/20 text-purple-400"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          <span className="w-5">{item.icon}</span>
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
