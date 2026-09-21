"use client";

import { ApiEmpty, ApiErrorState } from "@/components/ApiState";
import GiftCardProductCard from "@/components/gift-card/GiftCardProductCard";
import { useGiftCardCatalog } from "@/hooks/api/use-gift-card-api";
import type { GiftCardProduct } from "@/types/gift-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HomeSectionHeading from "./HomeSectionHeading";

const FEATURED_FILTERS = { page: 1, limit: 6 } as const;

export function prioritizeGiftCards(cards: GiftCardProduct[]) {
  return [...cards]
    .sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured) || (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .slice(0, 4);
}

function GiftCardSkeletons() {
  return (
    <div role="status" aria-label="Loading featured gift cards" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="h-48 animate-pulse bg-slate-100" />
          <div className="space-y-3 p-5"><div className="h-3 w-20 animate-pulse rounded bg-slate-100" /><div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" /><div className="h-8 w-32 animate-pulse rounded bg-slate-100" /></div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedGiftCards() {
  const query = useGiftCardCatalog(FEATURED_FILTERS);
  const cards = prioritizeGiftCards(query.data?.data ?? []);

  return (
    <section className="bg-slate-50 py-16 sm:py-20" aria-labelledby="featured-gift-cards-title">
      <div className="mx-auto w-11/12 max-w-7xl">
        <HomeSectionHeading
          eyebrow="Gift Card catalog"
          titleId="featured-gift-cards-title"
          title="Featured Gift Cards"
          description="A compact selection from the current live catalog, prioritized by configured featured status and display order."
          action={<Link href="/gift-cards" className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">View All Gift Cards <ArrowRight className="h-4 w-4" /></Link>}
        />
        {query.isLoading ? (
          <GiftCardSkeletons />
        ) : query.isError ? (
          <ApiErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : cards.length === 0 ? (
          <ApiEmpty title="No Gift Cards are available" description="The catalog has not published any Gift Cards yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => <GiftCardProductCard key={card.id} card={card} />)}
          </div>
        )}
      </div>
    </section>
  );
}
