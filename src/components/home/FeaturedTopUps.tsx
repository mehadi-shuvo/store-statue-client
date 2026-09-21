"use client";

import { ApiEmpty, ApiErrorState } from "@/components/ApiState";
import GameTopUpProductCard from "@/components/game-top-up/GameTopUpProductCard";
import { usePublicGames } from "@/hooks/api/use-game-top-up-api";
import type { GameTopUp } from "@/types/game-top-up";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HomeSectionHeading from "./HomeSectionHeading";

const FEATURED_GAME_FILTERS = { page: 1, limit: 6 } as const;

export function prioritizeGames(games: GameTopUp[]) {
  return [...games]
    .filter((game) => game.isActive)
    .sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured) || left.sortOrder - right.sortOrder)
    .slice(0, 4);
}

function GameSkeletons() {
  return (
    <div role="status" aria-label="Loading featured games" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="h-48 animate-pulse bg-slate-100" />
          <div className="space-y-3 p-5"><div className="h-3 w-24 animate-pulse rounded bg-slate-100" /><div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" /><div className="h-8 w-32 animate-pulse rounded bg-slate-100" /></div>
        </div>
      ))}
    </div>
  );
}

export default function FeaturedTopUps() {
  const query = usePublicGames(FEATURED_GAME_FILTERS);
  const games = prioritizeGames(query.data?.data ?? []);

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="featured-games-title">
      <div className="mx-auto w-11/12 max-w-7xl">
        <HomeSectionHeading
          eyebrow="Supported games"
          titleId="featured-games-title"
          title="Featured Game Top-Ups"
          description="Browse a small selection from the currently active game catalog and compare configured package availability."
          action={<Link href="/top-up" className="inline-flex items-center gap-2 text-sm font-black text-indigo-700 hover:text-indigo-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">View All Games <ArrowRight className="h-4 w-4" /></Link>}
        />
        {query.isLoading ? (
          <GameSkeletons />
        ) : query.isError ? (
          <ApiErrorState error={query.error} onRetry={() => query.refetch()} />
        ) : games.length === 0 ? (
          <ApiEmpty title="No games are available" description="No active Game Top-Up products are currently published." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {games.map((game) => <GameTopUpProductCard key={game.id} game={game} />)}
          </div>
        )}
      </div>
    </section>
  );
}
