import {
  FEATURE_LABELS,
  isPublicFeature,
} from "@/features/feature-config";
import { Clock3, Gift, Gamepad2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Service Temporarily Unavailable",
  description: "This GameXpress service is not part of the current launch.",
  robots: { index: false, follow: false },
};

export default async function ServiceUnavailablePage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>;
}) {
  const { feature } = await searchParams;
  const serviceName =
    feature && isPublicFeature(feature)
      ? FEATURE_LABELS[feature]
      : "This service";

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-20">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <div className="bg-slate-950 px-6 py-12 text-center text-white sm:px-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-400/15 text-amber-300">
            <Clock3 className="h-8 w-8" aria-hidden="true" />
          </span>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Current launch scope
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {serviceName} is temporarily unavailable.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            We&apos;re focusing this release on secure Gift Card and Game Top-Up
            services. This capability is preserved and may return in a future
            release.
          </p>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-10">
          <Link
            href="/gift-cards"
            className="group rounded-3xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            <Gift className="h-8 w-8 text-blue-700" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Browse Gift Cards
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a stocked denomination from trusted digital brands.
            </p>
          </Link>
          <Link
            href="/top-up"
            className="group rounded-3xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
          >
            <Gamepad2 className="h-8 w-8 text-purple-700" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-slate-950">
              Explore Game Top-Ups
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Find supported games and available top-up packages.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
