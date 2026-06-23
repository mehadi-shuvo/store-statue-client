import {
  Headphones,
  LampDesk,
  LayoutGrid,
  MonitorSmartphone,
  Moon,
  Smartphone,
  Sparkles,
  Tv2,
  Watch,
  type LucideIcon,
} from "lucide-react";

export interface CategoryRecord {
  id?: string | number;
  categoryID?: string;
  title?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string | null;
  icon?: string | null;
  href?: string;
}

export interface CategoryDisplay {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string | null;
  href: string;
  categoryID: string;
}

export function parseCategoriesPayload(payload: unknown): CategoryRecord[] {
  const candidateSources = [
    (payload as { data?: { data?: CategoryRecord[] } })?.data?.data,
    (payload as { data?: CategoryRecord[] })?.data,
    (payload as { categories?: CategoryRecord[] })?.categories,
    payload,
  ];

  for (const source of candidateSources) {
    if (Array.isArray(source)) {
      return source as CategoryRecord[];
    }
  }

  return [];
}

export function normalizeCategory(record: CategoryRecord): CategoryDisplay | null {
  const id = String(record.id ?? record.categoryID ?? "");

  if (!id) {
    return null;
  }

  const title = record.title || record.name || "Category";
  const slug = record.slug || title.toLowerCase().replace(/\s+/g, "-");

  return {
    id,
    title,
    slug,
    description: record.description || "",
    image: record.image || null,
    icon: record.icon || null,
    href: record.href || `/categories/${slug}`,
    categoryID: record.categoryID || id,
  };
}

export function getCategoryFallbackIcon(title: string): LucideIcon {
  const normalized = title.toLowerCase();

  if (normalized.includes("watch")) return Watch;
  if (normalized.includes("headphone") || normalized.includes("audio")) return Headphones;
  if (normalized.includes("lamp") || normalized.includes("light")) return LampDesk;
  if (normalized.includes("phone") || normalized.includes("mobile")) return Smartphone;
  if (normalized.includes("tv") || normalized.includes("monitor")) return Tv2;
  if (normalized.includes("game") || normalized.includes("controller")) return LayoutGrid;
  if (normalized.includes("smart")) return MonitorSmartphone;
  if (normalized.includes("moon") || normalized.includes("night")) return Moon;

  return Sparkles;
}

export function findAccessoriesCategoryId(categories: CategoryDisplay[]) {
  const accessoryCategory = categories.find((category) =>
    ["accessories", "accessory", "electronics", "gadget"].some((term) =>
      category.title.toLowerCase().includes(term) ||
      category.slug.toLowerCase().includes(term),
    ),
  );

  return accessoryCategory?.categoryID || categories[0]?.categoryID || "";
}
