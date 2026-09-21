import type { AccountFieldOption, AccountFieldRules, GameAccountField, GamePage, GameTopUp, GameTopUpPackage } from "@/types/game-top-up";
import type { PaginationMeta, ProductInputType, ProductStatus } from "@/types/api";

type R = Record<string, unknown>;
const rec = (value: unknown): R => value && typeof value === "object" && !Array.isArray(value) ? value as R : {};
const str = (value: unknown) => typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
const num = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const bool = (value: unknown, fallback = false) => typeof value === "boolean" ? value : fallback;
const jsonArray = (value: unknown) => Array.isArray(value) ? value : [];

export function mapPackage(value: unknown): GameTopUpPackage {
  const r = rec(value);
  return { id: str(r.id), gameId: str(r.gameId ?? r.gameTopUpProductId), name: str(r.name ?? r.title) || `${num(r.coinAmount ?? r.gameCurrencyAmount)}`, coinAmount: num(r.coinAmount ?? r.gameCurrencyAmount), bonusAmount: num(r.bonusAmount ?? r.bonusCurrencyAmount), priceBdt: str(r.priceBdt ?? r.sellingPriceBDT), costPriceBdt: str(r.costPriceBdt ?? r.costPriceBDT) || null, isActive: bool(r.isActive, true), isPopular: bool(r.isPopular), sortOrder: num(r.sortOrder), stockQuantity: r.stockQuantity == null ? null : num(r.stockQuantity), createdAt: str(r.createdAt) || undefined, updatedAt: str(r.updatedAt) || undefined };
}
export function mapField(value: unknown): GameAccountField {
  const r = rec(value);
  return { id: str(r.id), gameId: str(r.gameId ?? r.gameTopUpProductId), key: str(r.key ?? r.name), label: str(r.label), type: str(r.type || "TEXT") as ProductInputType, placeholder: str(r.placeholder) || null, helpText: str(r.helpText) || null, required: bool(r.required ?? r.isRequired, true), options: jsonArray(r.options).map(v => ({ label: str(rec(v).label), value: str(rec(v).value) })).filter((v): v is AccountFieldOption => Boolean(v.label && v.value)), validationRules: rec(r.validationRules) as AccountFieldRules, isActive: bool(r.isActive, true), sortOrder: num(r.sortOrder), createdAt: str(r.createdAt) || undefined, updatedAt: str(r.updatedAt) || undefined };
}
export function mapGame(value: unknown): GameTopUp {
  const r = rec(value); const status = str(r.status || "ACTIVE") as ProductStatus;
  return { id: str(r.id), name: str(r.name ?? r.title), title: str(r.title ?? r.name), slug: str(r.slug), description: str(r.description) || null, subHeading: str(r.subHeading) || null, logoUrl: str(r.logoUrl ?? r.logo), bannerUrl: str(r.bannerUrl ?? r.bannerImage) || null, gameCurrencyName: str(r.gameCurrencyName), fulfillmentType: str(r.fulfillmentType || "MANUAL") as GameTopUp["fulfillmentType"], instructions: str(r.instructions) || null, estimatedDelivery: str(r.estimatedDelivery) || null, termsAndConditions: str(r.termsAndConditions) || null, status, isActive: typeof r.isActive === "boolean" ? r.isActive : status === "ACTIVE", isFeatured: bool(r.isFeatured), sortOrder: num(r.sortOrder), packages: jsonArray(r.packages).map(mapPackage), accountFields: jsonArray(r.accountFields ?? r.inputFields).map(mapField), createdAt: str(r.createdAt) || undefined, updatedAt: str(r.updatedAt) || undefined };
}
const meta = (value: unknown): PaginationMeta => { const r = rec(value); return { total: num(r.total), page: num(r.page) || 1, limit: num(r.limit) || 20, totalPages: Math.max(1, num(r.totalPages) || 1) }; };
export function mapGamePage(value: unknown): GamePage { const r = rec(value); return { data: jsonArray(r.data).map(mapGame), meta: meta(r.meta) }; }
