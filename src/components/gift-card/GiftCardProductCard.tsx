import { formatMoney, lowestAvailableDenomination, productImage } from "@/lib/gift-card";
import type { GiftCardProduct } from "@/types/gift-card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function GiftCardProductCard({ card }: { card: GiftCardProduct }) {
  const lowest = lowestAvailableDenomination(card.denominations);
  const soldOut = !lowest;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <Link href={`/gift-cards/${card.slug}`} className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600">
        <div className="relative h-48 bg-slate-50">
          <Image
            src={productImage(card)}
            alt={`${card.name || card.title} gift card artwork`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            className={`object-contain p-6 transition-transform duration-300 group-hover:scale-[1.03] ${soldOut ? "grayscale opacity-60" : ""}`}
          />
          {soldOut ? (
            <span className="absolute right-4 top-4 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">
              Out of stock
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {card.brand}
            </span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              Digital
            </span>
          </div>
          <h3 className="mt-3 line-clamp-2 min-h-12 text-lg font-black text-slate-950">
            {card.name || card.title}
          </h3>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div>
              <span className="text-xs text-slate-500">
                {soldOut ? "Currently unavailable" : "Starting from"}
              </span>
              <p className="mt-1 text-xl font-black text-slate-950">
                {lowest ? formatMoney(lowest.sellingPriceBdt, "BDT") : "—"}
              </p>
            </div>
            <span className={`inline-flex items-center gap-1 text-sm font-bold ${soldOut ? "text-slate-500" : "text-blue-700"}`}>
              View <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
