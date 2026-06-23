"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
}

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build URL based on whether search exists
        const url = search
          ? apiUrl(`/api/products?search=${encodeURIComponent(search)}`)
          : apiUrl("/api/products");

        console.log("Fetching from:", url); // Debug log

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        console.log("API Response:", json); // Debug log to see actual structure

        // Handle different possible API response structures
        let productsData = [];

        if (json?.data?.data?.data) {
          productsData = json.data.data.data;
        } else if (json?.data?.data) {
          productsData = json.data.data;
        } else if (json?.data) {
          productsData = json.data;
        } else if (Array.isArray(json)) {
          productsData = json;
        } else if (json?.products) {
          productsData = json.products;
        } else {
          productsData = [];
        }

        // Ensure productsData is an array
        if (!Array.isArray(productsData)) {
          console.error("Products data is not an array:", productsData);
          productsData = [];
        }

        setProducts(productsData);
        console.log("Products set:", productsData.length); // Debug log
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products",
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search]);

  // Debug: Log products when they change
  useEffect(() => {
    console.log("Current products state:", products);
  }, [products]);

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-white mb-6">
        {search ? `Search Results for "${search}"` : "All Products"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-purple-500 border-t-transparent"></div>
          <p className="text-slate-400 ml-3">Loading products...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-400 text-lg">
            {search
              ? "No products found. Try a different search term."
              : "No products available."}
          </p>
          {search && (
            <button
              onClick={() => (window.location.href = "/products")}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-slate-400 mb-6">
            Found {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-xl p-4 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">🎮</span>
                </div>
                <h2 className="text-white font-semibold mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-purple-400 font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;
