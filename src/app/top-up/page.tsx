import type { Metadata } from "next";
import GameTopUpCatalogPage from "@/components/game-top-up/GameTopUpCatalogPage";

export const metadata: Metadata = {
  title: "Game Top-Ups",
  description: "Browse supported games, compare Top-Up packages in BDT, and review the player information required by GameXpress.",
};

export default function GameTopUpPage() {
  return <GameTopUpCatalogPage />;
}
