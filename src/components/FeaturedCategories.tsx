"use client";

import Link from "next/link";
import SectionHeader from "./SectionHeader";
import categories from "../../public/data/categories-list.json";
import Image from "next/image";

interface TCategory {
  id: number;
  categoryID: string;
  name: string;
  href: string;
  icon: string;
  description: string;
}

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 mb-12">
      <SectionHeader
        title="Shop by Category"
        subtitle="Find what you need quickly"
        href="/products"
        badge="Easy to Find"
      />
      <div className="w-11/12 md:w-4/5 mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center justify-start 
                p-5 rounded-2xl bg-white border border-gray-200
                shadow-sm hover:shadow-lg hover:border-purple-200
                hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              {/* Icon with subtle background on hover */}
              <div className="mb-3 p-2 rounded-full bg-gray-50 group-hover:bg-purple-50 transition-colors duration-200">
                <Image
                  src={cat.icon}
                  alt={cat.name}
                  width={28}
                  height={28}
                  className="w-7 h-7 group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Category Name */}
              <span className="text-sm font-medium text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-200">
                {cat.name}
              </span>

              {/* Description - always visible, responsive truncation */}
              {cat.description && (
                <p
                  className="text-xs text-gray-500 text-center mt-1.5 leading-tight 
                    line-clamp-2 break-words max-w-full group-hover:text-gray-600 
                    transition-colors duration-200"
                  title={cat.description} // Shows full description on hover
                >
                  {cat.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
