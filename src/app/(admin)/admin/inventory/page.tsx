"use client";

import AdminShell from "@/components/admin/AdminShell";
import { EmptyState, ErrorState, LoadingState, PageHeader, SearchInput, StatusBadge, formatCurrency } from "@/components/admin/AdminUi";
import { getProducts, type AdminProduct, type PricedOption } from "@/lib/admin";
import { Warehouse } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function optionsFor(product: AdminProduct): PricedOption[] {
  return product.productType === "GIFT_CARD" ? product.denominations : product.productType === "GAME_TOP_UP" ? product.packages : product.plans;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getProducts({ search: search.trim() || undefined, limit: 100 });
      setProducts(result.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not load inventory.");
    } finally {
      setLoading(false);
    }
  }, [search]);
  useEffect(() => {
    const timer = window.setTimeout(loadProducts, 250);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);
  const metrics = useMemo(() => {
    const rows = products.flatMap(optionsFor);
    const tracked = rows.filter(option => option.stockQuantity !== null && option.stockQuantity !== undefined);
    return {
      totalStock: tracked.reduce((total, option) => total + Number(option.stockQuantity), 0),
      lowStock: tracked.filter(option => Number(option.stockQuantity) > 0 && Number(option.stockQuantity) <= 5).length,
      outOfStock: tracked.filter(option => Number(option.stockQuantity) <= 0).length,
      inactive: products.filter(product => product.status === "INACTIVE").length,
    };
  }, [products]);
  return <AdminShell>
    <PageHeader eyebrow="Operations" title="Inventory" description="Stock is managed per denomination, package, or plan from the product editor." />
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[
      ["Tracked stock", metrics.totalStock], ["Low-stock options", metrics.lowStock], ["Out-of-stock options", metrics.outOfStock], ["Inactive products", metrics.inactive],
    ].map(([label, value]) => <div key={label} className="rounded-2xl border bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase text-slate-400">{label}</p><p className="mt-2 text-2xl font-black">{value}</p></div>)}</div>
    <div className="mb-5 rounded-3xl border bg-white p-4"><SearchInput value={search} onChange={setSearch} placeholder="Search inventory..." /></div>
    {loading ? <LoadingState label="Loading stock levels..." /> : null}
    {error && !loading ? <ErrorState message={error} onRetry={loadProducts} /> : null}
    {!loading && !error ? products.length ? <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm"><table className="w-full min-w-[760px] text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Options</th><th className="px-4 py-3">Price range</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Status</th></tr></thead>
      <tbody className="divide-y">{products.map(product => {
        const options = optionsFor(product);
        const prices = options.map(option => Number(option.sellingPriceBDT));
        const tracked = options.filter(option => option.stockQuantity !== null && option.stockQuantity !== undefined);
        const stock = tracked.reduce((total, option) => total + Number(option.stockQuantity), 0);
        return <tr key={product.id}><td className="px-4 py-3"><span className="inline-flex items-center gap-2 font-semibold"><Warehouse className="h-4 w-4" />{product.title}</span></td><td className="px-4 py-3">{product.productType}</td><td className="px-4 py-3">{options.length}</td><td className="px-4 py-3 font-semibold">{formatCurrency(Math.min(...prices))} – {formatCurrency(Math.max(...prices))}</td><td className="px-4 py-3">{tracked.length ? stock : "Unlimited"}</td><td className="px-4 py-3"><StatusBadge value={product.status} /></td></tr>;
      })}</tbody>
    </table></div> : <EmptyState title="No inventory found" /> : null}
  </AdminShell>;
}
