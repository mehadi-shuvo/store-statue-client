"use client";

import {
  type AdminCategory,
  type AdminProduct,
  type AdminProductPayload,
  type GameTopUpPackage,
  type GiftCardDenomination,
  type ProductInputField,
  type ProductInputType,
  type ProductResourceType,
  type ProductStatus,
  type ProductUploadFiles,
  type SubscriptionPlan,
} from "@/lib/admin";
import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const statuses: ProductStatus[] = ["DRAFT", "ACTIVE", "INACTIVE", "OUT_OF_STOCK", "ARCHIVED"];
const inputTypes: ProductInputType[] = ["TEXT", "NUMBER", "EMAIL", "PHONE", "SELECT", "RADIO", "TEXTAREA"];
const fieldClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500";

const numberValue = (value: unknown, fallback = 0) => {
  const result = Number(value);
  return Number.isFinite(result) ? result : fallback;
};
const optional = (value: string) => value.trim() || undefined;
const lines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-1.5 text-sm font-semibold text-slate-700"><span>{label}</span>{children}</label>;
}

type FormState = {
  title: string; slug: string; description: string; subHeading: string; imageUrl: string;
  bannerImage: string; status: ProductStatus; isFeatured: boolean; sortOrder: number; categoryId: string;
  brand: string; cardCurrency: string; region: string; giftDeliveryType: string;
  name: string; gameCurrencyName: string; fulfillmentType: string;
  platformName: string; subscriptionDeliveryType: string; isRenewable: boolean;
  instructions: string; estimatedDelivery: string; termsAndConditions: string;
  denominations: GiftCardDenomination[]; packages: GameTopUpPackage[];
  plans: SubscriptionPlan[]; inputFields: ProductInputField[];
};

const blankDenomination: GiftCardDenomination = { title: "", sellingPriceBDT: 0, cardValue: 0, cardCurrency: "USD", stockQuantity: null, isActive: true };
const blankPackage: GameTopUpPackage = { title: "", sellingPriceBDT: 0, gameCurrencyAmount: 0, bonusCurrencyAmount: 0, stockQuantity: null, isActive: true };
const blankPlan: SubscriptionPlan = { title: "", sellingPriceBDT: 0, billingCycle: "MONTHLY", features: [], stockQuantity: null, isActive: true };
const blankInput: ProductInputField = { name: "", label: "", type: "TEXT", placeholder: "", helpText: "", isRequired: true, options: [], isActive: true, sortOrder: 0 };

function initialState(type: ProductResourceType, product?: AdminProduct | null): FormState {
  const gift = product?.productType === "GIFT_CARD" ? product : null;
  const topUp = product?.productType === "GAME_TOP_UP" ? product : null;
  const subscription = product?.productType === "SUBSCRIPTION" ? product : null;
  return {
    title: product?.title ?? "", slug: product?.slug ?? "", description: product?.description ?? "",
    subHeading: topUp?.subHeading ?? subscription?.subHeading ?? "",
    imageUrl: gift?.image ?? topUp?.logo ?? subscription?.logo ?? "",
    bannerImage: product?.bannerImage ?? "", status: product?.status ?? "DRAFT",
    isFeatured: product?.isFeatured ?? false, sortOrder: numberValue(product?.sortOrder),
    categoryId: product?.categoryId ?? product?.category?.id ?? "",
    brand: gift?.brand ?? "", cardCurrency: gift?.cardCurrency ?? "USD", region: gift?.region ?? "GLOBAL",
    giftDeliveryType: gift?.deliveryType ?? "CODE", name: topUp?.name ?? "",
    gameCurrencyName: topUp?.gameCurrencyName ?? "", fulfillmentType: topUp?.fulfillmentType ?? "PLAYER_ID",
    platformName: subscription?.platformName ?? "", subscriptionDeliveryType: subscription?.deliveryType ?? "ACCOUNT_CREDENTIALS",
    isRenewable: subscription?.isRenewable ?? true,
    instructions: gift?.instructions ?? topUp?.instructions ?? subscription?.instructions ?? "",
    estimatedDelivery: topUp?.estimatedDelivery ?? subscription?.estimatedDelivery ?? "",
    termsAndConditions: gift?.termsAndConditions ?? topUp?.termsAndConditions ?? subscription?.termsAndConditions ?? "",
    denominations: gift?.denominations?.length ? gift.denominations : [{ ...blankDenomination }],
    packages: topUp?.packages?.length ? topUp.packages : [{ ...blankPackage }],
    plans: subscription?.plans?.length ? subscription.plans : [{ ...blankPlan }],
    inputFields: topUp?.inputFields?.length ? topUp.inputFields : subscription?.inputFields?.length ? subscription.inputFields : [{ ...blankInput }],
  };
}

function CollectionEditor<T extends { sellingPriceBDT: number; title?: string; stockQuantity?: number | null }>({
  label, items, blank, kind, onChange,
}: { label: string; items: T[]; blank: T; kind: "denomination" | "package" | "plan"; onChange: (items: T[]) => void }) {
  const patch = (index: number, value: Partial<T>) => onChange(items.map((item, i) => i === index ? { ...item, ...value } : item));
  return <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between"><h3 className="font-bold">{label}</h3><button type="button" onClick={() => onChange([...items, { ...blank }])} className="inline-flex items-center gap-1 rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Add</button></div>
    <div className="mt-4 space-y-3">{items.map((item, index) => {
      const plan = item as unknown as SubscriptionPlan;
      return <div key={index} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 md:grid-cols-2 lg:grid-cols-4">
        <input required={kind === "plan"} className={fieldClass} placeholder="Title" value={item.title ?? ""} onChange={(e) => patch(index, { title: e.target.value } as Partial<T>)} />
        <input required min="0" type="number" className={fieldClass} placeholder="Selling price BDT" value={item.sellingPriceBDT} onChange={(e) => patch(index, { sellingPriceBDT: numberValue(e.target.value) } as Partial<T>)} />
        {kind === "denomination" ? <input required min="0" type="number" className={fieldClass} placeholder="Card value" value={(item as unknown as GiftCardDenomination).cardValue} onChange={(e) => patch(index, { cardValue: numberValue(e.target.value) } as unknown as Partial<T>)} /> : null}
        {kind === "package" ? <><input required min="0" type="number" className={fieldClass} placeholder="Currency amount" value={(item as unknown as GameTopUpPackage).gameCurrencyAmount} onChange={(e) => patch(index, { gameCurrencyAmount: numberValue(e.target.value) } as unknown as Partial<T>)} /><input min="0" type="number" className={fieldClass} placeholder="Bonus amount" value={(item as unknown as GameTopUpPackage).bonusCurrencyAmount ?? 0} onChange={(e) => patch(index, { bonusCurrencyAmount: numberValue(e.target.value) } as unknown as Partial<T>)} /></> : null}
        {kind === "plan" ? <><select className={fieldClass} value={plan.billingCycle} onChange={(e) => patch(index, { billingCycle: e.target.value } as unknown as Partial<T>)}>{["DAILY","WEEKLY","MONTHLY","QUARTERLY","HALF_YEARLY","YEARLY","LIFETIME","CUSTOM"].map(v => <option key={v}>{v}</option>)}</select>{plan.billingCycle === "CUSTOM" ? <><input required={!plan.durationLabel} min="1" type="number" className={fieldClass} placeholder="Duration days" value={plan.durationDays ?? ""} onChange={(e) => patch(index, { durationDays: e.target.value ? numberValue(e.target.value) : undefined } as unknown as Partial<T>)} /><input required={!plan.durationDays} className={fieldClass} placeholder="Duration label" value={plan.durationLabel ?? ""} onChange={(e) => patch(index, { durationLabel: e.target.value } as unknown as Partial<T>)} /></> : null}<textarea className={fieldClass} placeholder="Features, one per line" value={(plan.features ?? []).join("\n")} onChange={(e) => patch(index, { features: lines(e.target.value) } as unknown as Partial<T>)} /></> : null}
        <input min="0" type="number" className={fieldClass} placeholder="Stock (blank = unlimited)" value={item.stockQuantity ?? ""} onChange={(e) => patch(index, { stockQuantity: e.target.value === "" ? null : numberValue(e.target.value) } as Partial<T>)} />
        <button type="button" disabled={items.length === 1} onClick={() => onChange(items.filter((_, i) => i !== index))} className="rounded-xl border border-rose-200 px-3 py-2 text-rose-700 disabled:opacity-40"><Trash2 className="mx-auto h-4 w-4" /></button>
      </div>;
    })}</div>
  </section>;
}

function InputFields({ fields, onChange }: { fields: ProductInputField[]; onChange: (fields: ProductInputField[]) => void }) {
  const patch = (index: number, value: Partial<ProductInputField>) => onChange(fields.map((field, i) => i === index ? { ...field, ...value } : field));
  return <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between"><h3 className="font-bold">Customer input fields</h3><button type="button" onClick={() => onChange([...fields, { ...blankInput }])} className="rounded-xl bg-slate-950 px-3 py-2 text-xs text-white">Add field</button></div>
    <div className="mt-4 space-y-3">{fields.map((field, index) => <div key={index} className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-2 lg:grid-cols-4">
      <input required className={fieldClass} placeholder="Name" value={field.name} onChange={(e) => patch(index, { name: e.target.value })} />
      <input required className={fieldClass} placeholder="Label" value={field.label} onChange={(e) => patch(index, { label: e.target.value })} />
      <select className={fieldClass} value={field.type} onChange={(e) => patch(index, { type: e.target.value as ProductInputType })}>{inputTypes.map(type => <option key={type}>{type}</option>)}</select>
      <input className={fieldClass} placeholder="Placeholder" value={field.placeholder ?? ""} onChange={(e) => patch(index, { placeholder: e.target.value })} />
      <input className={fieldClass} placeholder="Help text" value={field.helpText ?? ""} onChange={(e) => patch(index, { helpText: e.target.value })} />
      {field.type === "SELECT" || field.type === "RADIO" ? <textarea className={fieldClass} placeholder="Options: Label|value, one per line" value={(field.options ?? []).map(o => `${o.label}|${o.value}`).join("\n")} onChange={(e) => patch(index, { options: lines(e.target.value).map(row => { const [label, value = label] = row.split("|"); return { label, value }; }) })} /> : null}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={field.isRequired ?? false} onChange={(e) => patch(index, { isRequired: e.target.checked })} />Required</label>
      <button type="button" disabled={fields.length === 1} onClick={() => onChange(fields.filter((_, i) => i !== index))} className="rounded-xl border border-rose-200 text-rose-700 disabled:opacity-40">Remove</button>
    </div>)}</div></section>;
}

export default function ProductForm({ categories, product, type, submitting, submitLabel, onSubmit }: {
  categories: AdminCategory[]; product?: AdminProduct | null; type: ProductResourceType;
  submitting?: boolean; submitLabel: string; onSubmit: (payload: AdminProductPayload, files: ProductUploadFiles) => Promise<void>;
}) {
  const [form, setForm] = useState(() => initialState(type, product));
  const [imageFile, setImageFile] = useState<File>();
  const [bannerFile, setBannerFile] = useState<File>();
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(current => ({ ...current, [key]: value }));
  const categoryOptions = useMemo(() => categories.map(c => ({ id: c.id, label: c.title || c.name || "Untitled" })), [categories]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const common = { title: form.title.trim(), slug: form.slug.trim(), description: optional(form.description), bannerImage: optional(form.bannerImage), status: form.status, isFeatured: form.isFeatured, sortOrder: numberValue(form.sortOrder), categoryId: optional(form.categoryId) };
    const files = { image: type === "GAME_TOP_UP" ? undefined : imageFile, bannerImage: bannerFile };
    if (type === "GIFT_CARD") return onSubmit({ ...common, brand: form.brand.trim(), image: form.imageUrl.trim(), cardCurrency: form.cardCurrency.trim() || "USD", region: form.region as never, deliveryType: form.giftDeliveryType as never, instructions: optional(form.instructions), termsAndConditions: optional(form.termsAndConditions), denominations: form.denominations }, files);
    const inputFields = form.inputFields.map(field => ({ ...field, placeholder: optional(field.placeholder ?? ""), helpText: optional(field.helpText ?? ""), options: field.type === "SELECT" || field.type === "RADIO" ? field.options : undefined }));
    if (type === "GAME_TOP_UP") return onSubmit({ ...common, name: form.name.trim(), subHeading: optional(form.subHeading), logo: form.imageUrl.trim(), gameCurrencyName: form.gameCurrencyName.trim(), fulfillmentType: form.fulfillmentType as never, instructions: optional(form.instructions), estimatedDelivery: optional(form.estimatedDelivery), termsAndConditions: optional(form.termsAndConditions), packages: form.packages, inputFields }, files);
    return onSubmit({ ...common, platformName: form.platformName.trim(), subHeading: optional(form.subHeading), logo: form.imageUrl.trim(), deliveryType: form.subscriptionDeliveryType as never, instructions: optional(form.instructions), estimatedDelivery: optional(form.estimatedDelivery), termsAndConditions: optional(form.termsAndConditions), isRenewable: form.isRenewable, plans: form.plans, inputFields }, files);
  };
  return <form onSubmit={submit} className="space-y-5">
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Field label="Title"><input required className={fieldClass} value={form.title} onChange={e => set("title", e.target.value)} /></Field>
      <Field label="Slug"><input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className={fieldClass} value={form.slug} onChange={e => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))} /></Field>
      {type === "GIFT_CARD" ? <Field label="Brand"><input required className={fieldClass} value={form.brand} onChange={e => set("brand", e.target.value)} /></Field> : null}
      {type === "GAME_TOP_UP" ? <Field label="Name"><input required className={fieldClass} value={form.name} onChange={e => set("name", e.target.value)} /></Field> : null}
      {type === "SUBSCRIPTION" ? <Field label="Platform name"><input required className={fieldClass} value={form.platformName} onChange={e => set("platformName", e.target.value)} /></Field> : null}
      <Field label={type === "GIFT_CARD" ? "Product image" : "Product logo"}><input required={type !== "GAME_TOP_UP" && !product && !form.imageUrl} disabled={type === "GAME_TOP_UP"} type="file" accept="image/*" className={fieldClass} onChange={e => setImageFile(e.target.files?.[0])} />{type === "GAME_TOP_UP" ? <span className="block text-xs font-normal text-amber-700">Game top-up file upload is blocked by the current backend; use a hosted logo URL.</span> : imageFile ? <span className="block truncate text-xs font-normal text-emerald-700">Selected: {imageFile.name}</span> : form.imageUrl ? <span className="block truncate text-xs font-normal text-slate-500">Current image: {form.imageUrl}</span> : null}</Field>
      {type === "GAME_TOP_UP" ? <Field label="Hosted logo URL"><input required className={fieldClass} type="url" value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" /></Field> : null}
      <Field label="Banner image"><input type="file" accept="image/*" className={fieldClass} onChange={e => setBannerFile(e.target.files?.[0])} />{bannerFile ? <span className="block truncate text-xs font-normal text-emerald-700">Selected: {bannerFile.name}</span> : form.bannerImage ? <span className="block truncate text-xs font-normal text-slate-500">Current banner: {form.bannerImage}</span> : null}</Field>
      <Field label="Status"><select className={fieldClass} value={form.status} onChange={e => set("status", e.target.value as ProductStatus)}>{statuses.map(v => <option key={v}>{v}</option>)}</select></Field>
      <Field label="Category"><select className={fieldClass} value={form.categoryId} onChange={e => set("categoryId", e.target.value)}><option value="">No category</option>{categoryOptions.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></Field>
      <Field label="Sort order"><input type="number" className={fieldClass} value={form.sortOrder} onChange={e => set("sortOrder", numberValue(e.target.value))} /></Field>
      <label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={e => set("isFeatured", e.target.checked)} />Featured</label>
      {type !== "GIFT_CARD" ? <Field label="Sub heading"><input className={fieldClass} value={form.subHeading} onChange={e => set("subHeading", e.target.value)} /></Field> : null}
      {type === "GIFT_CARD" ? <><Field label="Card currency"><input required className={fieldClass} value={form.cardCurrency} onChange={e => set("cardCurrency", e.target.value.toUpperCase())} /></Field><Field label="Region"><select className={fieldClass} value={form.region} onChange={e => set("region", e.target.value)}>{["GLOBAL","USA","UK","CANADA","EUROPE","AUSTRALIA","INDIA","BANGLADESH","SINGAPORE","JAPAN","UAE","OTHER"].map(v => <option key={v}>{v}</option>)}</select></Field><Field label="Delivery type"><select className={fieldClass} value={form.giftDeliveryType} onChange={e => set("giftDeliveryType", e.target.value)}>{["CODE","LINK","MANUAL","ACCOUNT_RECHARGE"].map(v => <option key={v}>{v}</option>)}</select></Field></> : null}
      {type === "GAME_TOP_UP" ? <><Field label="Game currency name"><input required className={fieldClass} value={form.gameCurrencyName} onChange={e => set("gameCurrencyName", e.target.value)} /></Field><Field label="Fulfillment type"><select required className={fieldClass} value={form.fulfillmentType} onChange={e => set("fulfillmentType", e.target.value)}>{["PLAYER_ID","PLAYER_ID_AND_SERVER","EMAIL","PHONE","LOGIN_CREDENTIALS","REDEEM_CODE","MANUAL"].map(v => <option key={v}>{v}</option>)}</select></Field></> : null}
      {type === "SUBSCRIPTION" ? <><Field label="Delivery type"><select required className={fieldClass} value={form.subscriptionDeliveryType} onChange={e => set("subscriptionDeliveryType", e.target.value)}>{["ACCOUNT_CREDENTIALS","CUSTOMER_ACCOUNT_ACTIVATION","FAMILY_INVITATION","REDEEM_CODE","LICENSE_KEY","MANUAL"].map(v => <option key={v}>{v}</option>)}</select></Field><label className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"><input type="checkbox" checked={form.isRenewable} onChange={e => set("isRenewable", e.target.checked)} />Renewable</label></> : null}
    </div><div className="mt-4 grid gap-4 md:grid-cols-2"><Field label="Description"><textarea className={fieldClass} rows={3} value={form.description} onChange={e => set("description", e.target.value)} /></Field><Field label="Instructions"><textarea className={fieldClass} rows={3} value={form.instructions} onChange={e => set("instructions", e.target.value)} /></Field>{type !== "GIFT_CARD" ? <Field label="Estimated delivery"><input className={fieldClass} value={form.estimatedDelivery} onChange={e => set("estimatedDelivery", e.target.value)} /></Field> : null}<Field label="Terms and conditions"><textarea className={fieldClass} rows={3} value={form.termsAndConditions} onChange={e => set("termsAndConditions", e.target.value)} /></Field></div></section>
    {type === "GIFT_CARD" ? <CollectionEditor label="Denominations" kind="denomination" items={form.denominations} blank={blankDenomination} onChange={items => set("denominations", items)} /> : null}
    {type === "GAME_TOP_UP" ? <><CollectionEditor label="Packages" kind="package" items={form.packages} blank={blankPackage} onChange={items => set("packages", items)} /><InputFields fields={form.inputFields} onChange={items => set("inputFields", items)} /></> : null}
    {type === "SUBSCRIPTION" ? <><CollectionEditor label="Plans" kind="plan" items={form.plans} blank={blankPlan} onChange={items => set("plans", items)} /><InputFields fields={form.inputFields} onChange={items => set("inputFields", items)} /></> : null}
    <div className="flex justify-end"><button disabled={submitting} className="rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{submitting ? "Saving..." : submitLabel}</button></div>
  </form>;
}
