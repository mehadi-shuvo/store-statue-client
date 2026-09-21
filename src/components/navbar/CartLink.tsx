import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartLink({ quantity }: { quantity: number }) {
  const accessibleQuantity =
    quantity > 0 ? `, ${quantity} item${quantity === 1 ? "" : "s"}` : "";

  return (
    <Link
      href="/cart"
      aria-label={`Cart${accessibleQuantity}`}
      className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-700 text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {quantity > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[10px] font-black leading-none text-white ring-2 ring-slate-950">
          {quantity > 99 ? "99+" : quantity}
        </span>
      ) : null}
    </Link>
  );
}
