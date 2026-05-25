"use client";

import Image from "next/image";
import Link from "next/link";

interface GiftCardHomeCardProps {
  id: string;
  brand: string;
  title: string;
  image: string;
  startingPrice: number;
  currency?: string;
}

const brandColorClasses: Record<string, string> = {
  amazon: "hover:border-orange-200",
  steam: "hover:border-blue-300",
  playstation: "hover:border-blue-300",
  xbox: "hover:border-green-300",
  google: "hover:border-blue-300",
  apple: "hover:border-gray-400",
  default: "hover:border-purple-200",
};

export default function GiftCArdSm({
  id,
  brand,
  title,
  image,
  startingPrice,
  currency = "$",
}: GiftCardHomeCardProps) {
  const borderHoverClass =
    brandColorClasses[brand.toLowerCase()] || brandColorClasses.default;

  return (
    <Link href={`/gift-cards/${id}`} className="block group">
      <div
        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${borderHoverClass} hover:scale-[1.02]`}
      >
        {/* Image Container */}
        <div className="relative h-40 bg-gray-50">
          <Image
            src={image}
            alt={`${brand} Gift Card`}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {brand}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Digital
            </span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xs text-gray-500">Starting from</span>
              <p className="text-lg font-bold text-gray-900">
                {currency}
                {startingPrice}
              </p>
            </div>
            <div className="text-blue-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
              Buy Now →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
