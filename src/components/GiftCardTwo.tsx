"use client";
import Image from "next/image";
import { useState } from "react";

interface GiftCardProps {
  brand: string;
  title: string;
  image: string;
  currency?: string;
  onAddToCart?: (amount: number) => void;
  onInstantBuy?: (amount: number) => void;
}

interface GiftCardAmount {
  BDT: number;
  popular: boolean;
  cardUSD: number;
  discount?: string;
}

const GiftCardTwo: React.FC<GiftCardProps> = ({
  brand,
  title,
  image,
  currency = "$",
  onAddToCart,
  onInstantBuy,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(1000);

  const giftCardAmounts: GiftCardAmount[] = [
    { BDT: 500, popular: false, cardUSD: 5 },
    { BDT: 1000, popular: true, cardUSD: 10 },
    { BDT: 1500, popular: false, cardUSD: 25 },
    { BDT: 2000, popular: false, cardUSD: 50 },
  ];

  const selectedAmountInUSD = (bdt: number) => {
    const amount = giftCardAmounts.find((i) => i.BDT === bdt);
    return amount?.cardUSD;
  };

  const brandColors: {
    [key: string]: { bg: string; text: string; hover: string };
  } = {
    amazon: {
      bg: "bg-gradient-to-r from-orange-400 to-orange-600",
      text: "text-white",
      hover: "hover:from-orange-500 hover:to-orange-700",
    },
    steam: {
      bg: "bg-gradient-to-r from-blue-700 to-blue-900",
      text: "text-white",
      hover: "hover:from-blue-800 hover:to-blue-950",
    },
    playstation: {
      bg: "bg-gradient-to-r from-blue-500 to-blue-700",
      text: "text-white",
      hover: "hover:from-blue-600 hover:to-blue-800",
    },
    xbox: {
      bg: "bg-gradient-to-r from-green-500 to-green-700",
      text: "text-white",
      hover: "hover:from-green-600 hover:to-green-800",
    },
    google: {
      bg: "bg-gradient-to-r from-blue-400 to-blue-600",
      text: "text-white",
      hover: "hover:from-blue-500 hover:to-blue-700",
    },
    apple: {
      bg: "bg-gradient-to-r from-gray-600 to-gray-800",
      text: "text-white",
      hover: "hover:from-gray-700 hover:to-gray-900",
    },
    default: {
      bg: "bg-gradient-to-r from-purple-500 to-purple-700",
      text: "text-white",
      hover: "hover:from-purple-600 hover:to-purple-800",
    },
  };

  const brandColor = brandColors[brand.toLowerCase()] || brandColors.default;

  const formatCurrency = (amount: number): string => {
    return `${currency}${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-gray-100 hover:scale-[1.02]">
      {/* Brand Header */}
      <div
        className={`${brandColor.bg} ${brandColor.text} p-6 relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative z-10 md:flex justify-between items-center">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-sm backdrop-blur-sm border border-white/30">
                <span className="text-xl font-bold text-white">
                  {brand.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl tracking-tight">
                  {brand}
                </h2>
                <p className="text-white/90 text-sm">Digital Gift Card</p>
              </div>
            </div>
          </div>

          {/* Instant Badge */}
          <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/30">
            <span className="text-white text-xs font-semibold">
              ⚡ Instant Delivery
            </span>
          </div>
        </div>
      </div>

      {/* Gift Card Image */}
      <div
        className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={image}
          alt={`${brand} Gift Card`}
          fill
          className="object-contain p-6 transition-transform duration-300 hover:scale-105"
          //   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          unoptimized
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex items-end justify-center transition-all duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white p-6 text-center mb-4">
            <h3 className="font-bold text-lg mb-2">🎁 Perfect Digital Gift</h3>
            <p className="text-sm text-gray-200">
              Email delivery • No shipping fees • Instant activation
            </p>
          </div>
        </div>
      </div>

      {/* Gift Card Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-gray-600 text-sm">Choose your gift amount</p>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-semibold flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                💰
              </span>
              Select Amount
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Required
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {giftCardAmounts.map((item) => (
              <button
                key={item.BDT}
                onClick={() => setSelectedAmount(item.BDT)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 group ${
                  selectedAmount === item.BDT
                    ? `border-blue-500 bg-blue-50 shadow-md scale-105`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full shadow-sm">
                    Popular
                  </div>
                )}
                <div className="text-center">
                  <div
                    className={`font-bold text-lg transition-colors ${
                      selectedAmount === item.BDT
                        ? "text-blue-700"
                        : "text-gray-900"
                    }`}
                  >
                    {formatCurrency(item.cardUSD)}
                  </div>
                  {item.discount && (
                    <div className="text-green-600 text-xs font-medium mt-1 bg-green-50 px-2 py-1 rounded-full">
                      {item.discount}
                    </div>
                  )}
                  {/* {item.cardUSD && !item.popular && (
                    <div className="text-gray-600 text-xs font-medium mt-1">
                      {item.cardUSD}
                    </div>
                  )} */}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Amount Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Selected Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              {selectedAmount} TK
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Delivery Method:</span>
            <span className="text-green-600 font-semibold flex items-center gap-1">
              <span>📧</span>
              Email (Instant)
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onInstantBuy?.(selectedAmount)}
            className={`w-full ${brandColor.bg} ${brandColor.hover} text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            <span className="text-lg">⚡</span>
            <span className="flex-1 text-center">
              Buy Now - {currency}
              {selectedAmountInUSD(selectedAmount)}
            </span>
          </button>

          <button
            onClick={() => onAddToCart?.(selectedAmount)}
            className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">
              🛒
            </span>
            <span className="flex-1 text-center">Add to Cart</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                ✓
              </div>
              <div>
                <div className="text-gray-900 font-medium">Secure</div>
                <div className="text-gray-500 text-xs">Payment</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                ⚡
              </div>
              <div>
                <div className="text-gray-900 font-medium">Instant</div>
                <div className="text-gray-500 text-xs">Delivery</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                ↻
              </div>
              <div>
                <div className="text-gray-900 font-medium">Easy</div>
                <div className="text-gray-500 text-xs">Returns</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                24/7
              </div>
              <div>
                <div className="text-gray-900 font-medium">Support</div>
                <div className="text-gray-500 text-xs">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardTwo;
