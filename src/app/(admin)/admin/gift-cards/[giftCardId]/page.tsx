import AdminGiftCardDetail from "@/components/admin/gift-card/AdminGiftCardDetail";

export default async function AdminGiftCardDetailPage({ params }: { params: Promise<{ giftCardId: string }> }) { const { giftCardId } = await params; return <AdminGiftCardDetail id={giftCardId} />; }
