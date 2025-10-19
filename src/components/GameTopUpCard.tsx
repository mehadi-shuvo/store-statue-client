"use client";
import Image from "next/image";
import { useState } from "react";

const GameTopUpCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const gameCurrencyName = "Diamonds";

  const topUpAmounts = [
    { realCurrency: 5, gameCurrency: 100, popular: false },
    { realCurrency: 10, gameCurrency: 200, popular: true },
    { realCurrency: 20, gameCurrency: 400, popular: false },
    { realCurrency: 50, gameCurrency: 600, popular: false },
    { realCurrency: 100, gameCurrency: 10000, popular: false },
    { realCurrency: 200, gameCurrency: 100000, popular: false },
  ];

  return (
    <div className="max-w-md bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-purple-500/25 border border-purple-500/20">
      {/* Game Header with Logo */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
        <div className="md:flex space-y-2 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                G
              </span>
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Genshin Impact</h2>
              <p className="text-white/80 text-sm">Genesis Crystals Top-Up</p>
            </div>
          </div>
          <div className="bg-black/30 rounded-full px-3 py-1 border border-white/20 text-center">
            <span className="text-white text-sm font-semibold text-center">
              ⚡ Instant
            </span>
          </div>
        </div>
      </div>

      {/* Game Background Image */}
      <div
        className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="https://images.pexels.com/photos/7005690/pexels-photo-7005690.jpeg"
          alt="Genshin Impact Game Art"
          fill
          className="object-cover mix-blend-overlay opacity-40"
        />

        {/* Hover Overlay with Game Info */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/50 to-transparent flex items-end justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white p-6 text-center w-full">
            <h3 className="font-bold text-lg mb-2">💎 Genesis Crystals</h3>
            <p className="text-sm text-gray-300">
              Purchase Genesis Crystals to exchange for Primogems and other
              in-game items
            </p>
          </div>
        </div>

        {/* Floating Game Characters */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">⚡</span>
        </div>
      </div>

      {/* Top-Up Amount Selection */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">💰</span>
            Select Amount
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {topUpAmounts.map((item) => (
              <button
                key={item.realCurrency}
                onClick={() => setSelectedAmount(item.realCurrency)}
                className={`relative p-3 rounded-xl border-2 transition-all duration-200 ${
                  selectedAmount === item.realCurrency
                    ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20"
                    : "border-gray-600 bg-gray-800/50 hover:border-purple-400"
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Best
                  </div>
                )}
                <div className="text-center">
                  <div className="text-white font-bold text-lg">
                    ${item.realCurrency}
                  </div>
                  <div className="text-green-400 text-xs font-semibold">
                    {item.gameCurrency} {gameCurrencyName}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bonus Information */}
        {/* <div className="bg-black/30 rounded-xl p-4 mb-6 border border-purple-500/30">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white">
              <span className="text-yellow-400">🎁</span> You Get:
            </div>
            <div className="text-green-400 font-bold">
              {selectedAmount * 100} + {selectedAmount * 5} Crystals
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="text-gray-400">Total Value:</div>
            <div className="text-white font-semibold">
              ${(selectedAmount * 1.05).toFixed(2)}
            </div>
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-1 md:gap-3 text-sm md:text-lx">
            <span className="textarea-md md:text-lx">⚡</span>
            <span> Instant Top-Up - ${selectedAmount}</span>
            <span className="text-yellow-300 hidden md:block">🎁</span>
          </button>

          <button className="w-full border-2 border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2">
            <span>🛒</span>
            Add to Cart
          </button>
        </div>

        {/* Security Features */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="text-green-400">🛡️</span>
              Secure
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400">⚡</span>
              Instant
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">🎮</span>
              Official
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-400">❤️</span>
              24/7 Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTopUpCard;
