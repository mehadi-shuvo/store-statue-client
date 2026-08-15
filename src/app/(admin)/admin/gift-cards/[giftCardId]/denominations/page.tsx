import DenominationsManager from "@/components/admin/gift-card/DenominationsManager";

export default async function GiftCardDenominationsPage({ params }: { params: Promise<{ giftCardId: string }> }) { const { giftCardId } = await params; return <DenominationsManager productId={giftCardId} />; }
