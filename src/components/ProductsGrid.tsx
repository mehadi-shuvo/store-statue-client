"use client";

import { useEffect, useState } from "react";
import { TProduct } from "@/types/top-up/productsType";
import ProductCardSm from "./ProductCardSm";
import { apiUrl, fetchApiJson } from "@/lib/api";

interface ProductsPayload {
  data?: TProduct[] | { data?: TProduct[] };
}

function getProductsPayload(payload: ProductsPayload) {
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (payload.data && !Array.isArray(payload.data)) {
    return payload.data.data ?? [];
  }

  return [];
}

export const ProductsGrid = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const json = await fetchApiJson<ProductsPayload>(
          apiUrl("/api/products?limit=9&page=1"),
          undefined,
          "Failed to fetch products",
        );

        setProducts(getProductsPayload(json));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <p className="text-center py-10 text-gray-500">Loading products...</p>
    );
  }

  // ✅ Error UI
  if (error) {
    return <p className="text-center py-10 text-red-500">{error}</p>;
  }

  return (
    <div className="w-4/5 mx-auto grid lg:grid-cols-4 md:grid-cols-3 gap-5 mb-10">
      {products.length === 0 ? (
        <p className="text-center col-span-full text-gray-500">
          No products found
        </p>
      ) : (
        products.map((product) => (
          <ProductCardSm key={product.id} product={product} />
        ))
      )}
    </div>
  );
};
