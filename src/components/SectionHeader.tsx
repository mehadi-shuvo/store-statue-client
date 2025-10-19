"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  category?: "gaming" | "electronics" | "topup" | "all";
  align?: "left" | "center" | "right";
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  category = "all",
  align = "center",
}) => {
  // Simple category-based colors
  const categoryColors = {
    gaming: {
      accent: "text-purple-600",
      border: "border-purple-200",
      bg: "bg-purple-50",
    },
    electronics: {
      accent: "text-blue-600",
      border: "border-blue-200",
      bg: "bg-blue-50",
    },
    topup: {
      accent: "text-green-600",
      border: "border-green-200",
      bg: "bg-green-50",
    },
    all: {
      accent: "text-gray-600",
      border: "border-gray-200",
      bg: "bg-gray-50",
    },
  };

  const alignmentStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const colors = categoryColors[category];

  return (
    <div className={`py-12 ${colors.bg} rounded-2xl mb-8`}>
      <div
        className={`max-w-4xl mx-auto px-6 flex flex-col ${alignmentStyles[align]}`}
      >
        {/* Simple Category Badge */}
        <div
          className={`inline-flex px-4 py-2 rounded-full ${colors.bg} border ${colors.border} mb-4`}
        >
          <span
            className={`text-sm font-semibold ${colors.accent} uppercase tracking-wide`}
          >
            {category === "all" ? "Featured" : category}
          </span>
        </div>

        {/* Clean Title */}
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.accent}`}>
          {title}
        </h1>

        {/* Simple Subtitle */}
        {subtitle && (
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Minimal Decorative Line */}
        <div className={`w-16 h-1 ${colors.bg} rounded-full mt-6`}></div>
      </div>
    </div>
  );
};

export default SectionHeader;
