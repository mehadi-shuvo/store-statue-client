import { describe, expect, it } from "vitest";
import { adminNavigation, isAdminNavItemActive } from "./admin-navigation";

const catalog = adminNavigation.find(section => section.label === "Catalog")!.items;
const active = (path: string) => catalog.filter(item => isAdminNavItemActive(path, item)).map(item => item.label);

describe("admin catalog navigation", () => {
  it.each([
    ["/admin/products", ["All products"]],
    ["/admin/gift-cards", ["Gift cards"]],
    ["/admin/gift-cards/g1/denominations", ["Gift cards"]],
    ["/admin/game-topups", ["Game top-ups"]],
    ["/admin/game-topups/g1/packages", ["Game top-ups"]],
    ["/admin/subscriptions", ["Subscriptions"]],
  ])("matches only the intended sibling for %s", (path, expected) => expect(active(path)).toEqual(expected));
});
