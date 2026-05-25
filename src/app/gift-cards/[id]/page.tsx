"use client";

import { notFound } from "next/navigation";
import SimilarGiftCards from "@/components/giftCard/SimilarGiftCards";
import { giftCards } from "@/utils/giftCardData";
import GiftCardDetailed from "@/components/giftCard/GiftCardDetailed";
import Link from "next/link";

interface PageProps {
  params: {
    id: string;
  };
}

export default function GiftCardDetailPage({ params }: PageProps) {
  const giftCard = giftCards.find((card) => card.id === params.id);

  if (!giftCard) {
    notFound();
  }

  // Find similar cards: same brand first, then any other card
  const similarCards = giftCards.filter(
    (card) =>
      card.brand.toLowerCase() === giftCard.brand.toLowerCase() &&
      card.id !== giftCard.id,
  );
  // If not enough same-brand cards, add others (up to 4)
  const otherCards = giftCards
    .filter((card) => card.brand.toLowerCase() !== giftCard.brand.toLowerCase())
    .slice(0, 4 - similarCards.length);
  const finalSimilar = [...similarCards, ...otherCards];

  const handleAddToCart = (amount: number) => {
    alert(`Added ${giftCard.title} worth ${amount} TK to cart!`);
    console.log("Add to cart:", { product: giftCard.id, amount });
  };

  const handleInstantBuy = (amount: number) => {
    alert(`Proceeding to checkout for ${giftCard.title} worth ${amount} TK`);
    console.log("Instant buy:", { product: giftCard.id, amount });
    // router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-gray-50 mt-[148px] md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/gift-cards"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Back to all gift cards
        </Link>

        {/* Main Product */}
        <GiftCardDetailed
          brand={giftCard.brand}
          title={giftCard.title}
          image={giftCard.image}
          amounts={giftCard.amounts}
          currency={giftCard.currency}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
        />

        {/* Similar Cards Section */}
        <SimilarGiftCards
          currentCardId={giftCard.id}
          similarCards={finalSimilar}
        />
      </div>
    </main>
  );
}
