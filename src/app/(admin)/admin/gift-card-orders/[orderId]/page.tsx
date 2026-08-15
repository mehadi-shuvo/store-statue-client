import AdminGiftCardOrderDetail from "@/components/admin/gift-card/AdminGiftCardOrderDetail";

export default async function AdminGiftCardOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) { const { orderId } = await params; return <AdminGiftCardOrderDetail id={orderId} />; }
