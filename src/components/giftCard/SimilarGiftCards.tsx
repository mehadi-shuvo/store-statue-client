import Link from "next/link";
import Image from "next/image";
import { GiftCard } from "@/utils/giftCardData";

interface SimilarGiftCardsProps {
  currentCardId: string;
  similarCards: GiftCard[];
}

export default function SimilarGiftCards({
  currentCardId,
  similarCards,
}: SimilarGiftCardsProps) {
  // Filter out current card and limit to 4
  const cardsToShow = similarCards
    .filter((card) => card.id !== currentCardId)
    .slice(0, 4);

  if (cardsToShow.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Similar Gift Cards
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardsToShow.map((card) => (
          <Link href={`/gift-cards/${card.id}`} key={card.id} className="group">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="relative h-32 bg-gray-50">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain p-3"
                  unoptimized
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                  {card.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  From {card.currency}
                  {card.amounts[0]?.cardUSD}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
