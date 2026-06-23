"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TProduct } from "@/types/top-up/productsType";
import { useWishlist } from "@/context/WishlistContext";
import { apiUrl } from "@/lib/api";

// Types
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface ProductDetails {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  offerPercent: number | null;
  photos: string[];
  features: string[];
  isActive: boolean;
  createdAt: string;
  category: {
    id: string;
    title: string;
  };
  reviews: Review[];
}

interface RelatedProduct {
  id: string;
  title: string;
  price: number;
  stockQuantity: number;
  offerPercent: number | null;
  photos: string[];
}

interface ProductResponse {
  product: ProductDetails;
  relatedProducts: RelatedProduct[];
}

const ProductDetailsPage = () => {
  const { productId, sear } = useParams();
  // console.log({ productId });

  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const price = Number(productData?.product.price);

  // Calculate discounted price
  const discountedPrice = productData?.product.offerPercent
    ? price * (1 - productData.product.offerPercent / 100)
    : price;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiUrl(`/api/products/${productId}`));
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to load product");
        }

        setProductData(json.data);
      } catch (err: any) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const { product, relatedProducts } = productData;
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-4/5 mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <svg
            className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Home
        </Link>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={
                    product.photos[selectedImage] || "/placeholder-product.jpg"
                  }
                  alt={product.title}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.photos.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition ${
                        selectedImage === index
                          ? "border-amber-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={photo}
                        alt={`${product.title} - Image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              <Link
                href={`/products?category=${product.category.id}`}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium mb-2 inline-block"
              >
                {product.category.title}
              </Link>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= averageRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                {product.offerPercent ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${discountedPrice?.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ${price.toFixed(2)}
                    </span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      {product.offerPercent}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-medium">In Stock</span>
                    <span className="text-sm text-gray-500">
                      ({product.stockQuantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stockQuantity}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            product.stockQuantity,
                            Math.max(1, parseInt(e.target.value) || 1),
                          ),
                        )
                      }
                      className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                    <button
                      onClick={() =>
                        setQuantity(
                          Math.min(product.stockQuantity, quantity + 1),
                        )
                      }
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <button
                  disabled={product.stockQuantity === 0}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    toggleWishlist({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      offerPercent: product.offerPercent,
                      photos: product.photos,
                      stockQuantity: product.stockQuantity,
                      description: product.description,
                      category: {
                        id: product.category.id,
                        title: product.category.title,
                      },
                      features: product.features,
                      reviews: product.reviews.map((review) => ({
                        rating: review.rating,
                      })),
                      createdAt: product.createdAt,
                    })
                  }
                  className={`w-full py-4 font-semibold rounded-xl transition flex items-center justify-center gap-2 border ${
                    isWishlisted(product.id)
                      ? "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isWishlisted(product.id)
                        ? "fill-pink-600 text-pink-600"
                        : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isWishlisted(product.id) ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t px-8 py-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews ({product.reviews.length})
            </h2>

            <div className="space-y-6">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <span className="font-semibold text-amber-600">
                          {review.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 ml-12">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition">
                    <div className="aspect-square relative">
                      <Image
                        src={
                          relatedProduct.photos[0] || "/placeholder-product.jpg"
                        }
                        alt={relatedProduct.title}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {relatedProduct.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        {relatedProduct.offerPercent ? (
                          <div>
                            <span className="text-lg font-bold text-gray-900">
                              $
                              {(
                                Number(relatedProduct.price) *
                                (1 - relatedProduct.offerPercent / 100)
                              ).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through ml-2">
                              ${Number(relatedProduct.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ${Number(relatedProduct.price).toFixed(2)}
                          </span>
                        )}
                        {relatedProduct.stockQuantity > 0 ? (
                          <span className="text-sm text-green-600">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
