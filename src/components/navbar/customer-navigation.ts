import { isPublicFeatureEnabled } from "@/features/feature-config";
import type { PublicFeature } from "@/features/feature-types";
import type { LucideIcon } from "lucide-react";
import { Gamepad2, Gift, House } from "lucide-react";

export interface CustomerNavigationItem {
  readonly label: string;
  readonly mobileLabel?: string;
  readonly href: `/${string}`;
  readonly icon: LucideIcon;
  readonly feature?: PublicFeature;
  readonly exact?: boolean;
}

const CUSTOMER_NAVIGATION_ITEMS: readonly CustomerNavigationItem[] = [
  { label: "Home", href: "/", icon: House, exact: true },
  {
    label: "Gift Cards",
    href: "/gift-cards",
    icon: Gift,
    feature: "giftCards",
  },
  {
    label: "Game Top-Up",
    href: "/top-up",
    icon: Gamepad2,
    feature: "gameTopUp",
  },
];

const CART_FEATURES: readonly PublicFeature[] = ["giftCards"];

export function getCustomerNavigation(): readonly CustomerNavigationItem[] {
  return CUSTOMER_NAVIGATION_ITEMS.filter(
    (item) => !item.feature || isPublicFeatureEnabled(item.feature),
  );
}

export function isCustomerNavigationActive(
  pathname: string,
  item: CustomerNavigationItem,
): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function isCustomerCartAvailable(): boolean {
  return CART_FEATURES.some(isPublicFeatureEnabled);
}

export function isGiftCardOrderHistoryAvailable(): boolean {
  return isPublicFeatureEnabled("giftCards");
}

export function isGameTopUpOrderHistoryAvailable(): boolean {
  return isPublicFeatureEnabled("gameTopUp");
}
