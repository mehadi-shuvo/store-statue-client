import GiftCardEditClient from "@/components/admin/gift-card/GiftCardEditClient";

export default async function EditGiftCardPage({ params }: { params: Promise<{ giftCardId: string }> }) { const { giftCardId } = await params; return <GiftCardEditClient id={giftCardId} />; }
