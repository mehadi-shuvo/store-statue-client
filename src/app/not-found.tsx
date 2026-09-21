import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-slate-50 px-4 py-20">
      <section className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-black uppercase tracking-[.18em] text-blue-700">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This page may have moved, or the link may no longer be available.
        </p>
        <Link href="/" className="mt-7 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">
          Return home
        </Link>
      </section>
    </main>
  );
}
