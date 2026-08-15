"use client";

import AdminShell from "@/components/admin/AdminShell";
import { ErrorState, LoadingState, PageHeader } from "@/components/admin/AdminUi";
import { useAdminGiftCard } from "@/hooks/api/use-gift-card-api";
import GiftCardProductForm from "./GiftCardProductForm";

export default function GiftCardEditClient({ id }: { id: string }) { const query = useAdminGiftCard(id); return <AdminShell allowedRoles={["ADMIN", "SUPER_ADMIN"]}><PageHeader eyebrow="Gift cards" title="Edit gift card" description="Product changes do not replace denominations or inventory." />{query.isLoading ? <LoadingState /> : query.isError ? <ErrorState message={query.error instanceof Error ? query.error.message : "Could not load gift card."} onRetry={() => query.refetch()} /> : query.data ? <GiftCardProductForm product={query.data} /> : null}</AdminShell>; }
