import GiftCardProductDetails from "@/components/gift-card/GiftCardProductDetails";

export default async function GiftCardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GiftCardProductDetails slug={id} />;
}
