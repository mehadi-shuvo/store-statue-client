"use client";
import ProductCard from "./ProductCard";
import productsData from "../../public/data/products-data.json";
import { TProduct } from "@/types/top-up/productsType";

export const ProductsGrid = () => {
  const products: TProduct[] = productsData;
  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId);
  };

  const handleQuickView = (productId: string) => {
    console.log("Quick view:", productId);
  };

  const handleBuyNow = (productId: string) => {
    console.log("Buy now:", productId);
  };

  return (
    <div className="w-4/5 mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-5 mb-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
          onBuyNow={handleBuyNow}
        />
      ))}
    </div>
  );
};
