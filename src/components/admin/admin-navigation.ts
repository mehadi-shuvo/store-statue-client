import { CircleGauge, ClipboardList, CreditCard, FileClock, Gift, KeyRound, LayoutGrid, PackageSearch, Shapes, ShieldCheck, TicketCheck, Truck, UserCog, Users, Warehouse, Zap } from "lucide-react";

export type AdminNavItem = { href: string; label: string; icon: typeof CircleGauge; match?: "exact" | "prefix"; superOnly?: boolean };
export const adminNavigation: Array<{ label: string; items: AdminNavItem[] }> = [
  { label: "Workspace", items: [{ href: "/admin", label: "Overview", icon: CircleGauge, match: "exact" }] },
  { label: "Catalog", items: [
    { href: "/admin/products", label: "All products", icon: LayoutGrid, match: "exact" },
    { href: "/admin/gift-cards", label: "Gift cards", icon: Gift, match: "prefix" },
    { href: "/admin/game-topups", label: "Game top-ups", icon: Zap, match: "prefix" },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: TicketCheck, match: "prefix" },
    { href: "/admin/categories", label: "Categories", icon: Shapes, match: "prefix" },
    { href: "/admin/gift-card-inventory", label: "Gift-card inventory", icon: Warehouse, match: "prefix" },
    { href: "/admin/inventory", label: "All inventory", icon: Warehouse, match: "prefix" },
  ]},
  { label: "Commerce", items: [
    { href: "/admin/gift-card-orders", label: "Gift-card orders", icon: Gift, match: "prefix" },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList, match: "prefix" },
    { href: "/admin/delivery", label: "Delivery queue", icon: Truck, match: "prefix" },
    { href: "/admin/payments", label: "Payments", icon: CreditCard, match: "prefix" },
  ]},
  { label: "People", items: [{ href: "/admin/users", label: "Customers", icon: Users, match: "prefix" }, { href: "/admin/admins", label: "Admin accounts", icon: ShieldCheck, match: "prefix", superOnly: true }] },
  { label: "Monitoring", items: [{ href: "/admin/audit-logs", label: "Audit logs", icon: FileClock, match: "prefix" }, { href: "/admin/logs", label: "Application logs", icon: PackageSearch, match: "prefix" }] },
  { label: "Settings", items: [{ href: "/admin/profile", label: "Profile", icon: UserCog, match: "prefix" }, { href: "/admin/security", label: "Security", icon: KeyRound, match: "prefix" }] },
];

export function normalizeAdminPath(pathname: string) {
  const normalized = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return normalized || "/";
}

export function isAdminNavItemActive(pathname: string, item: Pick<AdminNavItem, "href" | "match">) {
  const current = normalizeAdminPath(pathname);
  const target = normalizeAdminPath(item.href);
  return item.match === "prefix" ? current === target || current.startsWith(`${target}/`) : current === target;
}
