"use client";

import AdminShell from "@/components/admin/AdminShell";
import { ConfirmDialog, EmptyState, ErrorState, LoadingState, PageHeader, Pagination, StatusBadge } from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  useAddGiftCardCode,
  useAddGiftCardCodes,
  useAdminGiftCard,
  useDeleteGiftCardCode,
  useGiftCardCode,
  useGiftCardCodes,
  useGiftCardDenominations,
  useGiftCardInventorySummary,
  useUpdateGiftCardCode,
} from "@/hooks/api/use-gift-card-api";
import { formatMoney, formatMoneyCode, getGiftCardErrorMessage, maskSecret } from "@/lib/gift-card";
import type { GiftCardCode, GiftCardCodeInput, GiftCardCodeStatus, GiftCardStockCounts } from "@/types/gift-card";
import { AlertTriangle, Boxes, Eye, KeyRound, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

const statuses: GiftCardCodeStatus[] = ["AVAILABLE", "RESERVED", "SOLD", "DISABLED", "EXPIRED"];
const stockKeys: Array<keyof Pick<GiftCardStockCounts, "available" | "reserved" | "sold" | "disabled" | "expired">> = ["available", "reserved", "sold", "disabled", "expired"];
export const giftCardCodeTransitions: Record<GiftCardCodeStatus, GiftCardCodeStatus[]> = {
  AVAILABLE: ["DISABLED", "EXPIRED"],
  RESERVED: ["AVAILABLE"],
  DISABLED: ["AVAILABLE", "EXPIRED"],
  SOLD: [],
  EXPIRED: ["DISABLED"],
};
const field = "rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export type BulkGiftCardParseResult = {
  detected: number;
  rows: GiftCardCodeInput[];
  duplicates: string[];
  invalid: number;
};

export function parseBulkGiftCardCodes(text: string): BulkGiftCardParseResult {
  const parsed = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const [code = "", pin = "", expiryDate = ""] = line.split(/[\t,]/).map(value => value.trim());
    return { code, pin: pin || null, expiryDate: expiryDate || null };
  });
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  let invalid = 0;
  const rows = parsed.filter(row => {
    const normalized = row.code.toLocaleUpperCase();
    const validExpiry = !row.expiryDate || /^\d{4}-\d{2}-\d{2}$/.test(row.expiryDate) && !Number.isNaN(Date.parse(row.expiryDate));
    const valid = row.code.length >= 4 && row.code.length <= 500 && validExpiry;
    if (!valid) invalid += 1;
    if (seen.has(normalized)) duplicates.add(maskSecret(row.code));
    seen.add(normalized);
    return valid;
  });
  return { detected: parsed.length, rows, duplicates: [...duplicates], invalid };
}

function SummaryCards({ stock }: { stock: GiftCardStockCounts }) {
  return <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white"><p className="text-xs font-bold uppercase tracking-wider text-slate-300">Total</p><p className="mt-2 text-3xl font-black">{stock.total}</p></div>
    {stockKeys.map(key => <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{key}</p><p className="mt-2 text-3xl font-black text-slate-950">{stock[key]}</p></div>)}
  </div>;
}

export default function GiftCardInventoryManager({ initialDenominationId, productId = "" }: { initialDenominationId: string; productId?: string }) {
  const toast = useToast();
  const scoped = Boolean(productId);
  const product = useAdminGiftCard(productId);
  const denominations = useGiftCardDenominations(productId);
  const summary = useGiftCardInventorySummary(!scoped);
  const [denominationId, setDenominationId] = useState(initialDenominationId);
  const [status, setStatus] = useState<GiftCardCodeStatus | "">("");
  const [expiryBefore, setExpiryBefore] = useState("");
  const [expiryAfter, setExpiryAfter] = useState("");
  const [page, setPage] = useState(1);
  const [singleOpen, setSingleOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [single, setSingle] = useState({ code: "", pin: "", serialNumber: "", expiryDate: "" });
  const [bulk, setBulk] = useState("");
  const [detailId, setDetailId] = useState("");
  const [action, setAction] = useState<{ code: GiftCardCode; status?: GiftCardCodeStatus; delete?: boolean } | null>(null);
  const filters = useMemo(() => ({ page, limit: 20, status: status || undefined, expiryBefore: expiryBefore || undefined, expiryAfter: expiryAfter || undefined }), [expiryAfter, expiryBefore, page, status]);
  const codes = useGiftCardCodes(denominationId, filters);
  const detail = useGiftCardCode(detailId, Boolean(detailId));
  const addOne = useAddGiftCardCode(denominationId, productId);
  const addBulk = useAddGiftCardCodes(denominationId, productId);
  const update = useUpdateGiftCardCode(denominationId, productId);
  const remove = useDeleteGiftCardCode(denominationId, productId);
  const parsed = useMemo(() => parseBulkGiftCardCodes(bulk), [bulk]);
  const denomination = denominations.data?.find(item => item.id === denominationId) ?? product.data?.denominations.find(item => item.id === denominationId);
  const productName = product.data?.name || product.data?.title || "Gift card";

  const clearSensitiveForms = () => {
    setSingle({ code: "", pin: "", serialNumber: "", expiryDate: "" });
    setBulk("");
    setSingleOpen(false);
    setBulkOpen(false);
  };
  const submitSingle = (event: FormEvent) => {
    event.preventDefault();
    addOne.mutate({ code: single.code.trim(), pin: single.pin.trim() || null, serialNumber: single.serialNumber.trim() || null, expiryDate: single.expiryDate || null }, {
      onSuccess: () => { clearSensitiveForms(); toast.success("Inventory added"); },
      onError: error => toast.error("Could not add inventory", getGiftCardErrorMessage(error)),
    });
  };
  const submitBulk = () => {
    if (!parsed.detected) return toast.error("No codes to insert");
    if (parsed.detected > 500) return toast.error("Too many codes", "A request can contain at most 500 codes.");
    if (parsed.invalid) return toast.error("Invalid rows found", `${parsed.invalid} invalid row(s) must be corrected.`);
    if (parsed.duplicates.length) return toast.error("Duplicate rows found", `${parsed.duplicates.length} duplicate code(s) must be removed.`);
    addBulk.mutate(parsed.rows, { onSuccess: result => { clearSensitiveForms(); toast.success("Inventory added", `${result.inserted} code(s) added.`); }, onError: error => toast.error("Bulk insert failed", getGiftCardErrorMessage(error)) });
  };
  const uploadCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 1_000_000) return toast.error("CSV is too large", "Use a file smaller than 1 MB and at most 500 rows.");
    file.text().then(setBulk).catch(() => toast.error("Could not read CSV"));
  };

  const scopedLoading = scoped && (product.isLoading || denominations.isLoading);
  const scopedError = scoped && (product.isError || denominations.isError || !denomination && !scopedLoading);

  return <AdminShell allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
    {scoped ? <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500"><Link href="/admin/gift-cards" className="hover:text-blue-700">Gift Cards</Link><span>/</span><Link href={`/admin/gift-cards/${productId}`} className="hover:text-blue-700">{productName}</Link><span>/</span><Link href={`/admin/gift-cards/${productId}/denominations`} className="hover:text-blue-700">{denomination ? `${denomination.faceCurrency} ${denomination.faceValue}` : "Denomination"}</Link><span>/</span><span className="text-slate-800">Inventory</span></nav> : null}
    <PageHeader eyebrow={scoped ? productName : "Gift cards"} title={denomination ? formatMoneyCode(denomination.faceValue, denomination.faceCurrency) : "Inventory"} description={denomination ? `Customer price: ${formatMoney(denomination.sellingPriceBdt, "BDT")}. Codes remain masked until an authorized admin explicitly opens one.` : "Code values stay masked in lists and are never saved as drafts."} action={<div className="flex gap-2"><button disabled={!denominationId} onClick={() => setSingleOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"><Plus className="h-4 w-4" />Add Inventory</button><button disabled={!denominationId} onClick={() => setBulkOpen(true)} className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold disabled:opacity-40"><Boxes className="h-4 w-4" />Bulk add</button></div>} />

    {scopedLoading ? <LoadingState label="Loading denomination inventory…" /> : scopedError ? <ErrorState message="Could not load this denomination. Return to the product and try again." onRetry={() => { product.refetch(); denominations.refetch(); }} /> : denomination?.stock ? <SummaryCards stock={denomination.stock} /> : !scoped && summary.isLoading ? <LoadingState label="Loading inventory summary…" /> : !scoped && summary.isError ? <ErrorState message="Could not load inventory summary." onRetry={() => summary.refetch()} /> : !scoped && summary.data ? <><SummaryCards stock={summary.data} />{summary.data.lowStock.length ? <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="flex items-center gap-2 font-black text-amber-950"><AlertTriangle className="h-5 w-5" />Low stock</h2><div className="mt-3 flex flex-wrap gap-2">{summary.data.lowStock.map(item => <button key={item.denominationId} onClick={() => { setDenominationId(item.denominationId); setPage(1); }} className="rounded-xl bg-white px-3 py-2 text-left text-xs font-bold text-amber-900 shadow-sm">{item.giftCardName} · {formatMoney(item.faceValue, item.faceCurrency)} · {item.available} available</button>)}</div></div> : null}</> : null}

    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
      {!scoped ? <label className="block text-sm font-bold text-slate-800">Denomination ID<input value={denominationId} onChange={event => { setDenominationId(event.target.value.trim()); setPage(1); }} placeholder="Open inventory from a gift-card product" className={`mt-2 w-full ${field}`} /></label> : null}
      <div className="flex flex-wrap gap-2" aria-label="Inventory status filters"><button onClick={() => { setStatus(""); setPage(1); }} className={`rounded-full px-3 py-2 text-xs font-bold ${!status ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>All</button>{statuses.map(value => <button key={value} onClick={() => { setStatus(value); setPage(1); }} className={`rounded-full px-3 py-2 text-xs font-bold ${status === value ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600"}`}>{value.toLowerCase().replace(/^./, character => character.toUpperCase())}</button>)}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-xs font-bold text-slate-500">Expiry after<input type="date" value={expiryAfter} onChange={event => { setExpiryAfter(event.target.value); setPage(1); }} className={`mt-1 w-full ${field}`} /></label><label className="text-xs font-bold text-slate-500">Expiry before<input type="date" value={expiryBefore} onChange={event => { setExpiryBefore(event.target.value); setPage(1); }} className={`mt-1 w-full ${field}`} /></label></div>
    </section>

    <div className="mt-5">{!denominationId ? <EmptyState title="Choose a denomination" description="Open Manage Inventory from a gift-card denomination." /> : codes.isLoading ? <LoadingState label="Loading masked inventory…" /> : codes.isError ? <ErrorState message="Could not load inventory codes." onRetry={() => codes.refetch()} /> : !codes.data?.data.length ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><p className="font-black text-slate-950">No inventory codes available for this denomination.</p><button onClick={() => setSingleOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Add Inventory</button></div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Order</th><th className="px-4 py-3">Expiry</th><th className="px-4 py-3">Added</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y">{codes.data.data.map(code => <tr key={code.id}><td className="px-4 py-3 font-mono font-bold">{code.maskedCode || "••••"}</td><td className="px-4 py-3"><StatusBadge value={code.status} /></td><td className="px-4 py-3 text-slate-500">{code.orderItemId ? "Assigned" : "—"}</td><td className="px-4 py-3 text-slate-500">{code.expiryDate ? new Date(code.expiryDate).toLocaleDateString() : "Never"}</td><td className="px-4 py-3 text-slate-500">{code.createdAt ? new Date(code.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-3"><div className="flex justify-end gap-2"><button onClick={() => setDetailId(code.id)} className="rounded-lg border p-2" aria-label="View authorized code detail"><Eye className="h-4 w-4" /></button>{giftCardCodeTransitions[code.status].map(next => <button key={next} onClick={() => setAction({ code, status: next })} className="rounded-lg border px-2.5 py-2 text-xs font-bold">{next === "AVAILABLE" ? "Enable" : next === "DISABLED" ? "Disable" : `Mark ${next.toLowerCase()}`}</button>)}<button disabled={["SOLD", "RESERVED"].includes(code.status)} onClick={() => setAction({ code, delete: true })} className="rounded-lg border p-2 text-rose-700 disabled:opacity-30" aria-label="Delete eligible code"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div><div className="p-4"><Pagination page={page} pageCount={codes.data.meta.totalPages} onPageChange={setPage} /></div></div>}</div>

    {singleOpen ? <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4" onMouseDown={() => !addOne.isPending && clearSensitiveForms()}><form onSubmit={submitSingle} onMouseDown={event => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6"><div className="flex justify-between"><div><h2 className="text-xl font-black">Add Inventory</h2><p className="mt-1 text-sm text-slate-500">This code will belong to {denomination ? formatMoney(denomination.faceValue, denomination.faceCurrency) : "the selected denomination"}.</p></div><button type="button" aria-label="Close" onClick={clearSensitiveForms}><X className="h-5 w-5" /></button></div><div className="mt-5 grid gap-3"><label className="text-xs font-bold text-slate-600">Gift Card Code *<input required minLength={4} maxLength={500} autoComplete="off" value={single.code} onChange={event => setSingle(value => ({ ...value, code: event.target.value }))} className={`mt-1 w-full ${field}`} /></label><label className="text-xs font-bold text-slate-600">PIN<input autoComplete="off" value={single.pin} onChange={event => setSingle(value => ({ ...value, pin: event.target.value }))} className={`mt-1 w-full ${field}`} /></label><label className="text-xs font-bold text-slate-600">Serial / Internal Reference<input autoComplete="off" value={single.serialNumber} onChange={event => setSingle(value => ({ ...value, serialNumber: event.target.value }))} className={`mt-1 w-full ${field}`} /></label><label className="text-xs font-bold text-slate-600">Expiry Date<input type="date" value={single.expiryDate} onChange={event => setSingle(value => ({ ...value, expiryDate: event.target.value }))} className={`mt-1 w-full ${field}`} /></label></div><button disabled={addOne.isPending} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">{addOne.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Add Inventory</button></form></div> : null}

    {bulkOpen ? <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4" onMouseDown={() => !addBulk.isPending && clearSensitiveForms()}><section onMouseDown={event => event.stopPropagation()} className="w-full max-w-2xl rounded-2xl bg-white p-6"><div className="flex justify-between"><div><h2 className="text-xl font-black">Bulk Add Inventory</h2><p className="mt-1 text-sm text-slate-500">One row per code: <code>code,pin,YYYY-MM-DD</code>. Maximum 500.</p></div><button aria-label="Close" onClick={clearSensitiveForms}><X className="h-5 w-5" /></button></div><textarea autoFocus autoComplete="off" value={bulk} onChange={event => setBulk(event.target.value)} rows={12} className={`mt-5 w-full font-mono ${field}`} placeholder={'DEMO-001,,2027-12-31\nDEMO-002,1234,2027-12-31'} /><div className="mt-3 flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold"><Upload className="h-4 w-4" />Upload CSV<input type="file" accept=".csv,text/csv,text/plain" onChange={uploadCsv} className="sr-only" /></label></div><div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4"><div className="rounded-lg bg-slate-50 p-2"><strong className="block text-lg">{parsed.detected}</strong>Detected</div><div className="rounded-lg bg-emerald-50 p-2 text-emerald-800"><strong className="block text-lg">{parsed.rows.length - parsed.duplicates.length}</strong>Valid</div><div className="rounded-lg bg-amber-50 p-2 text-amber-800"><strong className="block text-lg">{parsed.duplicates.length}</strong>Duplicates</div><div className="rounded-lg bg-rose-50 p-2 text-rose-800"><strong className="block text-lg">{parsed.invalid}</strong>Invalid</div></div><button disabled={addBulk.isPending || !parsed.detected || Boolean(parsed.duplicates.length) || Boolean(parsed.invalid) || parsed.detected > 500} onClick={submitBulk} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{addBulk.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Add {parsed.detected} code(s)</button></section></div> : null}

    {detailId ? <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4" onMouseDown={() => setDetailId("")}><section onMouseDown={event => event.stopPropagation()} className="w-full max-w-lg rounded-2xl bg-white p-6"><div className="flex justify-between"><div><KeyRound className="h-6 w-6 text-blue-700" /><h2 className="mt-3 text-xl font-black">Authorized code detail</h2><p className="mt-1 text-sm text-slate-500">Sensitive values are fetched only for this view.</p></div><button aria-label="Close" onClick={() => setDetailId("")}><X className="h-5 w-5" /></button></div>{detail.isLoading ? <div className="mt-5"><LoadingState /></div> : detail.isError ? <div className="mt-5"><ErrorState message="Could not load code detail." /></div> : detail.data ? <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4"><p><span className="text-xs font-bold text-slate-500">CODE</span><span className="mt-1 block break-all font-mono font-black">{detail.data.code || detail.data.maskedCode}</span></p>{detail.data.pin ? <p><span className="text-xs font-bold text-slate-500">PIN</span><span className="mt-1 block font-mono font-black">{detail.data.pin}</span></p> : null}<StatusBadge value={detail.data.status} /></div> : null}</section></div> : null}
    <ConfirmDialog open={Boolean(action)} title={action?.delete ? "Delete inventory code?" : `Change status to ${action?.status?.toLowerCase()}?`} description={action?.delete ? "Only an unallocated, unsold, and unreserved code can be deleted. The backend enforces eligibility." : "The backend remains authoritative and will validate this inventory state transition."} confirmLabel={action?.delete ? "Delete" : "Change status"} loading={update.isPending || remove.isPending} onClose={() => setAction(null)} onConfirm={() => { if (!action) return; const mutation = action.delete ? remove.mutateAsync(action.code.id) : update.mutateAsync({ id: action.code.id, input: { status: action.status } }); mutation.then(() => { toast.success(action.delete ? "Code deleted" : "Status updated"); setAction(null); }).catch(error => toast.error("Inventory update failed", getGiftCardErrorMessage(error))); }} />
  </AdminShell>;
}
