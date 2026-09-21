import { RouteGuard } from "@/components/RouteGuard";
import PaymentReturnStatus from "@/components/payment/PaymentReturnStatus";

export default async function GameTopUpOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <RouteGuard roles={["CUSTOMER"]}><PaymentReturnStatus orderId={orderId} /></RouteGuard>;
}
