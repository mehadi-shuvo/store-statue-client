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

const GiftCard: React.FC<GiftCardProps> = ({
  brand,
  title,
  image,
  currency = "$",
  onAddToCart,
  onInstantBuy,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(25);

  const giftCardAmounts = [
    { amount: 10, popular: false, bonus: "" },
    { amount: 25, popular: true, bonus: "Popular" },
    { amount: 50, popular: false, bonus: "Great Value" },
    { amount: 100, popular: false, bonus: "Best Value" },
  ];

  const brandColors: { [key: string]: string } = {
    amazon: "bg-orange-500",
    steam: "bg-blue-600",
    playstation: "bg-blue-500",
    xbox: "bg-green-500",
    google: "bg-blue-400",
    apple: "bg-gray-600",
    default: "bg-purple-500",
  };

  const brandColor = brandColors[brand.toLowerCase()] || brandColors.default;

  return (
    <div className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200">
      {/* Brand Header */}
      <div className={`${brandColor} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-xl font-bold text-gray-800">
                {brand.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">{brand}</h2>
              <p className="text-white/90 text-sm">Digital Gift Card</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1 border border-white/30">
            <span className="text-white text-sm font-semibold">⚡ Instant</span>
          </div>
        </div>
      </div>

      {/* Gift Card Image */}
      <div
        className="relative h-48 bg-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={image}
          alt={`${brand} Gift Card`}
          fill
          className="object-contain p-6"
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white p-6 text-center">
            <h3 className="font-bold text-lg mb-2">🎁 Perfect Gift</h3>
            <p className="text-sm text-gray-200">
              Email delivery • No shipping fees • Works instantly
            </p>
          </div>
        </div>
      </div>

      {/* Gift Card Content */}
      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">Choose your gift amount</p>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <h3 className="text-gray-700 font-semibold mb-3 flex items-center gap-2">
            <span>💰</span>
            Select Amount
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {giftCardAmounts.map((item) => (
              <button
                key={item.amount}
                onClick={() => setSelectedAmount(item.amount)}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                  selectedAmount === item.amount
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.bonus}
                  </div>
                )}
                <div className="text-center">
                  <div className="text-gray-800 font-bold text-lg">
                    {currency}
                    {item.amount}
                  </div>
                  {item.bonus && !item.popular && (
                    <div className="text-green-600 text-xs font-medium mt-1">
                      {item.bonus}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Amount Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Selected:</span>
            <span className="text-gray-800 font-bold text-lg">
              {currency}
              {selectedAmount}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Delivery:</span>
            <span className="text-green-600 font-medium">Email (Instant)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onInstantBuy?.(selectedAmount)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>⚡</span>
            Buy Now - {currency}
            {selectedAmount}
          </button>

          <button
            onClick={() => onAddToCart?.(selectedAmount)}
            className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🛒</span>
            Add to Cart
          </button>
        </div>

        {/* Features */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>📧</span>
              Email Delivery
            </div>
            <div className="flex items-center gap-2">
              <span>⚡</span>
              Instant
            </div>
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              Secure
            </div>
            <div className="flex items-center gap-2">
              <span>💳</span>
              Flexible
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCard;
