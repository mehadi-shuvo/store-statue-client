"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  SearchInput,
  StatusBadge,
  formatCurrency,
  paginate,
} from "@/components/admin/AdminUi";
import {
  getDigitalProductOverview,
  getProducts,
  type AdminProduct,
  type DigitalProductOverview,
  type ProductResourceType,
  type ProductStatus,
} from "@/lib/admin";
import { useCallback, useEffect, useState } from "react";

const pageSize = 10;
type DigitalType = ProductResourceType;
const digitalTypes: DigitalType[] = ["GIFT_CARD", "GAME_TOP_UP", "SUBSCRIPTION"];

export default function DigitalProductsPage() {
  const [overview, setOverview] = useState<DigitalProductOverview | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DigitalType | "">("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [nextOverview, nextProducts] = await Promise.all([
        getDigitalProductOverview(),
        getProducts({
          search: search.trim() || undefined,
          type: type || undefined,
          status: status || undefined,
          limit: 100,
        }),
      ]);
      setOverview(nextOverview ?? null);
      setProducts(nextProducts.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, [search, status, type]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadProducts, 250);
    return () => window.clearTimeout(timeoutId);
  }, [loadProducts]);

  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const rows = paginate(products, page, pageSize);
  const counts = overview?.counts;

  return (
    <AdminShell>
      <PageHeader eyebrow="Catalog" title="Digital products" description="Inspect gift cards, game top-ups, subscriptions, stock, and active status." />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Gift cards", counts?.giftCards ?? 0],
          ["Top-ups", counts?.topUps ?? 0],
          ["Subscriptions", counts?.subscriptions ?? 0],
          ["Inactive", counts?.inactiveDigitalProducts ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search products..." />
        <select value={type} onChange={(event) => { setType(event.target.value as DigitalType | ""); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="">All types</option>
          {digitalTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={status} onChange={(event) => { setStatus(event.target.value as ProductStatus | ""); setPage(1); }} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <option value="">All statuses</option>
          {["DRAFT","ACTIVE","INACTIVE","OUT_OF_STOCK","ARCHIVED"].map(item => <option key={item}>{item}</option>)}
        </select>
      </div>
      {loading ? <LoadingState label="Loading digital products..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadProducts} /> : null}
      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Sales</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3"><p className="font-semibold">{product.title}</p><p className="text-xs text-slate-500">{product.category?.title}</p></td>
                      <td className="px-4 py-3"><StatusBadge value={product.productType} /></td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(Math.min(...(product.productType === "GIFT_CARD" ? product.denominations : product.productType === "GAME_TOP_UP" ? product.packages : product.plans).map(option => Number(option.sellingPriceBDT))))}</td>
                      <td className="px-4 py-3">{(product.productType === "GIFT_CARD" ? product.denominations : product.productType === "GAME_TOP_UP" ? product.packages : product.plans).reduce((sum, option) => sum + Number(option.stockQuantity ?? 0), 0)}</td>
                      <td className="px-4 py-3"><StatusBadge value={product.status} /></td>
                      <td className="px-4 py-3">—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : <EmptyState title="No digital products found" />
      ) : null}
    </AdminShell>
  );
}
