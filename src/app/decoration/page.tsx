"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { TProduct } from "@/types/top-up/productsType";

const ProductsPage = () => {
  // -----------------------------
  // BASIC STATES
  // -----------------------------
  const [products, setProducts] = useState<TProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 30;
  const [totalPages, setTotalPages] = useState(1);

  // Filters - Set default to show newest first (createdAt desc)
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc"); // Changed to "desc" for newest first

  const [error, setError] = useState("");

  // -----------------------------
  // FETCH PRODUCTS
  // -----------------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        sort,
        order,
      });

      const res = await fetch(
        `http://localhost:5000/api/products?${query.toString()}`,
      );

      const json = await res.json();

      setProducts(json?.data?.data || []);
      setTotalPages(json?.data?.meta?.totalPage || 1);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page changes
  useEffect(() => {
    fetchProducts();
  }, [page]);

  // Fetch when filters/sort changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [sort, order]);

  // Handle price sort
  const handlePriceSort = (selectedOrder: string) => {
    setSort("price");
    setOrder(selectedOrder);
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ---------------- SORTING ONLY ---------------- */}
      <div className="w-4/5 mx-auto px-6 py-8 mt-[148px]">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600">
                Sort by:
              </span>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center">
              <select
                value={order}
                onChange={(e) => handlePriceSort(e.target.value)}
                className="w-full sm:w-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-700 cursor-pointer hover:bg-gray-100 transition"
              >
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>

              <button
                onClick={() => {
                  setSort("createdAt");
                  setOrder("desc"); // Reset to newest first
                  setPage(1);
                }}
                className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Show Newest First
              </button>
            </div>

            {/* Active sort indicator */}
            {sort === "price" && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                {order === "asc" ? "Price: Low to High" : "Price: High to Low"}
              </div>
            )}
            {sort === "createdAt" && order === "desc" && (
              <div className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Newest First
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- PRODUCT GRID ---------------- */}
      <div className="w-4/5 mx-auto px-6 pb-12">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No products found 😢
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* ---------------- PAGINATION ONLY IF > 30 PRODUCTS ---------------- */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pb-12">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ Prev
          </button>

          <p className="font-semibold text-gray-700">
            Page {page} of {totalPages}
          </p>

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
