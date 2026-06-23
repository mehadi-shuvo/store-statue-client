"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    offerPercent?: number;
    photos: string[];
    stockQuantity: number;
  };
}

export default function ProductCardSm({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const price = Number(product.price) || 0;
  const discount = Number(product.offerPercent) || 0;
  const hasDiscount = discount > 0 && discount < 100;
  const finalPrice = hasDiscount ? price - (price * discount) / 100 : price;
  const isOutOfStock = product.stockQuantity === 0;
  const wished = isWishlisted(product.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-gray-300">
      {/* Image Container - Fixed height and width */}
      <Link
        href={`/product/${product.id}`}
        className="relative w-full bg-gradient-to-b from-gray-50 to-white overflow-hidden"
        style={{ aspectRatio: "1/1" }}
      >
        <Image
          src={product.photos?.[0] || "/placeholder.png"}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-contain p-4 transition-transform duration-500 group-hover:scale-110 ${
            isOutOfStock ? "grayscale opacity-50" : ""
          }`}
        />

        {/* Like Button - Top Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist({
              id: product.id,
              title: product.title,
              price: product.price,
              offerPercent: product.offerPercent ?? null,
              photos: product.photos,
              stockQuantity: product.stockQuantity,
            });
          }}
          aria-pressed={wished}
          className="absolute right-4 top-4 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 shadow-md"
          aria-label="Like product"
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${
              wished
                ? "fill-red-500 stroke-red-500"
                : "stroke-gray-400 hover:stroke-red-400"
            }`}
          />
        </button>

        {/* Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {discount}% OFF
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm">
            <span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-gray-900 shadow-lg uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <Link
          href={`/product/${product.id}`}
          className="flex-1 block group/title"
        >
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 transition-colors group-hover/title:text-blue-600 mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Pricing Section */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-lg sm:text-2xl font-extrabold text-gray-900">
            ${finalPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product.id, 1)}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 active:scale-95 ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:shadow-xl"
          }`}
        >
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
