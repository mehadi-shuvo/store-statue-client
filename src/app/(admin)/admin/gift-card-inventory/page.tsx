import GiftCardInventoryManager from "@/components/admin/gift-card/GiftCardInventoryManager";

export default async function GiftCardInventoryPage({ searchParams }: { searchParams: Promise<{ denominationId?: string }> }) { const { denominationId = "" } = await searchParams; return <GiftCardInventoryManager initialDenominationId={denominationId} />; }
