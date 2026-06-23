"use client";

import { useEffect, useState } from "react";
import { TProduct } from "@/types/top-up/productsType";
import ProductCardSm from "./ProductCardSm";
import { apiUrl } from "@/lib/api";

export const ProductsGrid = () => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(apiUrl("/api/products?limit=9&page=1"));

        const json = await res.json();

        console.log("API Response:", json);

        // ✅ Correct extraction
        const productsArray = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.data?.data)
            ? json.data.data
            : [];

        setProducts(productsArray);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
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
