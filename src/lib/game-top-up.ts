import type { GameTopUp } from "@/types/game-top-up";
import type { TTopUpData } from "@/types/top-up/topUpCardType";

export function getGameSetupStatus(game: GameTopUp) {
  if (!game.isActive) return { label: "Inactive", detail: "Activate the game when setup is complete.", ready: false };
  if (!game.packages.some(item => item.isActive)) return { label: "Setup Required", detail: "No active packages configured.", ready: false };
  if (!game.accountFields.some(item => item.isActive)) return { label: "Setup Required", detail: "No player information fields configured.", ready: false };
  return { label: "Ready", detail: "Packages and player information are configured.", ready: true };
}

export function toCustomerTopUpCardData(game: GameTopUp): TTopUpData {
  return {
    id: game.id || "preview",
    name: game.name || "Game name",
    subHeading: game.subHeading || "Game top-up",
    title: game.title || game.name || "Game top-up",
    description: game.description || "Add a description to explain this top-up to customers.",
    logo: game.logoUrl || "/window.svg",
    banner: game.bannerUrl || game.logoUrl || "/window.svg",
    gameCurrencyName: game.gameCurrencyName || "Credits",
    topUpAmounts: game.packages.filter(item => item.isActive).map(item => ({ realCurrency: Number(item.priceBdt), gameCurrency: item.coinAmount + item.bonusAmount, popular: item.isPopular })),
    priceCurrency: "BDT",
  };
}
