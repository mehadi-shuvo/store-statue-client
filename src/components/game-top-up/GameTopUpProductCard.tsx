import { formatMoney } from "@/lib/gift-card";
import type { GameTopUp } from "@/types/game-top-up";
import { ArrowRight, Gamepad2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function lowestPackagePrice(game: GameTopUp) {
  return game.packages
    .filter((item) => item.isActive && (item.stockQuantity == null || item.stockQuantity > 0))
    .map((item) => item.priceBdt)
    .filter((value) => Number.isFinite(Number(value)))
    .sort((left, right) => Number(left) - Number(right))[0];
}

export default function GameTopUpProductCard({ game }: { game: GameTopUp }) {
  const activePackages = game.packages.filter((item) => item.isActive);
  const startingPrice = lowestPackagePrice(game);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <Link href={`/top-up/${game.slug}`} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600">
        <div className="relative grid h-48 place-items-center bg-slate-50">
          {game.logoUrl ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={game.logoUrl}
                alt={`${game.name} logo`}
                fill
                unoptimized
                sizes="96px"
                className="object-contain p-2"
              />
            </div>
          ) : (
            <span className="grid h-24 w-24 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
              <Gamepad2 className="h-10 w-10" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
              Game Top-Up
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {activePackages.length} package{activePackages.length === 1 ? "" : "s"}
            </span>
          </div>
          <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-black text-slate-950">
            {game.name || game.title}
          </h3>
          <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
            {game.subHeading || `Select a ${game.gameCurrencyName || "game currency"} package.`}
          </p>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div>
              <span className="text-xs text-slate-500">
                {startingPrice != null ? "Starting from" : "Packages"}
              </span>
              <p className="mt-1 text-xl font-black text-slate-950">
                {startingPrice != null ? formatMoney(startingPrice, "BDT") : "Being configured"}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-700">
              View <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
