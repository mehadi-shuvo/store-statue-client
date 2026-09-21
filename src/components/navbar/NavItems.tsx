"use client";

import Link from "next/link";
import {
  getCustomerNavigation,
  isCustomerNavigationActive,
} from "./customer-navigation";

interface NavItemsProps {
  pathname: string;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export default function NavItems({
  pathname,
  variant = "desktop",
  onNavigate,
}: NavItemsProps) {
  const navigation = getCustomerNavigation();

  if (variant === "mobile") {
    return (
      <nav aria-label="Mobile primary navigation" className="space-y-1">
        {navigation.map((item) => {
          const active = isCustomerNavigationActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex min-h-14 items-center gap-4 rounded-2xl px-4 py-3 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                active
                  ? "bg-blue-50 text-blue-800"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl ${active ? "bg-blue-100" : "bg-slate-100"}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              {item.mobileLabel ?? item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Primary navigation" className="flex items-center gap-1">
      {navigation.map((item) => {
        const active = isCustomerNavigationActive(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`relative rounded-xl px-3 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 lg:px-4 ${
              active
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.label}
            {active ? (
              <span className="absolute inset-x-3 -bottom-[14px] h-0.5 rounded-full bg-cyan-300 lg:inset-x-4" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
