"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();

  console.log({ cartItems });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Please login to view cart</h2>
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <Link href="/" className="text-blue-600 underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal > 200 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        {cartItems.map((item) => {
          const price =
            item.product.offerPercent > 0
              ? item.product.price -
                (item.product.price * item.product.offerPercent) / 100
              : item.product.price;

          return (
            <div
              key={item.id}
              className="flex items-center gap-6 bg-white p-6 rounded-2xl shadow"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.product.photos[0]}
                  alt={item.product.title}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.title}</h3>
                <p className="text-gray-500 text-sm">
                  ${price.toFixed(2)} each
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="font-medium">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stockQuantity}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${(price * item.quantity).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-2xl shadow h-fit">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
        </div>

        <div className="border-t my-4"></div>

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
