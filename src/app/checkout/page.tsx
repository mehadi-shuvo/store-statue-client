import Link from "next/link";
import { CircleOff, ShoppingBag } from "lucide-react";
import { PaymentShell } from "@/components/payment/PaymentUi";

export default function CheckoutPage() {
  return (
    <PaymentShell
      eyebrow="Checkout unavailable"
      title="Order creation is not available yet"
      description="The payment API requires an existing order, but the backend does not currently expose a customer order-creation endpoint."
    >
      <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
        <CircleOff className="mx-auto h-12 w-12 text-amber-700" />
        <h2 className="mt-4 text-xl font-black text-amber-950">Payment has not been started</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-amber-900/80">
          Your cart is unchanged. Once the backend adds authenticated order creation, this page can pass the returned order ID and exact server-calculated total to the payment endpoint.
        </p>
        <Link href="/cart" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
          <ShoppingBag className="h-4 w-4" />
          Return to cart
        </Link>
      </section>
    </PaymentShell>
  );
}
