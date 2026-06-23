"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { apiUrl } from "@/lib/api";

interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product?: {
    id: string;
    title: string;
    price: number;
    offerPercent?: number;
    stockQuantity: number;
    photos: string[];
  };
}

interface CartContextType {
  cartItems: CartItem[];
  totalQuantity: number;
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { user } = useAuth(); // 🔥 replace with real auth user id

  // Fetch Cart
  const fetchCart = async (userId: string) => {
    try {
      const res = await fetch(apiUrl(`/api/user-cart/${userId}`));

      if (!res.ok) {
        console.error("Cart fetch failed");
        return;
      }

      const data = await res.json();

      setCartItems(data.data.items || []);

      const total = data.data.items?.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0,
      );

      setTotalQuantity(total || 0);
    } catch (error) {
      console.error("Cart fetch error", error);
    }
  };

  // Add to Cart
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      if (!user?.id) return;
      await fetch(apiUrl(`/api/user-cart/add`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId,
          quantity,
        }),
      });

      await fetchCart(user.id);
    } catch (error) {
      console.error("Add to cart error", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    if (!user) return;

    await fetch(apiUrl(`/api/cart/update`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });

    fetchCart(user.id);
  };

  const removeItem = async (itemId: string) => {
    if (!user) return;
    await fetch(apiUrl(`/api/cart/remove/${itemId}`), {
      method: "DELETE",
    });

    fetchCart(user.id);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product;

    if (!product) {
      return sum;
    }

    const price =
      product.offerPercent && product.offerPercent > 0
        ? product.price - (product.price * product.offerPercent) / 100
        : product.price;

    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (!user?.id) return;
    fetchCart(user?.id);
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        fetchCart,
        addToCart,
        updateQuantity,
        subtotal,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
