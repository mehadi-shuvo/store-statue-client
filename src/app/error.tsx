"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-20">
      <section role="alert" className="max-w-lg rounded-3xl border border-rose-200 bg-white p-10 text-center shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We couldn&apos;t load this page. No payment or order status has been inferred from this error.
        </p>
        <button type="button" onClick={reset} className="mt-7 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
          Try again
        </button>
      </section>
    </main>
  );
}
