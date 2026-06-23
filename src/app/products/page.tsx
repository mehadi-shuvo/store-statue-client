import { Suspense } from "react";
import ProductsClientPage from "./products-client";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 pt-[148px]">
          <div className="w-[90%] max-w-7xl mx-auto py-10">
            <div className="h-8 w-64 rounded-xl bg-slate-800/70 animate-pulse" />
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <div className="h-40 rounded-xl bg-slate-800/70 animate-pulse" />
                  <div className="mt-4 h-4 w-3/4 rounded-full bg-slate-800/70 animate-pulse" />
                  <div className="mt-3 h-5 w-1/2 rounded-full bg-slate-800/70 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsClientPage />
    </Suspense>
  );
}
