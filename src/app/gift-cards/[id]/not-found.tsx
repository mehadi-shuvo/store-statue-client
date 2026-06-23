import Link from "next/link";

export default function GiftCardNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Gift Card Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The gift card you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
