"use client";
import Image from "next/image";
import { useState } from "react";

const ProductCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      {/* Product Image with Overlay */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src="https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg"
          alt="product image"
          width={400}
          height={320}
          className="w-full h-82 object-cover transition-transform duration-500 hover:scale-105"
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-[rgba(17,17,17,0.6)] flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white p-4 text-center">
            <h3 className="font-semibold text-lg mb-2">Product Details</h3>
            <p className="text-sm">
              Premium quality materials. Water resistant. Available in multiple
              colors. 30-day return policy.
            </p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Nike Air Max 270
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-gray-900">$129.99</span>
          <span className="text-lg text-gray-500 line-through">$159.99</span>
          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
            Save $30
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
