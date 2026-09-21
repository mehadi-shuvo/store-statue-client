"use client";

import { ApiErrorState, ApiLoading } from "@/components/ApiState";
import { usePublicGame } from "@/hooks/api/use-game-top-up-api";
import GameTopUpDetails from "./GameTopUpDetails";

export default function GameTopUpDetailsPage({ slug }: { slug: string }) {
  const query = usePublicGame(slug);
  if (query.isLoading) return <main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-7xl py-8"><ApiLoading label="Loading game packages…" /></div></main>;
  if (query.isError) return <main className="min-h-screen bg-slate-50 pb-20 pt-20"><div className="mx-auto w-11/12 max-w-7xl py-8"><ApiErrorState error={query.error} onRetry={() => query.refetch()} /></div></main>;
  return query.data ? <GameTopUpDetails game={query.data} /> : null;
}
