import GiftCardOrderDetail from "@/components/gift-card/GiftCardOrderDetail";

export default async function GiftCardOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <GiftCardOrderDetail orderId={orderId} />;
}
