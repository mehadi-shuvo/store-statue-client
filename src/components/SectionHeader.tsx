"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  badge?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  href,
  badge,
}: SectionHeaderProps) {
  return (
    <div className="w-4/5 mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex items-end justify-between gap-4">
      {/* Left Content */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {title}
          </h2>

          {badge && (
            <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-sm text-gray-500 max-w-xl">{subtitle}</p>
        )}
      </div>

      {/* Right CTA */}
      {href && (
        <Link
          href={href}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
