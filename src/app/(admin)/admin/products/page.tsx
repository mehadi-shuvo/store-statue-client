"use client";

import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/ProductForm";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  SearchInput,
  StatusBadge,
  formatCurrency,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProductById,
  getProducts,
  updateProduct,
  type AdminCategory,
  type AdminProduct,
  type AdminProductPayload,
  type ProductResourceType,
  type ProductStatus,
  type ProductUploadFiles,
} from "@/lib/admin";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const pageSize = 10;
const productTypes: ProductResourceType[] = ["GIFT_CARD", "GAME_TOP_UP", "SUBSCRIPTION"];
const statuses: ProductStatus[] = ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED"];

function changedFields(product: AdminProduct, payload: AdminProductPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => {
      const currentValue = (product as unknown as Record<string, unknown>)[key];
      return JSON.stringify(currentValue ?? undefined) !== JSON.stringify(value ?? undefined);
    }),
  ) as Partial<AdminProductPayload>;
}

function getStartingPrice(product: AdminProduct) {
  const options = product.productType === "GIFT_CARD"
    ? product.denominations
    : product.productType === "GAME_TOP_UP"
      ? product.packages
      : product.plans;
  const prices = options
    .map((option) => Number(option.sellingPriceBDT))
    .filter((price) => Number.isFinite(price));

  return prices.length ? formatCurrency(Math.min(...prices)) : "—";
}

export function AdminProductsCatalog({ lockedType }: { lockedType?: ProductResourceType } = {}) {
  const toast = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ProductResourceType | "">("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<ProductResourceType>("GIFT_CARD");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [nextProducts, nextCategories] = await Promise.all([
        getProducts({
          page,
          limit: pageSize,
          search: search.trim() || undefined,
          type: lockedType || type || undefined,
          status: status || undefined,
        }),
        getCategories(),
      ]);
      setProducts(nextProducts.data);
      setPageCount(nextProducts.meta.totalPages);
      setCategories(nextCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, [lockedType, page, search, status, type]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadProducts, 250);
    return () => window.clearTimeout(timeoutId);
  }, [loadProducts]);

  const [pageCount, setPageCount] = useState(1);
  const rows = products;
  const lowStockCount = useMemo(() => products.filter((product) => {
    const options = product.productType === "GIFT_CARD" ? product.denominations : product.productType === "GAME_TOP_UP" ? product.packages : product.plans;
    return options.some(option => option.stockQuantity !== null && option.stockQuantity !== undefined && option.stockQuantity <= 5);
  }).length, [products]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormType(lockedType || type || "GIFT_CARD");
    setFormOpen(true);
  };

  const openEdit = async (product: AdminProduct) => {
    try {
      setSubmitting(true);
      const detail = await getProductById(product.id, product.productType);
      setEditingProduct(detail ?? product);
      setFormType(product.productType);
      setFormOpen(true);
    } catch (err) {
      toast.error("Could not open product", err instanceof Error ? err.message : "Could not load product details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (payload: AdminProductPayload, files: ProductUploadFiles) => {
    try {
      setSubmitting(true);
      if (editingProduct) {
        const patch = changedFields(editingProduct, payload);
        if (Object.keys(patch).length === 0 && !files.image && !files.bannerImage) {
          toast.success("No changes to save");
          setFormOpen(false);
          return;
        }
        await updateProduct(editingProduct.productType, editingProduct.id, patch, files);
        toast.success("Product updated");
      } else {
        await createProduct(formType, payload, files);
        toast.success("Product created");
      }
      setFormOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      toast.error("Save failed", err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      await deleteProduct(deleteTarget.productType, deleteTarget.id);
      const label = deleteTarget.productType === "GIFT_CARD" ? "Gift card" : deleteTarget.productType === "GAME_TOP_UP" ? "Game top-up" : "Subscription";
      toast.success(`${label} archived successfully.`);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      toast.error("Delete failed", err instanceof Error ? err.message : "Could not delete product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Catalog"
        title={lockedType === "SUBSCRIPTION" ? "Subscriptions" : "Products"}
        description={lockedType === "SUBSCRIPTION" ? "Manage subscription products, plans, availability, and customer pricing." : "A high-level catalog overview across every digital product type."}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New product
          </button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Products</p>
          <p className="mt-2 text-2xl font-black">{products.length}</p>
        </div>
        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Low stock</p>
          <p className="mt-2 text-2xl font-black text-amber-700">{lowStockCount}</p>
        </div>
        <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Inactive</p>
          <p className="mt-2 text-2xl font-black text-rose-700">{products.filter((product) => product.status === "INACTIVE").length}</p>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
        <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search products..." />
        {!lockedType ? <select value={type} onChange={(event) => { setType(event.target.value as ProductResourceType | ""); setPage(1); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="">All types</option>
          {productTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select> : null}
        <select value={status} onChange={(event) => { setStatus(event.target.value as ProductStatus | ""); setPage(1); }} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
          <option value="">All statuses</option>
          {statuses.map(item => <option key={item}>{item}</option>)}
        </select>
      </div>

      {loading ? <LoadingState label="Loading products..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadProducts} /> : null}

      {!loading && !error ? (
        rows.length > 0 ? (
          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-950">{product.title}</p>
                        <p className="text-xs text-slate-500">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3"><StatusBadge value={product.productType} /></td>
                      <td className="px-4 py-3 text-slate-600">{product.category?.title || product.category?.name || "Unassigned"}</td>
                      <td className="px-4 py-3 font-semibold">{getStartingPrice(product)}</td>
                      <td className="px-4 py-3">{(product.productType === "GIFT_CARD" ? product.denominations : product.productType === "GAME_TOP_UP" ? product.packages : product.plans).length} options</td>
                      <td className="px-4 py-3"><StatusBadge value={product.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => openEdit(product)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-semibold">
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          <button type="button" onClick={() => setDeleteTarget(product)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 font-semibold text-rose-700">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4"><Pagination page={page} pageCount={pageCount} onPageChange={setPage} /></div>
          </div>
        ) : <EmptyState title="No products found" />
      ) : null}

      {formOpen ? (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/70 px-4 py-6">
          <div className="mx-auto max-w-6xl rounded-[1.5rem] bg-slate-100 p-5 shadow-2xl">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-950">{editingProduct ? "Edit product" : "Create product"}</h2>
                <p className="mt-1 text-sm text-slate-500">Saved through the specialized {formType.replaceAll("_", " ").toLowerCase()} API.</p>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold">Close</button>
            </div>
            {!editingProduct ? <div className="mb-5"><label className="text-sm font-semibold">Product type<select className="ml-3 rounded-xl border bg-white px-3 py-2" value={formType} onChange={event => setFormType(event.target.value as ProductResourceType)}>{productTypes.map(item => <option key={item}>{item}</option>)}</select></label></div> : null}
            <ProductForm key={`${editingProduct?.id ?? "new"}-${formType}`} type={formType} categories={categories} product={editingProduct} submitting={submitting} submitLabel={editingProduct ? "Update product" : "Create product"} onSubmit={handleSubmit} />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Archive product"
        description={`Archive ${deleteTarget?.title ?? "this product"}? It will no longer appear in active catalog results.`}
        confirmLabel="Archive product"
        loading={submitting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}

export default function AdminProductsPage() { return <AdminProductsCatalog />; }
