"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getApiErrorMessage } from "@/lib/api";
import { useToast } from "./ToastContext";
import { customerService } from "@/services/api/customer.service";
import type { AddCartItemInput, CartItem as ApiCartItem } from "@/types/api";

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
  addDigitalItem: (input: AddCartItemInput) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  subtotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

function toCartItem(item: ApiCartItem): CartItem {
  const product = item.giftCardProduct ?? item.gameTopUpProduct ?? item.subscriptionProduct;
  const option = item.giftCardDenomination ?? item.gameTopUpPackage ?? item.subscriptionPlan;
  const image = item.giftCardProduct?.image ?? item.gameTopUpProduct?.logo ?? item.subscriptionProduct?.logo;
  return {
    id: item.id,
    quantity: item.quantity,
    productId: item.giftCardProductId ?? item.gameTopUpProductId ?? item.subscriptionProductId ?? "",
    giftCardDenominationId: item.giftCardDenominationId,
    gameTopUpPackageId: item.gameTopUpPackageId,
    subscriptionPlanId: item.subscriptionPlanId,
    unitPrice: Number(item.unitPrice),
    product: product ? {
      id: product.id,
      title: product.title,
      price: Number(item.unitPrice),
      stockQuantity: option?.stockQuantity ?? Number.MAX_SAFE_INTEGER,
      photos: image ? [image] : [],
    } : undefined,
  };
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { user } = useAuth();
  const toast = useToast();

  // Fetch Cart
  const fetchCart = useCallback(async () => {
    try {
      const data = await customerService.cart();
      const items = data.items.map(toCartItem);

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

  const addDigitalItem = async (input: AddCartItemInput) => {
    try {
      if (!user?.id) {
        toast.warning("Login required", "Please login before adding items.");
        return;
      }

      await customerService.addCartItem(input);

      await fetchCart();
      toast.success("Added to cart", "The item is now in your cart.");
    } catch (error) {
      toast.error(
        "Add to cart failed",
        getApiErrorMessage(error, "Could not add this item to your cart."),
      );
    }
  };

  // Legacy product cards do not select a required digital option. Keep them safe
  // and guide callers toward addDigitalItem instead of sending an invalid request.
  const addToCart = async () => {
    toast.warning("Choose an option", "Select a denomination, top-up package, or subscription plan first.");
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
      const identity = item.giftCardDenominationId
        ? { productId: item.productId, giftCardDenominationId: item.giftCardDenominationId }
        : item.gameTopUpPackageId
          ? { productId: item.productId, gameTopUpPackageId: item.gameTopUpPackageId }
          : item.subscriptionPlanId
            ? { productId: item.productId, subscriptionPlanId: item.subscriptionPlanId }
            : null;
      if (!identity) throw new Error("Cart item option data is missing.");
      await customerService.updateCartItem({ ...identity, quantity });

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
      const identity = item.giftCardDenominationId
        ? { productId: item.productId, giftCardDenominationId: item.giftCardDenominationId }
        : item.gameTopUpPackageId
          ? { productId: item.productId, gameTopUpPackageId: item.gameTopUpPackageId }
          : item.subscriptionPlanId
            ? { productId: item.productId, subscriptionPlanId: item.subscriptionPlanId }
            : null;
      if (!identity) throw new Error("Cart item option data is missing.");
      await customerService.removeCartItem(identity);

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

    if (!product) return sum;

    // Get the base price (either unitPrice or product.price)
    const basePrice = item.unitPrice ?? product.price;

    // Apply the discount to that base price if an offer exists
    const price =
      product.offerPercent && product.offerPercent > 0
        ? basePrice - (basePrice * product.offerPercent) / 100
        : basePrice;

    return sum + price * item.quantity;
  }, 0);

  useEffect(() => {
    if (!user?.id || user.role !== "CUSTOMER") {
      setCartItems([]);
      setTotalQuantity(0);
      return;
    }

    fetchCart();
  }, [fetchCart, user?.id, user?.role]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalQuantity,
        fetchCart,
        addToCart,
        addDigitalItem,
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
