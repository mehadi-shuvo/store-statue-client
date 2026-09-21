export type PublicFeature =
  | "giftCards"
  | "gameTopUp"
  | "generalProducts"
  | "accessories"
  | "decoration"
  | "subscriptions"
  | "wishlist"
  | "generalCheckout";

export type AdminFeature =
  | "products"
  | "giftCards"
  | "gameTopUp"
  | "subscriptions"
  | "categories"
  | "inventory"
  | "orders"
  | "delivery"
  | "payments"
  | "customers"
  | "adminAccounts"
  | "auditLogs"
  | "profileSecurity";

export type FeatureMap<TFeature extends string> = Readonly<
  Record<TFeature, boolean>
>;

export type RouteAvailability =
  | "ACTIVE"
  | "DISABLED"
  | "INTERNAL_DEPENDENCY"
  | "ADMIN_ONLY";

export interface PublicRouteMatcher {
  readonly pathname: `/${string}`;
  readonly includeDescendants?: boolean;
}

export interface PublicFeatureRouteRule {
  readonly feature: PublicFeature;
  readonly routes: readonly PublicRouteMatcher[];
}

export interface RouteMatrixEntry {
  readonly routes: readonly string[];
  readonly availability: RouteAvailability;
  readonly feature?: PublicFeature;
  readonly note: string;
}
