"use client";

import {
  ShieldCheck,
  Zap,
  BadgeCheck,
  CreditCard,
  Headphones,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    description:
      "All payments are protected with industry-standard encryption to ensure your data stays safe.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Get your digital products delivered instantly after purchase. No waiting, no delays.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Products",
    description:
      "We only offer authentic and verified gift cards and digital items from trusted sources.",
  },
  {
    icon: CreditCard,
    title: "Multiple Payment Options",
    description:
      "Pay بسهولة using cards, mobile banking, or local payment gateways.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description:
      "Our support team is always ready to help you anytime, anywhere.",
  },
  {
    icon: Globe,
    title: "Global Access",
    description:
      "Purchase and use gift cards from top brands worldwide without restrictions.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-16">
      <div className="w-4/5 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            We focus on delivering the best digital shopping experience with
            security, speed, and trust at the core of everything we do.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="group border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 mb-4 group-hover:bg-blue-100 transition">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>

                {/* Content */}
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h4>

                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
