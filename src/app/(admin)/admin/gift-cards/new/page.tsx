"use client";

import AdminShell from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/AdminUi";
import GiftCardProductForm from "@/components/admin/gift-card/GiftCardProductForm";

export default function NewGiftCardPage() { return <AdminShell allowedRoles={["ADMIN", "SUPER_ADMIN"]}><PageHeader eyebrow="Gift cards" title="Create gift card" description="Create product metadata first, then manage denominations and inventory through their dedicated endpoints." /><GiftCardProductForm /></AdminShell>; }
