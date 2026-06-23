"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Footer sections data
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Accessories", href: "/accessories" },
        { name: "Wishlist", href: "/wishlist" },
        { name: "Game Top-Up", href: "/top-up" },
        { name: "Gift Cards", href: "/gift-cards" },
        { name: "Subscriptions", href: "/subscriptions" },
        { name: "Pre-Orders", href: "/pre-orders" },
        { name: "Deals", href: "/deals" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Order Tracking", href: "/track-order" },
        { name: "Returns & Refunds", href: "/returns" },
        { name: "Payment Methods", href: "/payment" },
        { name: "FAQs", href: "/faqs" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
        { name: "Partners", href: "/partners" },
        { name: "Affiliates", href: "/affiliates" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
        { name: "Disclaimer", href: "/disclaimer" },
        { name: "Licenses", href: "/licenses" },
      ],
    },
  ];

  // Social media links
  const socialLinks = [
    {
      name: "Discord",
      href: "https://discord.gg/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515c-.21.38-.456.886-.599 1.293a18.285 18.285 0 0 0-5.482 0 12.656 12.656 0 0 0-.602-1.293 19.736 19.736 0 0 0-4.885 1.515c-2.876 4.42-3.648 8.73-3.229 12.96 2.05 1.514 4.044 2.435 6.025 3.036.485-.66.92-1.364 1.293-2.105a12.76 12.76 0 0 1-2.042-.979c.171-.125.34-.256.504-.391 3.14 1.445 6.554 1.445 9.646 0 .164.135.333.266.504.391-.652.392-1.336.73-2.042.979.373.741.808 1.445 1.293 2.105 1.981-.601 3.976-1.522 6.025-3.036.494-4.736-.68-9.002-3.23-12.96zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.946-2.422 2.156-2.422 1.21 0 2.18 1.089 2.156 2.422 0 1.334-.946 2.419-2.156 2.419zm7.975 0c-1.183 0-2.156-1.085-2.156-2.419 0-1.333.946-2.422 2.156-2.422 1.21 0 2.18 1.089 2.156 2.422 0 1.334-.946 2.419-2.156 2.419z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.514-3.145 13.5 13.5 0 001.332-5.714c0-.21-.005-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Twitch",
      href: "https://twitch.tv/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
        </svg>
      ),
    },
  ];

  // Payment methods
  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "📱" },
    { name: "Apple Pay", icon: "🍎" },
    { name: "Google Pay", icon: "📱" },
    { name: "Bitcoin", icon: "₿" },
  ];

  // App store links
  const appStores = [
    {
      name: "App Store",
      href: "https://apps.apple.com/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      ),
    },
    {
      name: "Google Play",
      href: "https://play.google.com/store/gamexpress",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.609 1.814L13.792 12 3.61 22.186 18.217 12 3.608 1.814zm16.574 9.434L22.39 8.26l-2.206-1.038v4.025zm0 4.811l2.206-4.988-2.206-1.038v6.026z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      {/* Main Footer */}
      <div className="w-4/5 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3 group mb-4"
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">GX</span>
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">GameXpress</h3>
                <p className="text-slate-400 text-xs">Gaming & Electronics</p>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your ultimate destination for gaming accessories, top-ups, gift
              cards, and subscriptions. Level up your gaming experience with
              GameXpress.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm">
                Subscribe to Newsletter
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-slate-800 text-white px-4 py-2 rounded-l-lg border border-slate-700 focus:border-purple-500 focus:outline-none text-sm"
                />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
              <p className="text-slate-500 text-xs">
                Get 10% off your first order. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors ${
                        pathname === link.href
                          ? "text-purple-400"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Social Links */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Follow Us
              </h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800 text-slate-400 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Payment Methods
              </h4>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-800 rounded-lg text-slate-300 text-sm"
                  >
                    <span>{method.icon}</span>
                    <span>{method.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download App */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Download App
              </h4>
              <div className="flex flex-wrap gap-2">
                {appStores.map((store) => (
                  <a
                    key={store.name}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    {store.icon}
                    <span className="text-white text-sm">{store.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} GameXpress. All rights reserved.
              <span className="block md:inline md:ml-1">
                Designed for gamers, by gamers.
              </span>
            </p>

            {/* Trust Badges */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-sm">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Language/Region Selector */}
            <div className="flex items-center gap-2">
              <select className="bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none">
                <option value="us">🇺🇸 English (US)</option>
                <option value="uk">🇬🇧 English (UK)</option>
                <option value="es">🇪🇸 Español</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="jp">🇯🇵 日本語</option>
              </select>
              <select className="bg-slate-800 text-white text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none">
                <option value="us">USD ($)</option>
                <option value="eu">EUR (€)</option>
                <option value="gb">GBP (£)</option>
                <option value="jp">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile App Banner (visible on mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">GX</span>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Get the App</h4>
              <p className="text-slate-400 text-xs">Shop on the go</p>
            </div>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Download
          </button>
        </div>
      </div>

      {/* Back to Top Button (visible on scroll) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-20 lg:bottom-8 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40"
        aria-label="Back to top"
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
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
