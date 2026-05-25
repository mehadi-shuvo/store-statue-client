"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;

    price: number;
    offerPercent?: number;

    photos: string[];
    features: string[];

    stockQuantity: number;

    category: {
      title: string;
    };

    reviews: {
      rating: number;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();

  const onAddToCart = async (id: string) => {
    await addToCart(id, 1);
  };

  // ⭐ Average Rating
  const avgRating =
    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
    (product.reviews.length || 1);

  const price = Number(product.price);
  // ✅ Discount Price
  const finalPrice =
    product.offerPercent && product.offerPercent > 0
      ? product.price - (product.price * product.offerPercent) / 100
      : price;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition group">
      {/* Image */}
      <div
        className="relative h-60 bg-gray-50 flex items-center justify-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Offer Badge */}
        {product.offerPercent ? (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 text-xs rounded-full font-bold">
            -{product.offerPercent}%
          </span>
        ) : null}

        {/* Stock Badge */}
        {product.stockQuantity === 0 && (
          <span className="absolute top-3 right-3 bg-gray-700 text-white px-3 py-1 text-xs rounded-full">
            Out of Stock
          </span>
        )}

        {/* Product Image */}
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.photos?.[0] || "/placeholder.png"}
            alt={product.title}
            fill
            className={`object-contain transition duration-500 ${
              hovered ? "scale-110" : "scale-100"
            }`}
          />
        </Link>
      </div>

      {/* Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs text-gray-500">{product.category.title}</p>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          {" "}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600">
            {product.title}
          </h3>
        </Link>
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          ⭐ <span className="text-sm">{avgRating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">
            ({product.reviews.length} reviews)
          </span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-3">
          {product.features.slice(0, 3).map((f, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xl font-bold text-gray-900">
            ${finalPrice?.toFixed(2)}
          </span>

          {product.offerPercent ? (
            <span className="text-sm line-through text-gray-400">
              ${price?.toFixed(2)}
            </span>
          ) : null}
        </div>

        {/* Button */}
        <button
          onClick={() => onAddToCart(product.id)}
          disabled={product.stockQuantity === 0}
          className={`w-full mt-4 py-3 rounded-xl font-semibold transition cursor-pointer ${
            product.stockQuantity === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
}
