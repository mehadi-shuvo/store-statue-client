"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw, Search, Sparkles } from "lucide-react";
import ProductCardSm from "@/components/ProductCardSm";
import { TProduct } from "@/types/top-up/productsType";
import { API_BASE_URL } from "@/lib/api";

const PAGE_SIZE = 12;

type ProductApiResponse = {
  data?: {
    data?: TProduct[];
    meta?: {
      totalPage?: number;
      totalPages?: number;
    };
  };
  products?: TProduct[];
  meta?: {
    totalPage?: number;
    totalPages?: number;
  };
};

function getProductsPayload(payload: unknown): TProduct[] {
  const candidateSources = [
    (payload as ProductApiResponse)?.data?.data,
    (payload as ProductApiResponse)?.products,
    (payload as ProductApiResponse)?.data,
    payload,
  ];

  for (const source of candidateSources) {
    if (Array.isArray(source)) {
      return source as TProduct[];
    }
  }

  return [];
}

function getTotalPages(payload: unknown) {
  const response = payload as ProductApiResponse;
  const meta = response?.data?.meta ?? response?.meta;
  const totalPages = meta?.totalPage ?? meta?.totalPages;

  return typeof totalPages === "number" && totalPages > 0 ? totalPages : 1;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load decoration products.";
}

export default function DecorationPage() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const fetchProducts = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams({
          limit: String(PAGE_SIZE),
          page: String(page),
          sort,
          order,
        });

        if (activeSearch.trim()) {
          query.set("search", activeSearch.trim());
        }

        const response = await fetch(
          `${API_BASE_URL}/api/products?${query.toString()}`,
          { signal },
        );

        let payload: unknown = null;

        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          const message =
            (payload as { message?: string })?.message ||
            `Request failed with status ${response.status}`;
          throw new Error(message);
        }

        setProducts(getProductsPayload(payload));
        setTotalPages(getTotalPages(payload));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setProducts([]);
        setTotalPages(1);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [page, sort, order, activeSearch],
  );

  useEffect(() => {
    const controller = new AbortController();
    void fetchProducts(controller.signal);

    return () => controller.abort();
  }, [fetchProducts]);

  const onSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setSort("createdAt");
    setOrder("desc");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.12),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#fff7fb_100%)]">
      <section className="pt-[148px] pb-12">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 text-white shadow-2xl">
            <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.32),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.18),_transparent_25%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Decoration collection
                  </span>

                  <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                    Decorative pieces that bring warmth, texture, and personality.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Browse a refined selection of decor products with the same
                    modern shopping experience as accessories. Search, sort, and
                    shop with ease.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="#catalog"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                    >
                      Browse catalog
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reset filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Products
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {loading ? "..." : products.length}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Page size
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {PAGE_SIZE}
                    </p>
                  </div>
                  <div className="col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/20 to-indigo-500/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-rose-100">
                      Current sort
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                        {sort === "createdAt" ? "Newest" : "Price"}
                      </span>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                        {order === "asc" ? "Ascending" : "Descending"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Refine the catalog
              </p>
              <p className="text-xs text-slate-400">
                Search and sort the decoration catalog just like the accessories page.
              </p>
            </div>

            <form onSubmit={onSubmitSearch} className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search decoration"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-rose-500 sm:w-64"
                />
              </div>

              <select
                value={sort}
                onChange={(e) => {
                  setPage(1);
                  setSort(e.target.value);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500"
              >
                <option value="createdAt">Newest first</option>
                <option value="price">Price</option>
              </select>

              <select
                value={order}
                onChange={(e) => {
                  setPage(1);
                  setOrder(e.target.value);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-rose-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>

              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section id="catalog" className="pb-16">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-20 text-center shadow-sm backdrop-blur">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">
                Loading decoration products...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-bold text-rose-700">
                We could not load the decoration catalog
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-rose-600">
                {error}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => fetchProducts()}
                  className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Try again
                </button>
                <button
                  onClick={clearFilters}
                  className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-16 text-center shadow-sm backdrop-blur">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No decoration products found
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Try a different search term or sort order to explore more items.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {products.length}
                  </span>{" "}
                  product{products.length !== 1 ? "s" : ""} on page {page} of{" "}
                  {totalPages}
                </p>
                {activeSearch ? (
                  <p className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                    Search: {activeSearch}
                  </p>
                ) : (
                  <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Full decoration catalog
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCardSm key={product.id} product={product} />
                ))}
              </div>
            </>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
