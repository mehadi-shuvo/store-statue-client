"use client";
import AdminShell from "@/components/admin/AdminShell";
import {
  ConfirmDialog,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  useAdminFields,
  useAdminGame,
  useAdminPackages,
  useDeactivateField,
  useDeactivatePackage,
  useSaveField,
  useSavePackage,
} from "@/hooks/api/use-game-top-up-api";
import {
  formatMoney,
  getGiftCardErrorMessage,
  isValidDecimalString,
} from "@/lib/gift-card";
import { getGameSetupStatus } from "@/lib/game-top-up";
import type {
  AccountFieldInput,
  GameAccountField,
  GameTopUpPackage,
  PackageInput,
} from "@/types/game-top-up";
import type { ProductInputType } from "@/types/api";
import { Eye, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import GameTopUpPreviewDialog from "./GameTopUpPreviewDialog";

type Tab = "overview" | "packages" | "account-fields";
const fieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500";
const blankPackage: PackageInput = {
  name: "",
  coinAmount: 0,
  bonusAmount: 0,
  priceBdt: "",
  isActive: true,
  isPopular: false,
  sortOrder: 0,
  stockQuantity: null,
};
const blankField: AccountFieldInput = {
  key: "",
  label: "",
  type: "TEXT",
  placeholder: "",
  helpText: "",
  required: true,
  isActive: true,
  sortOrder: 0,
};
const forbidden =
  /(password|passcode|secret|otp|authToken|accessToken|facebookPassword|gmailPassword)/i;

export default function AdminGameManager({
  gameId,
  initialTab = "overview",
}: {
  gameId: string;
  initialTab?: Tab;
}) {
  const toast = useToast();
  const game = useAdminGame(gameId);
  const packages = useAdminPackages(gameId);
  const fields = useAdminFields(gameId);
  const savePackage = useSavePackage(gameId);
  const saveField = useSaveField(gameId);
  const deactivatePackage = useDeactivatePackage(gameId);
  const deactivateField = useDeactivateField(gameId);
  const [packageEditing, setPackageEditing] = useState<
    GameTopUpPackage | "new" | null
  >(null);
  const [packageForm, setPackageForm] = useState<PackageInput>(blankPackage);
  const [fieldEditing, setFieldEditing] = useState<
    GameAccountField | "new" | null
  >(null);
  const [fieldForm, setFieldForm] = useState<AccountFieldInput>(blankField);
  const [preview, setPreview] = useState(false);
  const [deactivate, setDeactivate] = useState<{
    kind: "package" | "field";
    id: string;
  } | null>(null);
  const openPackage = (item: GameTopUpPackage | "new") => {
    setPackageEditing(item);
    setPackageForm(
      item === "new"
        ? blankPackage
        : {
            name: item.name,
            coinAmount: item.coinAmount,
            bonusAmount: item.bonusAmount,
            priceBdt: item.priceBdt,
            costPriceBdt: item.costPriceBdt || undefined,
            isActive: item.isActive,
            isPopular: item.isPopular,
            sortOrder: item.sortOrder,
            stockQuantity: item.stockQuantity,
          },
    );
  };
  const openField = (item: GameAccountField | "new") => {
    setFieldEditing(item);
    setFieldForm(
      item === "new"
        ? blankField
        : {
            key: item.key,
            label: item.label,
            type: item.type,
            placeholder: item.placeholder || "",
            helpText: item.helpText || "",
            required: item.required,
            isActive: item.isActive,
            sortOrder: item.sortOrder,
            options: item.options,
            validationRules: item.validationRules,
          },
    );
  };
  const submitPackage = (e: FormEvent) => {
    e.preventDefault();
    if (
      packageForm.coinAmount <= 0 ||
      !isValidDecimalString(packageForm.priceBdt)
    )
      return toast.error(
        "Invalid package",
        "Amount and customer price must be greater than zero.",
      );
    savePackage.mutate(
      {
        id: packageEditing === "new" ? undefined : packageEditing!.id,
        input: packageForm,
      },
      {
        onSuccess: () => {
          toast.success("Package saved");
          setPackageEditing(null);
        },
        onError: (err) =>
          toast.error("Could not save package", getGiftCardErrorMessage(err)),
      },
    );
  };
  const submitField = (e: FormEvent) => {
    e.preventDefault();
    if (forbidden.test(fieldForm.key) || forbidden.test(fieldForm.label))
      return toast.error(
        "Unsafe field blocked",
        "Passwords, OTPs, tokens, passcodes and secrets cannot be collected.",
      );
    saveField.mutate(
      {
        id: fieldEditing === "new" ? undefined : fieldEditing!.id,
        input: fieldForm,
      },
      {
        onSuccess: () => {
          toast.success("Player field saved");
          setFieldEditing(null);
        },
        onError: (err) =>
          toast.error("Could not save field", getGiftCardErrorMessage(err)),
      },
    );
  };
  if (game.isLoading)
    return (
      <AdminShell>
        <LoadingState label="Loading game configuration…" />
      </AdminShell>
    );
  if (game.isError || !game.data)
    return (
      <AdminShell>
        <ErrorState
          message="Could not load this game."
          onRetry={() => game.refetch()}
        />
      </AdminShell>
    );
  const data = game.data;
  const setup = getGameSetupStatus({
    ...data,
    packages: packages.data ?? data.packages,
    accountFields: fields.data ?? data.accountFields,
  });
  const tabs: [Tab, string][] = [
    ["overview", "Overview"],
    ["packages", "Packages"],
    ["account-fields", "Account Fields"],
  ];
  return (
    <AdminShell allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <PageHeader
        eyebrow="Game Top-Ups"
        title={data.name}
        description="Manage customer-facing configuration separately from the operational order queue."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setPreview(true)}
              className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <Link
              href={`/admin/game-topups/orders?gameId=${data.id}`}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              View Orders
            </Link>
          </div>
        }
      />
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {tabs.map(([key, label]) => (
          <Link
            key={key}
            href={
              key === "overview"
                ? `/admin/game-topups/${gameId}`
                : `/admin/game-topups/${gameId}/${key}`
            }
            className={`border-b-2 px-4 py-3 text-sm font-bold ${initialTab === key ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500"}`}
          >
            {label}
          </Link>
        ))}
      </div>
      {initialTab === "overview" ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-xs font-bold uppercase text-slate-500">Status</p>
            <div className="mt-3">
              <StatusBadge value={data.isActive} />
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-xs font-bold uppercase text-slate-500">
              Packages
            </p>
            <p className="mt-3 text-3xl font-black">
              {
                (packages.data ?? data.packages).filter((v) => v.isActive)
                  .length
              }
            </p>
            <Link
              href={`/admin/game-topups/${gameId}/packages`}
              className="mt-3 inline-block text-xs font-bold text-blue-700"
            >
              Manage Packages →
            </Link>
          </div>
          <div className="rounded-2xl border bg-white p-5">
            <p className="text-xs font-bold uppercase text-slate-500">
              Required Player Information
            </p>
            <p className="mt-3 text-3xl font-black">
              {
                (fields.data ?? data.accountFields).filter(
                  (v) => v.isActive && v.required,
                ).length
              }
            </p>
            <Link
              href={`/admin/game-topups/${gameId}/account-fields`}
              className="mt-3 inline-block text-xs font-bold text-blue-700"
            >
              Manage Fields →
            </Link>
          </div>
          <div
            className={`rounded-2xl p-5 lg:col-span-3 ${setup.ready ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-950"}`}
          >
            <h2 className="font-black">Setup: {setup.label}</h2>
            <p className="mt-1 text-sm">{setup.detail}</p>
          </div>
        </div>
      ) : null}
      {initialTab === "packages" ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Packages</h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure currency amounts and customer prices.
              </p>
            </div>
            <button
              onClick={() => openPackage("new")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Package
            </button>
          </div>
          {packages.isLoading ? (
            <LoadingState />
          ) : !packages.data?.length ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
              No top-up packages have been configured.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {packages.data.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border bg-white p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-black">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.coinAmount}
                        {item.bonusAmount
                          ? ` + ${item.bonusAmount} bonus`
                          : ""}{" "}
                        {data.gameCurrencyName}
                      </p>
                      <p className="mt-2 font-black text-blue-700">
                        {formatMoney(item.priceBdt, "BDT")}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <StatusBadge value={item.isActive} />
                      {item.isPopular ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                          Popular
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openPackage(item)}
                      className="rounded-xl border px-3 py-2 text-xs font-bold"
                    >
                      Edit
                    </button>
                    <button
                      disabled={!item.isActive}
                      onClick={() =>
                        setDeactivate({ kind: "package", id: item.id })
                      }
                      className="rounded-xl border px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-40"
                    >
                      Deactivate
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
      {initialTab === "account-fields" ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                Required Player Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose what customers must provide before placing a top-up
                request. Passwords and secrets are prohibited.
              </p>
            </div>
            <button
              onClick={() => openField("new")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Field
            </button>
          </div>
          {fields.isLoading ? (
            <LoadingState />
          ) : !fields.data?.length ? (
            <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
              No player information fields configured.
            </div>
          ) : (
            <div className="space-y-3">
              {fields.data.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-5"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black">{item.label}</h3>
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      {item.key} · {item.type}
                    </p>
                  </div>
                  {item.required ? (
                    <span className="text-xs font-bold">Required</span>
                  ) : (
                    <span className="text-xs text-slate-500">Optional</span>
                  )}
                  <StatusBadge value={item.isActive} />
                  <button
                    onClick={() => openField(item)}
                    className="rounded-xl border px-3 py-2 text-xs font-bold"
                  >
                    Edit
                  </button>
                  <button
                    disabled={!item.isActive}
                    onClick={() =>
                      setDeactivate({ kind: "field", id: item.id })
                    }
                    className="rounded-xl border px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-40"
                  >
                    Deactivate
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
      {packageEditing ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4"
          onMouseDown={() => !savePackage.isPending && setPackageEditing(null)}
        >
          <form
            onSubmit={submitPackage}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-black">
              {packageEditing === "new" ? "Add Package" : "Edit Package"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Package name
                <input
                  required
                  value={packageForm.name}
                  onChange={(e) =>
                    setPackageForm((v) => ({ ...v, name: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                Currency amount
                <input
                  required
                  type="number"
                  min={1}
                  value={packageForm.coinAmount}
                  onChange={(e) =>
                    setPackageForm((v) => ({
                      ...v,
                      coinAmount: Number(e.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                Bonus amount
                <input
                  type="number"
                  min={0}
                  value={packageForm.bonusAmount}
                  onChange={(e) =>
                    setPackageForm((v) => ({
                      ...v,
                      bonusAmount: Number(e.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                Customer Price (BDT)
                <input
                  required
                  inputMode="decimal"
                  value={packageForm.priceBdt}
                  onChange={(e) =>
                    setPackageForm((v) => ({ ...v, priceBdt: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                Sort order
                <input
                  type="number"
                  min={0}
                  value={packageForm.sortOrder}
                  onChange={(e) =>
                    setPackageForm((v) => ({
                      ...v,
                      sortOrder: Number(e.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>
            </div>
            <div className="mt-5 flex gap-5">
              <label>
                <input
                  type="checkbox"
                  checked={packageForm.isActive}
                  onChange={(e) =>
                    setPackageForm((v) => ({
                      ...v,
                      isActive: e.target.checked,
                    }))
                  }
                />{" "}
                Active
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={packageForm.isPopular}
                  onChange={(e) =>
                    setPackageForm((v) => ({
                      ...v,
                      isPopular: e.target.checked,
                    }))
                  }
                />{" "}
                Popular
              </label>
            </div>
            <button
              disabled={savePackage.isPending}
              className="mt-6 inline-flex w-full justify-center gap-2 rounded-xl bg-slate-950 p-3 text-sm font-bold text-white"
            >
              {savePackage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save Package
            </button>
          </form>
        </div>
      ) : null}
      {fieldEditing ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/70 px-4"
          onMouseDown={() => !saveField.isPending && setFieldEditing(null)}
        >
          <form
            onSubmit={submitField}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl bg-white p-6"
          >
            <h2 className="text-xl font-black">
              {fieldEditing === "new"
                ? "Add Player Field"
                : "Edit Player Field"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Field key
                <input
                  required
                  pattern="[a-z][a-zA-Z0-9_]*"
                  value={fieldForm.key}
                  onChange={(e) =>
                    setFieldForm((v) => ({ ...v, key: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                Customer label
                <input
                  required
                  value={fieldForm.label}
                  onChange={(e) =>
                    setFieldForm((v) => ({ ...v, label: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-semibold">
                Field type
                <select
                  value={fieldForm.type}
                  onChange={(e) =>
                    setFieldForm((v) => ({
                      ...v,
                      type: e.target.value as ProductInputType,
                    }))
                  }
                  className={fieldClass}
                >
                  {[
                    "TEXT",
                    "NUMBER",
                    "EMAIL",
                    "PHONE",
                    "SELECT",
                    "RADIO",
                    "TEXTAREA",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold">
                Sort order
                <input
                  type="number"
                  min={0}
                  value={fieldForm.sortOrder}
                  onChange={(e) =>
                    setFieldForm((v) => ({
                      ...v,
                      sortOrder: Number(e.target.value),
                    }))
                  }
                  className={fieldClass}
                />
              </label>
              <label className="sm:col-span-2 text-sm font-semibold">
                Placeholder
                <input
                  value={fieldForm.placeholder}
                  onChange={(e) =>
                    setFieldForm((v) => ({ ...v, placeholder: e.target.value }))
                  }
                  className={fieldClass}
                />
              </label>
            </div>
            <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
              For security, passwords, OTPs, tokens, passcodes and secrets
              cannot be collected.
            </p>
            <div className="mt-4 flex gap-5">
              <label>
                <input
                  type="checkbox"
                  checked={fieldForm.required}
                  onChange={(e) =>
                    setFieldForm((v) => ({ ...v, required: e.target.checked }))
                  }
                />{" "}
                Required
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={fieldForm.isActive}
                  onChange={(e) =>
                    setFieldForm((v) => ({ ...v, isActive: e.target.checked }))
                  }
                />{" "}
                Active
              </label>
            </div>
            <button
              disabled={saveField.isPending}
              className="mt-6 inline-flex w-full justify-center gap-2 rounded-xl bg-slate-950 p-3 text-sm font-bold text-white"
            >
              {saveField.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Save Field
            </button>
          </form>
        </div>
      ) : null}
      <GameTopUpPreviewDialog
        game={data}
        open={preview}
        onClose={() => setPreview(false)}
      />
      <ConfirmDialog
        open={Boolean(deactivate)}
        title={`Deactivate ${deactivate?.kind}?`}
        description="Existing order history is preserved. The item will no longer be offered to customers."
        confirmLabel="Deactivate"
        loading={deactivatePackage.isPending || deactivateField.isPending}
        onClose={() => setDeactivate(null)}
        onConfirm={() => {
          if (!deactivate) return;
          const mutation =
            deactivate.kind === "package"
              ? deactivatePackage.mutateAsync(deactivate.id)
              : deactivateField.mutateAsync(deactivate.id);
          mutation
            .then(() => {
              toast.success("Deactivated");
              setDeactivate(null);
            })
            .catch((e) =>
              toast.error("Could not deactivate", getGiftCardErrorMessage(e)),
            );
        }}
      />
    </AdminShell>
  );
}
