import type {
  GiftCardCode,
  GiftCardCodePage,
  GiftCardCodeStatus,
  GiftCardDenomination,
  GiftCardInventorySummary,
  GiftCardPage,
  GiftCardProduct,
  GiftCardStockCounts,
  PaginationMeta,
} from "@/types/gift-card";

type ApiRecord = Record<string, unknown>;

const codeStatuses: GiftCardCodeStatus[] = ["AVAILABLE", "RESERVED", "SOLD", "DISABLED", "EXPIRED"];

function record(value: unknown): ApiRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as ApiRecord : {};
}

function first(value: ApiRecord, keys: string[]): unknown {
  for (const key of keys) if (value[key] !== undefined && value[key] !== null) return value[key];
  return undefined;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : typeof value === "number" ? String(value) : "";
}

function numberValue(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function reportContractIssue(scope: string, missing: string[]) {
  if (process.env.NODE_ENV !== "production" && missing.length) {
    // Field names are safe to report; response values (especially inventory codes) are never logged.
    console.error(`[gift-card contract] ${scope} is missing: ${missing.join(", ")}`);
  }
}

export function mapGiftCardStock(value: unknown): GiftCardStockCounts | undefined {
  const source = record(value);
  const hasStockKeys = ["available", "reserved", "sold", "disabled", "expired"]
    .some(name => source[name] !== undefined || source[name.toUpperCase()] !== undefined);
  if (!hasStockKeys) return undefined;
  const count = (name: string) => numberValue(first(source, [name, name.toUpperCase()]));
  const stock = {
    available: count("available"),
    reserved: count("reserved"),
    sold: count("sold"),
    disabled: count("disabled"),
    expired: count("expired"),
    total: 0,
  };
  stock.total = numberValue(source.total, stock.available + stock.reserved + stock.sold + stock.disabled + stock.expired);
  return stock;
}

export function mapGiftCardDenomination(value: unknown): GiftCardDenomination {
  const source = record(value);
  const id = stringValue(source.id);
  const faceValue = stringValue(first(source, ["faceValue", "cardValue", "amount"]));
  const faceCurrency = stringValue(first(source, ["faceCurrency", "cardCurrency", "currency"]));
  const sellingPriceBdt = stringValue(first(source, ["sellingPriceBdt", "sellingPriceBDT", "bdtPrice"]));
  reportContractIssue(`denomination ${id || "(unknown)"}`, [
    !id && "id",
    !faceValue && "faceValue/cardValue/amount",
    !faceCurrency && "faceCurrency/cardCurrency/currency",
    !sellingPriceBdt && "sellingPriceBdt/sellingPriceBDT/bdtPrice",
  ].filter(Boolean) as string[]);
  const stock = mapGiftCardStock(source.stock ?? source.inventory);
  return {
    id,
    giftCardId: stringValue(first(source, ["giftCardId", "giftCardProductId"])) || undefined,
    faceValue,
    faceCurrency,
    sellingPriceBdt,
    inStock: typeof source.inStock === "boolean" ? source.inStock : Boolean(stock ? stock.available > 0 : numberValue(record(source._count).codes) > 0),
    isPopular: booleanValue(source.isPopular, false),
    isActive: booleanValue(source.isActive, true),
    sortOrder: numberValue(source.sortOrder),
    stock,
    createdAt: stringValue(source.createdAt) || undefined,
    updatedAt: stringValue(source.updatedAt) || undefined,
  };
}

export function mapGiftCardProduct(value: unknown): GiftCardProduct {
  const source = record(value);
  const title = stringValue(first(source, ["title", "name"]));
  const status = stringValue(source.status);
  const denominations = Array.isArray(source.denominations) ? source.denominations.map(mapGiftCardDenomination) : [];
  return {
    id: stringValue(source.id),
    name: stringValue(first(source, ["name", "title"])),
    title,
    slug: stringValue(source.slug),
    brand: stringValue(source.brand),
    description: stringValue(source.description) || null,
    shortDescription: stringValue(source.shortDescription) || null,
    imageUrl: stringValue(first(source, ["imageUrl", "image"])) || null,
    image: stringValue(first(source, ["image", "imageUrl"])) || null,
    logoUrl: stringValue(source.logoUrl) || null,
    currency: stringValue(first(source, ["currency", "cardCurrency"])),
    region: stringValue(source.region) || null,
    deliveryType: stringValue(source.deliveryType) || null,
    termsAndConditions: stringValue(source.termsAndConditions) || null,
    instructions: stringValue(source.instructions) || null,
    isActive: typeof source.isActive === "boolean" ? source.isActive : status ? status === "ACTIVE" : true,
    isFeatured: booleanValue(source.isFeatured, false),
    sortOrder: numberValue(source.sortOrder),
    denominations,
    createdAt: stringValue(source.createdAt) || undefined,
    updatedAt: stringValue(source.updatedAt) || undefined,
  };
}

function mapMeta(value: unknown): PaginationMeta {
  const source = record(value);
  return {
    page: numberValue(source.page, 1),
    limit: numberValue(source.limit, 20),
    total: numberValue(source.total),
    totalPages: Math.max(1, numberValue(source.totalPages, 1)),
  };
}

export function mapGiftCardPage(value: unknown): GiftCardPage {
  const source = record(value);
  return { data: Array.isArray(source.data) ? source.data.map(mapGiftCardProduct) : [], meta: mapMeta(source.meta) };
}

export function mapGiftCardCode(value: unknown, reveal = false): GiftCardCode {
  const source = record(value);
  const status = codeStatuses.includes(source.status as GiftCardCodeStatus) ? source.status as GiftCardCodeStatus : "DISABLED";
  const returnedCode = stringValue(first(source, ["maskedCode", "code"]));
  return {
    id: stringValue(source.id),
    maskedCode: reveal && source.maskedCode ? stringValue(source.maskedCode) : returnedCode,
    ...(reveal && source.code ? { code: stringValue(source.code) } : {}),
    maskedPin: stringValue(first(source, ["maskedPin", "pin"])) || null,
    ...(reveal && source.pin ? { pin: stringValue(source.pin) } : {}),
    serialNumber: stringValue(first(source, ["serialNumber", "serialNo"])) || null,
    orderItemId: stringValue(source.orderItemId) || null,
    expiryDate: stringValue(source.expiryDate) || null,
    status,
    createdAt: stringValue(source.createdAt) || undefined,
    updatedAt: stringValue(source.updatedAt) || undefined,
  };
}

export function mapGiftCardCodePage(value: unknown): GiftCardCodePage {
  const source = record(value);
  return { data: Array.isArray(source.data) ? source.data.map(item => mapGiftCardCode(item)) : [], meta: mapMeta(source.meta) };
}

export function mapGiftCardInventorySummary(value: unknown): GiftCardInventorySummary {
  const source = record(value);
  const stock = mapGiftCardStock(source) ?? {
    available: numberValue(source.availableCodes),
    reserved: numberValue(source.reservedCodes),
    sold: numberValue(source.soldCodes),
    disabled: numberValue(source.disabledCodes),
    expired: numberValue(source.expiredCodes),
    total: numberValue(source.totalCodes),
  };
  const lowStockSource = Array.isArray(source.lowStock) ? source.lowStock : Array.isArray(source.lowStockDenominations) ? source.lowStockDenominations : [];
  return {
    ...stock,
    total: numberValue(first(source, ["total", "totalCodes"]), stock.total),
    totalProducts: numberValue(source.totalProducts),
    lowStock: lowStockSource.map(item => {
      const row = record(item);
      const denominationLabel = stringValue(row.denomination);
      const [faceValue = "", faceCurrency = ""] = denominationLabel.split(/\s+/);
      return {
        giftCardId: stringValue(row.giftCardId),
        giftCardName: stringValue(first(row, ["giftCardName", "giftCard"])),
        denominationId: stringValue(row.denominationId),
        faceValue: stringValue(row.faceValue) || faceValue,
        faceCurrency: stringValue(row.faceCurrency) || faceCurrency,
        available: numberValue(row.available),
      };
    }),
  };
}
