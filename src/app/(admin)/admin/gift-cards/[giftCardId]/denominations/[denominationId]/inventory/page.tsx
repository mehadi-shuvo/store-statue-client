import GiftCardInventoryManager from "@/components/admin/gift-card/GiftCardInventoryManager";

export default async function DenominationInventoryPage({
  params,
}: {
  params: Promise<{ giftCardId: string; denominationId: string }>;
}) {
  const { giftCardId, denominationId } = await params;
  return <GiftCardInventoryManager productId={giftCardId} initialDenominationId={denominationId} />;
}
