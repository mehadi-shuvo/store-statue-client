"use client";

import { ApiEmpty } from "@/components/ApiState";
import GameTopUpProductCard from "@/components/game-top-up/GameTopUpProductCard";
import type { GameTopUp } from "@/types/game-top-up";
import { Gamepad2, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

export default function GameTopUpCatalog({ games }: { games: GameTopUp[] }) {
  const [search, setSearch] = useState("");
  const visibleGames = useMemo(() => {
    const term = search.trim().toLowerCase();
    return games
      .filter((game) => game.isActive)
      .filter((game) => !term || [game.name, game.title, game.subHeading, game.gameCurrencyName].some((value) => value?.toLowerCase().includes(term)))
      .sort((left, right) => Number(right.isFeatured) - Number(left.isFeatured) || left.sortOrder - right.sortOrder);
  }, [games, search]);

  return (
    <main className="min-h-screen bg-slate-50 pb-20 pt-[72px]">
      <section className="overflow-hidden bg-slate-950 text-white" aria-labelledby="top-up-catalog-title">
        <div className="mx-auto grid w-11/12 max-w-7xl gap-10 py-14 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
              <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
              Game Top-Ups
            </span>
            <h1 id="top-up-catalog-title" className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Choose your game. Then choose your package.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Browse supported games, compare package prices in BDT, and review the player information needed for each Top-Up request.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-100">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Secure payment powered by aamarPay
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="ml-auto max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-300">Top-Up flow</p>
              <ol className="mt-5 space-y-3 text-sm font-semibold text-slate-200">
                {["Select a game", "Choose a package", "Enter player details", "Proceed to payment"].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 rounded-xl border border-slate-700 px-4 py-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-500/20 text-xs text-indigo-200">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-11/12 max-w-7xl py-10">
        <label className="relative block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="sr-only">Search games</span>
          <Search className="absolute left-8 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by game or currency"
            className="min-h-12 w-full rounded-2xl border border-slate-200 py-3 pl-12 pr-4 text-sm text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        <div className="mb-6 mt-9 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700"><SlidersHorizontal className="h-4 w-4" aria-hidden="true" />Catalog</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Available games</h2>
          </div>
          <p className="text-sm text-slate-500">{visibleGames.length} game{visibleGames.length === 1 ? "" : "s"}</p>
        </div>

        {visibleGames.length ? (
          <section aria-label="Game Top-Up catalog" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visibleGames.map((game) => <GameTopUpProductCard key={game.id} game={game} />)}
          </section>
        ) : (
          <ApiEmpty title="No games found" description="Try a different game or currency name." />
        )}
      </div>
    </main>
  );
}
