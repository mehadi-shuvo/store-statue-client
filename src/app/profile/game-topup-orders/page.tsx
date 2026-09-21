import { RouteGuard } from "@/components/RouteGuard";
import CustomerTopUpOrders from "@/components/game-top-up/CustomerTopUpOrders";

export default function GameTopUpOrdersPage() {
  return <RouteGuard roles={["CUSTOMER"]}><CustomerTopUpOrders /></RouteGuard>;
}
