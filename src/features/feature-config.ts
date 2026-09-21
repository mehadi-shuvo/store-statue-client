import type {
  AdminFeature,
  FeatureMap,
  PublicFeature,
  PublicFeatureRouteRule,
  RouteMatrixEntry,
} from "./feature-types";

/**
 * Launch availability for customer-facing capabilities.
 *
 * These values deliberately come from source control rather than public
 * environment variables, so a deployment cannot accidentally expose an
 * unfinished service through an environment mismatch.
 */
export const PUBLIC_FEATURES = {
  giftCards: true,
  gameTopUp: true,
  generalProducts: false,
  accessories: false,
  decoration: false,
  subscriptions: false,
  wishlist: false,
  generalCheckout: false,
} as const satisfies FeatureMap<PublicFeature>;

/** Admin management is independent from storefront availability. */
export const ADMIN_FEATURES = {
  products: true,
  giftCards: true,
  gameTopUp: true,
  subscriptions: true,
  categories: true,
  inventory: true,
  orders: true,
  delivery: true,
  payments: true,
  customers: true,
  adminAccounts: true,
  auditLogs: true,
  profileSecurity: true,
} as const satisfies FeatureMap<AdminFeature>;

export const FEATURE_LABELS: Readonly<Record<PublicFeature, string>> = {
  giftCards: "Gift Cards",
  gameTopUp: "Game Top-Ups",
  generalProducts: "Products and Merchandise",
  accessories: "Accessories",
  decoration: "Decoration",
  subscriptions: "Subscriptions",
  wishlist: "Wishlist",
  generalCheckout: "General Checkout",
};

/**
 * Customer routes that must be blocked at the request boundary when their
 * feature is off. Prefix matching includes the route itself and descendants.
 */
export const PUBLIC_FEATURE_ROUTE_RULES = [
  {
    feature: "giftCards",
    routes: [{ pathname: "/gift-cards", includeDescendants: true }],
  },
  {
    feature: "gameTopUp",
    routes: [{ pathname: "/top-up", includeDescendants: true }],
  },
  {
    feature: "generalProducts",
    routes: [
      { pathname: "/products", includeDescendants: true },
      { pathname: "/product", includeDescendants: true },
      { pathname: "/categories", includeDescendants: true },
      { pathname: "/deals", includeDescendants: true },
      { pathname: "/new-arrivals", includeDescendants: true },
      { pathname: "/best-sellers", includeDescendants: true },
      { pathname: "/pre-orders", includeDescendants: true },
    ],
  },
  {
    feature: "accessories",
    routes: [{ pathname: "/accessories", includeDescendants: true }],
  },
  {
    feature: "decoration",
    routes: [{ pathname: "/decoration", includeDescendants: true }],
  },
  {
    feature: "subscriptions",
    routes: [{ pathname: "/subscriptions", includeDescendants: true }],
  },
  {
    feature: "wishlist",
    routes: [{ pathname: "/wishlist", includeDescendants: true }],
  },
  {
    feature: "generalCheckout",
    routes: [{ pathname: "/checkout", includeDescendants: true }],
  },
] as const satisfies readonly PublicFeatureRouteRule[];

/** Auditable launch-scope map used to keep routing decisions explicit. */
export const ROUTE_AVAILABILITY_MATRIX = [
  {
    routes: ["/", "/gift-cards", "/gift-cards/[id]", "/top-up"],
    availability: "ACTIVE",
    note: "Launch storefront and its two enabled services.",
  },
  {
    routes: ["/login", "/signup", "/profile"],
    availability: "INTERNAL_DEPENDENCY",
    note: "Authentication and customer account access required by purchases.",
  },
  {
    routes: ["/cart", "/profile/gift-card-orders", "/profile/gift-card-orders/[orderId]", "/profile/game-topup-orders", "/profile/game-topup-orders/[orderId]"],
    availability: "INTERNAL_DEPENDENCY",
    note: "Customer checkout and order history for enabled digital services.",
  },
  {
    routes: [
      "/payment/success",
      "/payment/failed",
      "/payment/cancelled",
      "/payment/history",
    ],
    availability: "INTERNAL_DEPENDENCY",
    note: "Backend-verified payment outcomes for enabled digital services.",
  },
  {
    routes: ["/products", "/product/[productId]", "/categories/[category]"],
    availability: "DISABLED",
    feature: "generalProducts",
    note: "Generic merchandise catalog is outside the launch scope.",
  },
  {
    routes: ["/accessories"],
    availability: "DISABLED",
    feature: "accessories",
    note: "Temporarily unavailable to customers.",
  },
  {
    routes: ["/decoration"],
    availability: "DISABLED",
    feature: "decoration",
    note: "Temporarily unavailable to customers.",
  },
  {
    routes: ["/subscriptions"],
    availability: "DISABLED",
    feature: "subscriptions",
    note: "Reserved for future storefront reactivation.",
  },
  {
    routes: ["/wishlist"],
    availability: "DISABLED",
    feature: "wishlist",
    note: "Wishlist implementation is preserved but not exposed at launch.",
  },
  {
    routes: ["/checkout"],
    availability: "DISABLED",
    feature: "generalCheckout",
    note: "Generic checkout is not used by the active gift-card checkout action.",
  },
  {
    routes: ["/admin", "/admin/**"],
    availability: "ADMIN_ONLY",
    note: "Admin management remains independent from public feature flags.",
  },
] as const satisfies readonly RouteMatrixEntry[];

export function isPublicFeatureEnabled(feature: PublicFeature): boolean {
  return PUBLIC_FEATURES[feature];
}

export function isPublicFeature(feature: string): feature is PublicFeature {
  return Object.prototype.hasOwnProperty.call(PUBLIC_FEATURES, feature);
}
