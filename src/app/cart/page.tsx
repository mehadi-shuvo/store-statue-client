"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const shipping = subtotal > 200 ? 0 : subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  if (!user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] pt-[148px]">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-16 text-center shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-white">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
              Sign in to access your cart
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Your saved items, quantity updates, and checkout summary are
              available after login.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Go to login
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/accessories"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Keep shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] pt-[148px]">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-16 text-center shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Add products from accessories, gifts, or product pages to build
              your order here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/accessories"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Explore accessories
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] pt-[148px] pb-16">
      <div className="w-11/12 lg:w-4/5 mx-auto">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.2),_transparent_25%)]" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Secure cart
                </span>
                <h1 className="mt-5 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                  Review your items and head to checkout when you’re ready.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Your cart stays aligned with the current storefront theme,
                  with clearer pricing, stock, and checkout controls.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/accessories"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                  >
                    Continue shopping
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    <ShieldCheck className="h-4 w-4" />
                    Secure checkout
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Items
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {cartItems.length}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Shipping
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </p>
                </div>
                <div className="col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-100">
                    Cart total
                  </p>
                  <p className="mt-2 text-3xl font-black text-white">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Shopping cart
                </h2>
                <p className="text-sm text-slate-500">
                  Manage quantities, compare savings, and remove items you no
                  longer need.
                </p>
              </div>
            </div>

            {cartItems.map((item) => {
              const product = item.product;

              if (!product) {
                return (
                  <article
                    key={item.id}
                    className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm"
                  >
                    Cart item data is incomplete.
                  </article>
                );
              }

              const price =
                product.offerPercent && product.offerPercent > 0
                  ? product.price -
                    (product.price * product.offerPercent) / 100
                  : product.price;
              const outOfStock = product.stockQuantity <= 0;

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                >
                  <div className="grid gap-0 md:grid-cols-[170px_1fr]">
                    <Link
                      href={`/product/${product.id}`}
                      className="relative min-h-[170px] bg-gradient-to-b from-slate-50 to-white"
                    >
                      <Image
                        src={product.photos?.[0] || "/placeholder.png"}
                        alt={product.title}
                        fill
                        className={`object-contain p-5 ${
                          outOfStock ? "grayscale opacity-50" : ""
                        }`}
                        sizes="(max-width: 768px) 100vw, 170px"
                      />
                      {outOfStock && (
                        <span className="absolute left-4 top-4 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                          Out of stock
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-col justify-between p-5">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                              Accessory
                            </p>
                            <Link
                              href={`/product/${product.id}`}
                              className="mt-2 block text-xl font-bold text-slate-900 transition hover:text-blue-600"
                            >
                              {product.title}
                            </Link>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            Qty {item.quantity}
                          </span>
                          {product.offerPercent ? (
                            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                              {product.offerPercent}% off
                            </span>
                          ) : null}
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            {product.stockQuantity} in stock
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-500">
                            ${price.toFixed(2)} each
                          </p>
                          <p className="text-2xl font-extrabold text-slate-950">
                            ${(price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="min-w-12 text-center text-base font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= product.stockQuantity}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-32">
            <h2 className="text-xl font-bold text-slate-900">Order summary</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-500">Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-500">Total</span>
                <span className="text-lg font-black text-slate-950">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              Proceed to checkout
            </button>

            <div className="mt-4 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                Secure and simple checkout
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                You’re one step away from completing your order.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
