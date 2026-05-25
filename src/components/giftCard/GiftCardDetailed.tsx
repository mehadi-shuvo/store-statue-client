"use client";

import Image from "next/image";
import { useState } from "react";

interface GiftCardAmount {
  BDT: number;
  popular: boolean;
  cardUSD: number;
  discount?: string;
}

interface GiftCardDetailProductProps {
  brand: string;
  title: string;
  image: string;
  amounts: GiftCardAmount[];
  currency?: string;
  onAddToCart?: (amount: number) => void;
  onInstantBuy?: (amount: number) => void;
}

const brandAccentColors: Record<string, string> = {
  amazon: "text-orange-600",
  steam: "text-blue-700",
  playstation: "text-blue-600",
  xbox: "text-green-600",
  google: "text-blue-500",
  apple: "text-gray-700",
  default: "text-purple-600",
};

export default function GiftCardDetailed({
  brand,
  title,
  image,
  amounts,
  currency = "$",
  onAddToCart,
  onInstantBuy,
}: GiftCardDetailProductProps) {
  const [selectedAmount, setSelectedAmount] = useState(amounts[0]?.BDT || 0);
  const selectedAmountData = amounts.find(
    (item) => item.BDT === selectedAmount,
  );
  const selectedAmountInUSD = selectedAmountData?.cardUSD || 0;
  const accentColor =
    brandAccentColors[brand.toLowerCase()] || brandAccentColors.default;

  const formatCurrency = (amount: number): string =>
    `${currency}${amount.toFixed(2)}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Image Gallery */}
        <div className="lg:w-1/2 p-6 md:p-8 bg-gray-50 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src={image}
              alt={`${brand} Gift Card`}
              fill
              className="object-contain p-4"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:w-1/2 p-6 md:p-8">
          {/* Brand & Title */}
          <div className="mb-4">
            <span
              className={`text-sm font-semibold ${accentColor} uppercase tracking-wider`}
            >
              {brand}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              {title}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                ⚡ Instant Delivery
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                Digital Gift Card
              </span>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="mb-6">
            <h3 className="text-gray-800 font-semibold flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                💰
              </span>
              Select Amount
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amounts.map((item) => (
                <button
                  key={item.BDT}
                  onClick={() => setSelectedAmount(item.BDT)}
                  className={`relative p-3 rounded-xl border-2 transition-all ${
                    selectedAmount === item.BDT
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                      Popular
                    </div>
                  )}
                  <div className="text-center">
                    <div
                      className={`font-bold ${selectedAmount === item.BDT ? "text-blue-700" : "text-gray-900"}`}
                    >
                      {formatCurrency(item.cardUSD)}
                    </div>
                    {item.discount && (
                      <div className="text-green-600 text-xs mt-1">
                        {item.discount}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Amount Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Total amount:</span>
              <span className="text-2xl font-bold text-gray-900">
                {selectedAmount} TK
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">You pay (USD):</span>
              <span className="font-semibold text-gray-900">
                {currency}
                {selectedAmountInUSD}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Delivery:</span>
              <span className="text-green-600">📧 Email (Instant)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onInstantBuy?.(selectedAmount)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-2 shadow-md"
            >
              <span>⚡</span> Buy Now – {currency}
              {selectedAmountInUSD}
            </button>
            <button
              onClick={() => onAddToCart?.(selectedAmount)}
              className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              🛒 Add to Cart
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  ✓
                </div>
                <div>Secure Payment</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  ⚡
                </div>
                <div>Instant Delivery</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  ↻
                </div>
                <div>Easy Returns</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                  24/7
                </div>
                <div>Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
