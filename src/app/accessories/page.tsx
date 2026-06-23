"use client";

import React, { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PackageSearch,
  RefreshCcw,
  Search,
} from "lucide-react";
import ProductCardSm from "@/components/ProductCardSm";
import { TProduct } from "@/types/top-up/productsType";
import {
  CategoryDisplay,
  findAccessoriesCategoryId,
  getCategoryFallbackIcon,
  normalizeCategory,
  parseCategoriesPayload,
} from "@/lib/categories";
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

type CategoriesApiResponse = unknown;

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

  return "Failed to load accessories. Please try again.";
}

export default function AccessoriesPage() {
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [accessoryCategoryId, setAccessoryCategoryId] = useState("");
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError("");

        const response = await fetch(`${API_BASE_URL}/api/categories`, {
          signal: controller.signal,
        });

        let payload: CategoriesApiResponse = null;

        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          const message =
            (payload as { message?: string })?.message ||
            `Failed to load categories (${response.status})`;
          throw new Error(message);
        }

        const normalized = parseCategoriesPayload(payload)
          .map(normalizeCategory)
          .filter((category): category is CategoryDisplay => Boolean(category));

        setCategories(normalized);
        setAccessoryCategoryId(findAccessoriesCategoryId(normalized));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setCategories([]);
        setAccessoryCategoryId("");
        setCategoriesError(
          err instanceof Error ? err.message : "Failed to load categories.",
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    void loadCategories();

    return () => controller.abort();
  }, []);

  const fetchAccessories = useCallback(
    async (signal?: AbortSignal) => {
      if (!accessoryCategoryId) {
        setError("Accessories category is not configured.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const query = new URLSearchParams({
          limit: String(PAGE_SIZE),
          page: String(page),
          sort,
          order,
          categories: accessoryCategoryId,
        });

        if (activeSearch.trim()) {
          query.set("search", activeSearch.trim());
        }

        const response = await fetch(
          `${API_BASE_URL}/api/products?${query.toString()}`,
          {
            signal,
          },
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

        const nextProducts = getProductsPayload(payload);
        setProducts(nextProducts);
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
    [page, sort, order, activeSearch, accessoryCategoryId],
  );

  useEffect(() => {
    if (!accessoryCategoryId) {
      return;
    }

    const controller = new AbortController();
    void fetchAccessories(controller.signal);

    return () => controller.abort();
  }, [fetchAccessories, accessoryCategoryId]);

  const onSubmitSearch = (event: FormEvent<HTMLFormElement>) => {
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

  const featuredCategories = categories.slice(0, 6);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <section className="pt-[148px] pb-12">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 text-white shadow-2xl">
            <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.2),_transparent_25%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    <PackageSearch className="h-3.5 w-3.5" />
                    Curated collection
                  </span>

                  <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                    Premium accessories built for everyday performance.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Explore the accessories collection and discover the latest
                    gear for smarter workspaces, better audio, and more
                    convenient charging.
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
                        Categories
                      </p>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {categoriesLoading ? "..." : categories.length}
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
                  <div className="col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">
                      Quick search
                    </p>
                    <form onSubmit={onSubmitSearch} className="mt-3 flex gap-3">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          value={searchInput}
                          onChange={(event) => setSearchInput(event.target.value)}
                          placeholder="Search accessories"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
                        />
                      </div>
                      <button
                        type="submit"
                        className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                      >
                        Go
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          {categoriesError ? (
            <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm font-medium text-rose-700">
              {categoriesError}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.length === 0 && categoriesLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="aspect-[4/3] animate-pulse rounded-[1.25rem] bg-slate-100" />
                      <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  ))
                : featuredCategories.map((category) => {
                    const FallbackIcon = getCategoryFallbackIcon(category.title);

                    return (
                      <Link
                        key={category.id}
                        href={category.href}
                        className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, 16vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-md">
                                <FallbackIcon className="h-7 w-7" />
                              </div>
                              <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Image space
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-sm font-bold text-slate-900">
                            {category.title}
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-slate-500 line-clamp-2">
                            {category.description ||
                              "Tap to browse the latest products in this category."}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
            </div>
          )}
        </div>
      </section>

      <section className="pb-6">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-sm font-medium text-slate-500">Sort products</p>
              <p className="text-xs text-slate-400">
                Prioritize the newest releases or compare by price.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sort}
                onChange={(event) => {
                  setPage(1);
                  setSort(event.target.value);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
              >
                <option value="createdAt">Newest first</option>
                <option value="price">Price</option>
              </select>

              <select
                value={order}
                onChange={(event) => {
                  setPage(1);
                  setOrder(event.target.value);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="pb-16">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          {accessoryCategoryId ? null : categoriesLoading ? null : categoriesError ? null : (
            <div className="mb-6 rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-medium text-amber-800">
              Accessories category was not detected from the API. Showing the
              catalog once it becomes available.
            </div>
          )}
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-20 text-center shadow-sm backdrop-blur">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">
                Loading accessories...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-bold text-red-700">
                We could not load the catalog
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-red-600">
                {error}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => fetchAccessories()}
                  className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Try again
                </button>
                <button
                  onClick={clearFilters}
                  className="rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Reset filters
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-16 text-center shadow-sm backdrop-blur">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <PackageSearch className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No accessories matched your filters
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Try a different search term or clear the filters to explore the
                full collection.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Show all accessories
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
                  <p className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Search: {activeSearch}
                  </p>
                ) : (
                  <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Full accessories catalog
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
