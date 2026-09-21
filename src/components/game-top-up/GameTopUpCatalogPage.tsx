"use client";

import { ApiErrorState, ApiLoading } from "@/components/ApiState";
import { usePublicGames } from "@/hooks/api/use-game-top-up-api";
import GameTopUpCatalog from "./GameTopUpCatalog";

export default function GameTopUpCatalogPage() {
  const query = usePublicGames({ page: 1, limit: 100 });
  if (query.isLoading) return <main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-7xl py-8"><ApiLoading label="Loading games…" /></div></main>;
  if (query.isError) return <main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-7xl py-8"><ApiErrorState error={query.error} onRetry={() => query.refetch()} /></div></main>;
  return <GameTopUpCatalog games={query.data?.data ?? []} />;
}
