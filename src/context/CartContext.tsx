"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { apiUrl, fetchApiJson, getApiErrorMessage } from "@/lib/api";
import { useToast } from "./ToastContext";

interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  giftCardDenominationId?: string | null;
  gameTopUpPackageId?: string | null;
  subscriptionPlanId?: string | null;
  unitPrice?: number;
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
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  subtotal: number;
}

interface CartPayload {
  data?: {
    items?: CartItem[];
  };
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { user } = useAuth();
  const toast = useToast();

  // Fetch Cart
  const fetchCart = useCallback(async () => {
    try {
      const data = await fetchApiJson<CartPayload>(
        apiUrl("/api/user-cart"),
        undefined,
        "Could not load your cart.",
      );

      const items = data.data?.items ?? [];

      setCartItems(items);

      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(total);
    } catch (error) {
      toast.error(
        "Cart unavailable",
        error instanceof Error ? error.message : "Could not load your cart.",
      );
    }
  }, [toast]);

  // Add to Cart
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      if (!user?.id) {
        toast.warning("Login required", "Please login before adding items.");
        return;
      }

      await fetchApiJson(
        apiUrl(`/api/user-cart/add`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            quantity,
          }),
        },
        "Could not add this item to your cart.",
      );

      await fetchCart();
      toast.success("Added to cart", "The item is now in your cart.");
    } catch (error) {
      toast.error(
        "Add to cart failed",
        getApiErrorMessage(error, "Could not add this item to your cart."),
      );
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    if (!user) {
      toast.warning("Login required", "Please login to update your cart.");
      return;
    }

    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) {
      toast.error("Update failed", "Cart item was not found.");
      return;
    }

    try {
      await fetchApiJson(
        apiUrl(`/api/user-cart/update`),
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            giftCardDenominationId: item.giftCardDenominationId ?? undefined,
            gameTopUpPackageId: item.gameTopUpPackageId ?? undefined,
            subscriptionPlanId: item.subscriptionPlanId ?? undefined,
            quantity,
          }),
        },
        "Could not update item quantity.",
      );

      await fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      toast.error(
        "Update failed",
        getApiErrorMessage(error, "Could not update item quantity."),
      );
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user) {
      toast.warning("Login required", "Please login to remove items.");
      return;
    }

    const item = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!item) {
      toast.error("Remove failed", "Cart item was not found.");
      return;
    }

    try {
      await fetchApiJson(
        apiUrl(`/api/user-cart/remove`),
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: item.productId,
            giftCardDenominationId: item.giftCardDenominationId ?? undefined,
            gameTopUpPackageId: item.gameTopUpPackageId ?? undefined,
            subscriptionPlanId: item.subscriptionPlanId ?? undefined,
          }),
        },
        "Could not remove this item.",
      );

      await fetchCart();
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(
        "Remove failed",
        getApiErrorMessage(error, "Could not remove this item."),
      );
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.product;

    if (!product) {
      return sum;
    }

    const price =
      item.unitPrice ??
      (product.offerPercent && product.offerPercent > 0
        ? product.price - (product.price * product.offerPercent) / 100
        : product.price);

    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (!user?.id) {
      setCartItems([]);
      setTotalQuantity(0);
      return;
    }

    fetchCart();
  }, [fetchCart, user?.id]);

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
