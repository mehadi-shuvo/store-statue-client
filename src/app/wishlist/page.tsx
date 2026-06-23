"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const {
    wishlistItems,
    wishlistCount,
    loading,
    error,
    removeFromWishlist,
    clearWishlist,
    isWishlisted,
    toggleWishlist,
  } = useWishlist();
  const { addToCart } = useCart();

  const stats = useMemo(
    () => ({
      saved: wishlistCount,
      inStock: wishlistItems.filter(
        (item) => (item.stockQuantity ?? 0) > 0,
      ).length,
      discounted: wishlistItems.filter(
        (item) =>
          typeof item.offerPercent === "number" &&
          item.offerPercent > 0 &&
          item.offerPercent < 100,
      ).length,
    }),
    [wishlistCount, wishlistItems],
  );

  const moveToCart = async (productId: string) => {
    await addToCart(productId, 1);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.12),_transparent_28%),linear-gradient(180deg,_#fff7fb_0%,_#f8fafc_100%)]">
      <section className="pt-[148px] pb-10">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="overflow-hidden rounded-[2rem] border border-rose-100 bg-slate-950 text-white shadow-2xl">
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="relative px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.18),_transparent_25%)]" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-100">
                    <Heart className="h-3.5 w-3.5" />
                    Saved for later
                  </span>
                  <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                    Your wishlist, organized like a premium shopping experience.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Keep track of products you love, compare them before buying,
                    and move items to cart when you’re ready.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/accessories"
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                    >
                      Shop accessories
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Browse products
                    </Link>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Saved
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {stats.saved}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      In stock
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {stats.inStock}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Offers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {stats.discounted}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-300">
                  We keep your wishlist locally on this device, so it stays fast,
                  lightweight, and private.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          {loading ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/80 px-6 py-20 text-center shadow-sm backdrop-blur">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-500 border-t-transparent" />
              <p className="mt-4 text-sm text-slate-500">
                Loading your wishlist...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-16 text-center shadow-sm">
              <h2 className="text-xl font-bold text-rose-700">
                Wishlist needs attention
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-rose-600">
                {error}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={clearWishlist}
                  className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Reset wishlist
                </button>
                <Link
                  href="/accessories"
                  className="rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-16 text-center shadow-sm backdrop-blur">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
                <Heart className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Your wishlist is empty
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Save products while browsing and they’ll appear here with full
                context, pricing, and stock status.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/accessories"
                  className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore accessories
                </Link>
                <Link
                  href="/products"
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Browse all products
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Saved items
                  </h2>
                  <p className="text-sm text-slate-500">
                    Compare, remove, or move items to cart when you’re ready.
                  </p>
                </div>

                <button
                  onClick={clearWishlist}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear all
                </button>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
                <div className="space-y-4">
                  {wishlistItems.map((item) => {
                    const price = Number(item.price) || 0;
                    const discount =
                      typeof item.offerPercent === "number"
                        ? item.offerPercent
                        : 0;
                    const finalPrice =
                      discount > 0 && discount < 100
                        ? price - (price * discount) / 100
                        : price;
                    const outOfStock = (item.stockQuantity ?? 0) <= 0;
                    const wished = isWishlisted(item.id);

                    return (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                      >
                        <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                          <Link
                            href={`/product/${item.id}`}
                            className="relative min-h-[180px] bg-gradient-to-b from-slate-50 to-white"
                          >
                            <Image
                              src={item.photos?.[0] || "/placeholder.png"}
                              alt={item.title}
                              fill
                              className={`object-contain p-5 ${
                                outOfStock ? "grayscale opacity-50" : ""
                              }`}
                              sizes="(max-width: 768px) 100vw, 180px"
                            />
                          </Link>

                          <div className="flex flex-col justify-between p-5">
                            <div>
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                    {item.category?.title || "Accessories"}
                                  </p>
                                  <Link
                                    href={`/product/${item.id}`}
                                    className="mt-2 block text-xl font-bold text-slate-900 transition hover:text-blue-600"
                                  >
                                    {item.title}
                                  </Link>
                                </div>

                                <button
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                  aria-label="Remove from wishlist"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              {item.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                  {item.description}
                                </p>
                              )}

                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    outOfStock
                                      ? "bg-slate-100 text-slate-500"
                                      : "bg-emerald-50 text-emerald-700"
                                  }`}
                                >
                                  {outOfStock ? "Out of stock" : "In stock"}
                                </span>

                                {discount > 0 && discount < 100 && (
                                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                                    {discount}% off
                                  </span>
                                )}

                                {item.features?.slice(0, 3).map((feature) => (
                                  <span
                                    key={feature}
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                              <div>
                                <p className="text-2xl font-extrabold text-slate-950">
                                  ${finalPrice.toFixed(2)}
                                </p>
                                {discount > 0 && discount < 100 && (
                                  <p className="text-sm text-slate-400 line-through">
                                    ${price.toFixed(2)}
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => moveToCart(item.id)}
                                  disabled={outOfStock}
                                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  Add to cart
                                </button>
                                <button
                                  onClick={() =>
                                    toggleWishlist({
                                      ...item,
                                      offerPercent: item.offerPercent ?? null,
                                    })
                                  }
                                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                                    wished
                                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  }`}
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      wished ? "fill-rose-600 text-rose-600" : ""
                                    }`}
                                  />
                                  {wished ? "Saved" : "Save again"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">
                    Wishlist summary
                  </h3>
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-500">Total saved</span>
                      <span className="font-semibold text-slate-900">
                        {wishlistCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-500">Available now</span>
                      <span className="font-semibold text-emerald-600">
                        {stats.inStock}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-sm text-slate-500">On sale</span>
                      <span className="font-semibold text-rose-600">
                        {stats.discounted}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
                    <p className="text-sm font-medium text-slate-300">
                      Need a faster decision?
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      Save your shortlist here, then jump to the accessories and
                      product pages to compare details side by side.
                    </p>
                  </div>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
