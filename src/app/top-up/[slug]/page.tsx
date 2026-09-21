import type { Metadata } from "next";
import GameTopUpDetailsPage from "@/components/game-top-up/GameTopUpDetailsPage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} Top-Up`, description: "Choose a game package, enter the required player information, and proceed to secure payment." };
}

export default async function GameTopUpDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameTopUpDetailsPage slug={slug} />;
}
