"use client";

import { validateEmail } from "@/lib/validation";
import { Loader2, Mail, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { DeliveryEmailInput } from "@/types/gift-card";

export default function DeliveryEmailDialog({
  open,
  accountEmail,
  title = "Choose delivery email",
  submitLabel = "Continue",
  loading = false,
  onClose,
  onSubmit,
}: {
  open: boolean;
  accountEmail?: string | null;
  title?: string;
  submitLabel?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (input: DeliveryEmailInput) => void;
}) {
  const titleId = useId();
  const customInput = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"account" | "custom">(accountEmail ? "account" : "custom");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading, onClose, open]);

  useEffect(() => {
    if (open && mode === "custom") customInput.current?.focus();
  }, [mode, open]);

  if (!open) return null;

  const submit = () => {
    if (mode === "account") {
      if (!accountEmail) {
        setError("Your account does not have an email available.");
        return;
      }
      setError("");
      onSubmit({ useAccountEmail: true });
      return;
    }
    const validationError = validateEmail(email)[0];
    if (validationError) {
      setError(validationError.message);
      customInput.current?.focus();
      return;
    }
    setError("");
    onSubmit({ useAccountEmail: false, deliveryEmail: email.trim() });
  };

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm" role="presentation" onMouseDown={() => !loading && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-lg rounded-[1.75rem] bg-white p-6 shadow-2xl" onMouseDown={event => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Mail className="h-5 w-5" /></span><h2 id={titleId} className="mt-4 text-2xl font-black text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Your digital gift card will be delivered to this address. It is never placed in a URL or saved in browser storage.</p></div>
          <button type="button" aria-label="Close" disabled={loading} onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">Delivery email choice</legend>
          <label className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${mode === "account" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
            <input type="radio" name="deliveryEmailMode" checked={mode === "account"} disabled={!accountEmail || loading} onChange={() => { setMode("account"); setError(""); }} className="mt-1" />
            <span><span className="block text-sm font-bold text-slate-900">Use my account email</span><span className="mt-1 block text-sm text-slate-500">{accountEmail || "No account email available"}</span></span>
          </label>
          <label className={`block cursor-pointer rounded-2xl border p-4 ${mode === "custom" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
            <span className="flex gap-3"><input type="radio" name="deliveryEmailMode" checked={mode === "custom"} disabled={loading} onChange={() => { setMode("custom"); setError(""); }} /><span className="text-sm font-bold text-slate-900">Use another email</span></span>
            {mode === "custom" ? <input ref={customInput} type="email" autoComplete="email" value={email} disabled={loading} onChange={event => { setEmail(event.target.value); setError(""); }} onKeyDown={event => { if (event.key === "Enter") submit(); }} aria-invalid={Boolean(error)} aria-describedby={error ? `${titleId}-error` : undefined} placeholder="customer@example.com" className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /> : null}
          </label>
        </fieldset>
        {error ? <p id={`${titleId}-error`} role="alert" className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
        <button type="button" onClick={submit} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{submitLabel}</button>
      </section>
    </div>
  );
}
