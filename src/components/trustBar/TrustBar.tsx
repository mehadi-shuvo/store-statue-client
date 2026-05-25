"use client";

import { ShieldCheck, Truck, BadgeDollarSign, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% safe & encrypted checkout",
  },
  {
    icon: Truck,
    title: "Instant Delivery",
    description: "Fast digital product delivery",
  },
  {
    icon: BadgeDollarSign,
    title: "Best Prices",
    description: "Competitive & affordable rates",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We’re here anytime you need",
  },
];

export default function TrustBar() {
  return (
    <section className="w-full bg-gray-50 border-y border-gray-200">
      <div className="w-4/5 mx-auto py-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2"
            >
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>

              <h4 className="text-sm font-semibold text-gray-900">
                {item.title}
              </h4>

              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
