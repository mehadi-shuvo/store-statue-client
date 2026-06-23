"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionHeader from "./SectionHeader";
import {
  CategoryDisplay,
  getCategoryFallbackIcon,
  normalizeCategory,
  parseCategoriesPayload,
} from "@/lib/categories";
import { API_BASE_URL } from "@/lib/api";

type CategoriesApiResponse = unknown;

const FEATURED_LIMIT = 8;

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

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

        setCategories(normalized.slice(0, FEATURED_LIMIT));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setCategories([]);
        setError(err instanceof Error ? err.message : "Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();

    return () => controller.abort();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50 mb-12">
      <SectionHeader
        title="Shop by Category"
        subtitle="Find what you need faster with a live category feed from the API."
        href="/accessories"
        badge="Easy to Find"
      />

      <div className="w-11/12 md:w-4/5 mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {Array.from({ length: FEATURED_LIMIT }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="aspect-[4/3] animate-pulse rounded-[1.25rem] bg-slate-100" />
                <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
                <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {categories.map((category, index) => {
              const FallbackIcon = getCategoryFallbackIcon(category.title);

              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    index === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative bg-gradient-to-br from-slate-100 to-slate-50 ${
                      index === 0 ? "aspect-[16/12] md:aspect-[4/3]" : "aspect-[4/3]"
                    }`}
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-md">
                          <FallbackIcon className="h-8 w-8" />
                        </div>
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Image space
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                        Category
                      </p>
                      <h3 className="mt-1 text-base font-bold text-white md:text-lg">
                        {category.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {category.description || "Explore the latest products in this category."}
                      </p>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-slate-950 group-hover:text-white">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
