"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@/components/admin/AdminUi";
import {
  getDigitalProductOverview,
  getSalesStats,
  type DigitalProductOverview,
  type SalesStats,
} from "@/lib/admin";
import {
  BadgeDollarSign,
  Boxes,
  CreditCard,
  PackageSearch,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AdminDashboardPage() {
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [digitalOverview, setDigitalOverview] =
    useState<DigitalProductOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const [stats, overview] = await Promise.all([
        getSalesStats(),
        getDigitalProductOverview(),
      ]);
      setSalesStats(stats ?? null);
      setDigitalOverview(overview ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const digitalCounts = digitalOverview?.counts;
  const metricCards = useMemo(
    () => [
      {
        label: "Total sales",
        value: formatCurrency(salesStats?.totalSales),
        icon: BadgeDollarSign,
        tone: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Total orders",
        value: String(salesStats?.totalOrders ?? 0),
        icon: Boxes,
        tone: "bg-blue-50 text-blue-700",
      },
      {
        label: "Pending payments",
        value: String(salesStats?.pendingPayments ?? 0),
        icon: CreditCard,
        tone: "bg-amber-50 text-amber-700",
      },
      {
        label: "Digital products",
        value: String(
          (digitalCounts?.giftCards ?? 0) +
            (digitalCounts?.topUps ?? 0) +
            (digitalCounts?.subscriptions ?? 0),
        ),
        icon: PackageSearch,
        tone: "bg-violet-50 text-violet-700",
      },
    ],
    [digitalCounts, salesStats],
  );

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Control panel"
        title="Admin overview"
        description="Monitor shop sales, payment queues, and digital catalog health."
        action={
          <Link
            href="/admin/digital-products"
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Digital catalog
          </Link>
        }
      />

      {loading ? <LoadingState label="Loading dashboard widgets..." /> : null}
      {error && !loading ? <ErrorState message={error} onRetry={loadDashboard} /> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metricCards.map((metric) => {
              const Icon = metric.icon;
              return (
                <article
                  key={metric.label}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.tone}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-sm text-slate-500">{metric.label}</p>
                  <p className="mt-1 text-2xl font-black text-slate-950">
                    {metric.value}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">Recent orders</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest orders from the sales statistics endpoint.
                  </p>
                </div>
                <StatusBadge value={`${salesStats?.paidOrders ?? 0} paid`} />
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                {(salesStats?.recentOrders ?? []).length > 0 ? (
                  <div className="divide-y divide-slate-200">
                    {salesStats?.recentOrders.map((order) => (
                      <Link
                        href={`/admin/orders/${order.id}`}
                        key={order.id}
                        className="grid gap-3 px-4 py-3 transition hover:bg-slate-50 sm:grid-cols-[1fr_auto_auto]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {order.orderNumber || order.id}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          {formatCurrency(order.totalCost)}
                        </p>
                        <StatusBadge value={order.paymentStatus} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No recent orders found" />
                )}
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold">Digital catalog</h2>
              <p className="mt-1 text-sm text-slate-500">
                Gift cards, top-ups, subscriptions, and low-stock items.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Gift cards", digitalCounts?.giftCards ?? 0],
                  ["Top-ups", digitalCounts?.topUps ?? 0],
                  ["Subscriptions", digitalCounts?.subscriptions ?? 0],
                  ["Inactive", digitalCounts?.inactiveDigitalProducts ?? 0],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-2xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
