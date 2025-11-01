"use client";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    brand: string;
    rating: number;
    reviewCount: number;
    tags?: string[];
    features?: string[];
    stock: number;
  };
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onBuyNow?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onBuyNow,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:scale-[1.02] group">
      {/* Product Image Section */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{discount}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button
            onClick={() => onQuickView?.(product.id)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <span className="text-gray-700 text-lg">👁️</span>
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
            <span className="text-gray-700 text-lg">❤️</span>
          </button>
        </div>

        {/* Product Image */}
        <div className="relative h-64 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain transition-all duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            } ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setIsImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />

          {/* Loading Skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-400">📱</span>
            </div>
          )}
        </div>

        {/* Hover Overlay with Actions */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="p-4 w-full">
            <button
              onClick={() => onBuyNow?.(product.id)}
              disabled={product.stock === 0}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 mb-2 ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              }`}
            >
              {product.stock === 0 ? "Out of Stock" : "Buy Now"}
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs text-white">
              <div className="flex items-center gap-1 justify-center">
                <span>🚚</span>
                Free Shipping
              </div>
              <div className="flex items-center gap-1 justify-center">
                <span>🔄</span>
                30-Day Return
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category & Brand */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 font-medium">
            {product.category}
          </span>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {product.brand}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {product.rating}
          </span>
          <span className="text-sm text-gray-400">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {product.features?.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onAddToCart?.(product.id)}
            disabled={product.stock === 0}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <span className="text-lg">🛒</span>
            Add to Cart
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs">
                ✓
              </span>
              In Stock: {product.stock}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                🚀
              </span>
              Fast Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
