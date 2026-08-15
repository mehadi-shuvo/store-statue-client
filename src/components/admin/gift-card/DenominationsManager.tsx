"use client";

import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDialog, ErrorState, PageHeader, StatusBadge } from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  useAdminGiftCard,
  useCreateGiftCardDenomination,
  useDeactivateGiftCardDenomination,
  useGiftCardDenominations,
  useUpdateGiftCardDenomination,
} from "@/hooks/api/use-gift-card-api";
import { formatMoney, formatMoneyCode, getGiftCardErrorMessage, isValidDecimalString } from "@/lib/gift-card";
import type { GiftCardDenomination, GiftCardDenominationInput } from "@/types/gift-card";
import { Boxes, Loader2, MoreHorizontal, Pencil, Plus, Power } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const blank: GiftCardDenominationInput = {
  faceValue: "",
  faceCurrency: "USD",
  sellingPriceBdt: "",
  isPopular: false,
  isActive: true,
  sortOrder: 0,
};
const field = "mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const stockKeys = ["available", "reserved", "sold", "disabled", "expired"] as const;

function DenominationSkeletons() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map(item => <div key={item} className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"><div className="h-7 w-36 rounded bg-slate-100" /><div className="mt-3 h-4 w-28 rounded bg-slate-100" /><div className="mt-8 h-20 rounded-xl bg-slate-100" /><div className="mt-7 h-11 rounded-xl bg-slate-100" /></div>)}</div>;
}

export default function DenominationsManager({ productId }: { productId: string }) {
  const toast = useToast();
  const product = useAdminGiftCard(productId);
  const query = useGiftCardDenominations(productId);
  const create = useCreateGiftCardDenomination(productId);
  const update = useUpdateGiftCardDenomination(productId);
  const deactivate = useDeactivateGiftCardDenomination(productId);
  const [editing, setEditing] = useState<GiftCardDenomination | "new" | null>(null);
  const [form, setForm] = useState(blank);
  const [target, setTarget] = useState<GiftCardDenomination | null>(null);

  const open = (value: GiftCardDenomination | "new") => {
    setEditing(value);
    setForm(value === "new" ? blank : {
      faceValue: value.faceValue,
      faceCurrency: value.faceCurrency,
      sellingPriceBdt: value.sellingPriceBdt,
      isPopular: value.isPopular,
      isActive: value.isActive !== false,
      sortOrder: value.sortOrder ?? 0,
    });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidDecimalString(form.faceValue) || !isValidDecimalString(form.sellingPriceBdt)) {
      return toast.error("Invalid price", "Face value and customer price must be greater than zero with at most two decimal places.");
    }
    const payload = {
      ...form,
      faceValue: form.faceValue.trim(),
      sellingPriceBdt: form.sellingPriceBdt.trim(),
      faceCurrency: form.faceCurrency.trim().toUpperCase(),
    };
    const action = editing === "new" ? create.mutateAsync(payload) : update.mutateAsync({ id: editing!.id, input: payload });
    action.then(() => {
      toast.success(editing === "new" ? "Denomination created" : "Denomination updated");
      setEditing(null);
      setForm(blank);
    }).catch(error => toast.error("Could not save denomination", getGiftCardErrorMessage(error)));
  };

  const pending = create.isPending || update.isPending;
  const productName = product.data?.name || product.data?.title;

  return <AdminShell allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
      <Link href="/admin/gift-cards" className="hover:text-blue-700">Gift Cards</Link><span>/</span>
      <Link href={`/admin/gift-cards/${productId}`} className="hover:text-blue-700">{productName || "Product"}</Link><span>/</span>
      <span className="text-slate-800">Denominations</span>
    </nav>
    <PageHeader eyebrow={productName || "Gift cards"} title="Denominations" description="Each face value owns its inventory. Customer prices are charged in BDT." action={<button onClick={() => open("new")} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Add denomination</button>} />

    {query.isLoading ? <DenominationSkeletons /> : query.isError ? <ErrorState message="Could not load denominations." onRetry={() => query.refetch()} /> : !query.data?.length ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><h2 className="font-black text-slate-950">No denominations yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Create denominations such as USD 5, USD 10, USD 20, or USD 50 before adding inventory.</p><button onClick={() => open("new")} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Add denomination</button></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {query.data.map(item => <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-2xl font-black text-slate-950">{formatMoneyCode(item.faceValue, item.faceCurrency)}</p><p className="mt-1 text-sm text-slate-500">Customer price: <strong className="text-blue-700">{formatMoney(item.sellingPriceBdt, "BDT")}</strong></p></div>
          <div className="flex flex-col items-end gap-2"><StatusBadge value={item.isActive !== false} />{item.isPopular ? <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Popular</span> : null}</div>
        </div>
        <div className="mt-5 border-t border-slate-100 pt-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory</p><div className="mt-3 grid grid-cols-5 gap-1 text-center text-xs">{stockKeys.map(key => <div key={key} className="rounded-lg bg-slate-50 p-2"><p className="font-black text-slate-950">{item.stock?.[key] ?? "—"}</p><p className="mt-1 truncate capitalize text-slate-500">{key}</p></div>)}</div><p className="mt-3 text-sm font-semibold text-slate-700">Total inventory: <span className="font-black text-slate-950">{item.stock?.total ?? "—"}</span></p></div>
        <div className="mt-5 flex items-center gap-2">
          <Link href={`/admin/gift-cards/${productId}/denominations/${item.id}/inventory`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-bold text-white"><Boxes className="h-4 w-4" />Manage Inventory</Link>
          <button onClick={() => open(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold"><Pencil className="h-4 w-4" />Edit</button>
          <details className="relative"><summary aria-label="More denomination actions" className="list-none cursor-pointer rounded-xl border p-2.5 text-slate-600"><MoreHorizontal className="h-4 w-4" /></summary><div className="absolute bottom-12 right-0 z-10 w-44 rounded-xl border bg-white p-1.5 shadow-xl"><button disabled={item.isActive === false} onClick={() => setTarget(item)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-40"><Power className="h-4 w-4" />Deactivate</button></div></details>
        </div>
      </article>)}
    </div>}

    {editing ? <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4" onMouseDown={() => !pending && setEditing(null)}><form onSubmit={submit} onMouseDown={event => event.stopPropagation()} className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-black">{editing === "new" ? "Add denomination" : "Edit denomination"}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Currency<input required minLength={3} maxLength={3} value={form.faceCurrency} onChange={event => setForm(value => ({ ...value, faceCurrency: event.target.value.toUpperCase() }))} className={field} /></label><label className="text-sm font-semibold">Face Value<input required inputMode="decimal" value={form.faceValue} onChange={event => setForm(value => ({ ...value, faceValue: event.target.value }))} placeholder="20.00" className={field} /></label><label className="text-sm font-semibold">Customer Price (BDT)<input required inputMode="decimal" value={form.sellingPriceBdt} onChange={event => setForm(value => ({ ...value, sellingPriceBdt: event.target.value }))} placeholder="3000.00" className={field} /></label><label className="text-sm font-semibold">Sort Order<input type="number" min={0} step={1} value={form.sortOrder} onChange={event => setForm(value => ({ ...value, sortOrder: Number(event.target.value) }))} className={field} /></label></div><div className="mt-5 flex flex-wrap gap-5"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isPopular} onChange={event => setForm(value => ({ ...value, isPopular: event.target.checked }))} />Popular</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.isActive} onChange={event => setForm(value => ({ ...value, isActive: event.target.checked }))} />Active</label></div><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={pending} onClick={() => setEditing(null)} className="rounded-xl border px-4 py-2.5 text-sm font-bold">Cancel</button><button disabled={pending} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Save denomination</button></div></form></div> : null}
    <ConfirmDialog open={Boolean(target)} title="Deactivate denomination?" description="This prevents new purchases but preserves its inventory and order history." confirmLabel="Deactivate" loading={deactivate.isPending} onClose={() => setTarget(null)} onConfirm={() => target && deactivate.mutate(target.id, { onSuccess: () => { toast.success("Denomination deactivated"); setTarget(null); }, onError: error => toast.error("Could not deactivate", getGiftCardErrorMessage(error)) })} />
  </AdminShell>;
}
