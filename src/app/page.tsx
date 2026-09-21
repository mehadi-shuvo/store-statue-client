import type { Metadata } from "next";
import AccountCallout from "@/components/home/AccountCallout";
import FaqSection from "@/components/home/FaqSection";
import FeaturedGiftCards from "@/components/home/FeaturedGiftCards";
import FeaturedTopUps from "@/components/home/FeaturedTopUps";
import FinalCallToAction from "@/components/home/FinalCallToAction";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import ServiceSelector from "@/components/home/ServiceSelector";
import TrustSection from "@/components/home/TrustSection";
import { isPublicFeatureEnabled } from "@/features/feature-config";

export const metadata: Metadata = {
  title: "Digital Gift Cards & Game Top-Ups",
  description:
    "Browse digital Gift Cards and supported Game Top-Ups with clear BDT pricing and account-based order workflows from GameXpress.",
};

export default function Home() {
  const giftCardsEnabled = isPublicFeatureEnabled("giftCards");
  const gameTopUpEnabled = isPublicFeatureEnabled("gameTopUp");

  return (
    <main className="min-h-screen bg-white pt-[72px]">
      <HeroSection
        giftCardsEnabled={giftCardsEnabled}
        gameTopUpEnabled={gameTopUpEnabled}
      />
      <ServiceSelector
        giftCardsEnabled={giftCardsEnabled}
        gameTopUpEnabled={gameTopUpEnabled}
      />
      {giftCardsEnabled ? <FeaturedGiftCards /> : null}
      {gameTopUpEnabled ? <FeaturedTopUps /> : null}
      <HowItWorks
        giftCardsEnabled={giftCardsEnabled}
        gameTopUpEnabled={gameTopUpEnabled}
      />
      <TrustSection
        giftCardsEnabled={giftCardsEnabled}
        gameTopUpEnabled={gameTopUpEnabled}
      />
      <AccountCallout />
      <FaqSection
        giftCardsEnabled={giftCardsEnabled}
        gameTopUpEnabled={gameTopUpEnabled}
      />
      <FinalCallToAction
        giftCardsEnabled={giftCardsEnabled}
        gameTopUpEnabled={gameTopUpEnabled}
      />
    </main>
  );
}
