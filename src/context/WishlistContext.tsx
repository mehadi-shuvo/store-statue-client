"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface WishlistCategory {
  id?: string;
  title?: string;
}

export interface WishlistReview {
  rating: number;
}

export interface WishlistProduct {
  id: string;
  title: string;
  price: number;
  offerPercent?: number | null;
  photos?: string[];
  stockQuantity?: number;
  description?: string | null;
  category?: WishlistCategory;
  features?: string[];
  reviews?: WishlistReview[];
  createdAt?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistProduct[];
  wishlistCount: number;
  loading: boolean;
  error: string | null;
  isWishlisted: (productId: string) => boolean;
  addToWishlist: (product: WishlistProduct) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: WishlistProduct) => void;
  clearWishlist: () => void;
}

const STORAGE_KEY = "gamexpress_wishlist";

const WishlistContext = createContext<WishlistContextType | null>(null);

function readWishlistStorage() {
  if (typeof window === "undefined") {
    return { items: [] as WishlistProduct[], error: null as string | null };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [] as WishlistProduct[], error: null as string | null };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Wishlist storage format is invalid.");
    }

    return {
      items: parsed.filter(
        (item): item is WishlistProduct => Boolean(item && item.id),
      ),
      error: null as string | null,
    };
  } catch {
    return {
      items: [] as WishlistProduct[],
      error: "We could not restore your wishlist. It has been reset.",
    };
  }
}

export const WishlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = readWishlistStorage();
    setWishlistItems(stored.items);
    setError(stored.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || loading) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      setError("We could not save wishlist changes right now.");
    }
  }, [wishlistItems, loading]);

  const isWishlisted = (productId: string) =>
    wishlistItems.some((item) => item.id === productId);

  const addToWishlist = (product: WishlistProduct) => {
    setWishlistItems((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current;
      }

      return [product, ...current];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((current) =>
      current.filter((item) => item.id !== productId),
    );
  };

  const toggleWishlist = (product: WishlistProduct) => {
    setWishlistItems((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id);
      }

      return [product, ...current];
    });
  };

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        error,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
};
