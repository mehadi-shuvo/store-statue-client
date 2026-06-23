"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { apiUrl } from "@/lib/api";

export default function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Sync state with URL after client mount
  useEffect(() => {
    const search = searchParams.get("search") || "";
    setQuery(search);
  }, [searchParams]);

  // Fetch suggestions - FIXED: Get product names for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          apiUrl(`/api/products?search=${encodeURIComponent(debouncedQuery)}`),
        );
        const data = await res.json();

        // Extract product names for suggestions based on your API structure
        let products = [];
        if (data?.data?.data?.data) {
          products = data.data.data.data;
        } else if (data?.data?.data) {
          products = data.data.data;
        } else if (data?.data) {
          products = data.data;
        } else if (Array.isArray(data)) {
          products = data;
        } else {
          products = [];
        }

        // Get unique product names for suggestions
        const productNames = products
          .map((product: any) => product.name)
          .slice(0, 5);
        setSuggestions(productNames);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      setIsOpen(false);
    } else {
      router.push("/products");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/products?search=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search products, games, brands..."
          className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2 pl-10 pr-24 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
        />

        {/* Search Icon */}
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Right side buttons */}
        <div className="absolute right-2 top-1.5 flex gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (query || suggestions.length > 0) && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-slate-400">
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
              </div>
            ) : suggestions.length > 0 ? (
              <div>
                <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-800">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : (
              query.trim() && (
                <div className="p-4 text-center text-slate-400">
                  No suggestions found
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
