"use client";

import { ApiEmpty, ApiErrorState } from "@/components/ApiState";
import GiftCardProductCard from "@/components/gift-card/GiftCardProductCard";
import { useGiftCardCatalog } from "@/hooks/api/use-gift-card-api";
import { useDebounce } from "@/hooks/useDebounce";
import { Gift, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

function CatalogSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading gift cards"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
        >
          <div className="h-48 animate-pulse bg-slate-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-8 w-32 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GiftCardCatalog() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search.trim(), 350);
  const filters = useMemo(
    () => ({
      page,
      limit: 20,
      search: debouncedSearch || undefined,
      brand: brand || undefined,
      minPriceBdt: minPrice || undefined,
      maxPriceBdt: maxPrice || undefined,
    }),
    [brand, debouncedSearch, maxPrice, minPrice, page],
  );
  const query = useGiftCardCatalog(filters);
  const cards = useMemo(() => query.data?.data ?? [], [query.data?.data]);
  const brands = useMemo(
    () => [...new Set(cards.map((card) => card.brand).filter(Boolean))].sort(),
    [cards],
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-18">
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto grid w-11/12 max-w-7xl gap-10 py-24 lg:grid-cols-[1.2fr_.8fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[.2em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Digital gifts
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              The right gift, delivered in moments.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Choose a trusted brand and a stocked denomination. Prices shown in
              BDT come directly from the catalog—no exchange-rate estimates.
            </p>
          </div>
          <div className="hidden items-center justify-center lg:flex">
            <div className="grid h-52 w-72 rotate-3 place-items-center rounded-[2rem] bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 shadow-2xl shadow-blue-500/20">
              <Gift className="h-20 w-20" />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto w-11/12 max-w-7xl py-10">
        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_150px_150px]">
          <label className="relative">
            <span className="sr-only">Search gift cards</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search gift cards"
              className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="sr-only">Brand</span>
            <select
              value={brand}
              onChange={(event) => {
                setBrand(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option value="">All brands</option>
              {brands.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Minimum BDT price</span>
            <input
              inputMode="decimal"
              value={minPrice}
              onChange={(event) => {
                setMinPrice(event.target.value.replace(/[^\d.]/g, ""));
                setPage(1);
              }}
              placeholder="Min ৳"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </label>
          <label>
            <span className="sr-only">Maximum BDT price</span>
            <input
              inputMode="decimal"
              value={maxPrice}
              onChange={(event) => {
                setMaxPrice(event.target.value.replace(/[^\d.]/g, ""));
                setPage(1);
              }}
              placeholder="Max ৳"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </label>
        </div>
        <div className="mb-6 mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-blue-700">
              <SlidersHorizontal className="h-4 w-4" />
              Catalog
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Gift cards
            </h2>
          </div>
          {query.data ? (
            <p className="text-sm text-slate-500">
              {query.data.meta.total} result
              {query.data.meta.total === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
        {query.isLoading ? (
          <CatalogSkeleton />
        ) : query.isError ? (
          <ApiErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : cards.length === 0 ? (
          <ApiEmpty
            title="No gift cards found"
            description="Try changing your search or price filters."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <GiftCardProductCard key={card.id} card={card} />
            ))}
          </div>
        )}
        {query.data && query.data.meta.totalPages > 1 ? (
          <nav
            aria-label="Gift card pagination"
            className="mt-10 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page <= 1 || query.isFetching}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {page} of {query.data.meta.totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((value) =>
                  Math.min(query.data!.meta.totalPages, value + 1),
                )
              }
              disabled={page >= query.data.meta.totalPages || query.isFetching}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        ) : null}
      </div>
    </main>
  );
}
