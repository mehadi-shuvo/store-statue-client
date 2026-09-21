const currencySymbols: Readonly<Record<string, string>> = {
  BDT: "৳",
  EUR: "€",
  GBP: "£",
  USD: "$",
};

const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const bdtFormatter = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

function finiteNumber(value: string | number | null | undefined): number | null {
  if (value == null || value === "") return null;
  const numeric = Number(String(value).trim());
  return Number.isFinite(numeric) ? numeric : null;
}

export function formatMoney(
  value: string | number | null | undefined,
  currency: string,
): string {
  const numeric = finiteNumber(value);
  const normalizedCurrency = currency.trim().toUpperCase();
  if (numeric == null || !normalizedCurrency) return "—";

  const prefix = currencySymbols[normalizedCurrency] ?? `${normalizedCurrency} `;
  return `${prefix}${decimalFormatter.format(numeric)}`;
}

export function formatMoneyCode(
  value: string | number | null | undefined,
  currency: string,
): string {
  const numeric = finiteNumber(value);
  const normalizedCurrency = currency.trim().toUpperCase();
  if (numeric == null || !normalizedCurrency) return "—";
  return `${normalizedCurrency} ${decimalFormatter.format(numeric)}`;
}

export function formatBdt(value: string | number | null | undefined): string {
  return bdtFormatter.format(finiteNumber(value) ?? 0);
}

export function formatDateTime(
  value: string | number | Date | null | undefined,
  fallback = "Not available",
): string {
  if (value == null || value === "") return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleString();
}

export function formatDate(
  value: string | number | Date | null | undefined,
  fallback = "Not available",
): string {
  if (value == null || value === "") return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toLocaleDateString();
}
