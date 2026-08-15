"use client";

import AdminShell from "@/components/admin/AdminShell";
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SearchInput,
  StatusBadge,
} from "@/components/admin/AdminUi";
import { useToast } from "@/context/ToastContext";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type AdminCategory,
} from "@/lib/admin";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  isActive: true,
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setCategories(await getCategories());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return categories.filter((category) =>
      [category.title, category.name, category.slug, category.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [categories, search]);

  const beginEdit = (category: AdminCategory) => {
    setEditing(category);
    setForm({
      title: category.title || category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description.trim(),
      isActive: form.isActive,
    };

    try {
      setSubmitting(true);
      if (editing) {
        await updateCategory(editing.id, payload);
        toast.success("Category updated");
      } else {
        await createCategory(payload);
        toast.success("Category created");
      }
      resetForm();
      await loadCategories();
    } catch (err) {
      toast.error("Save failed", err instanceof Error ? err.message : "Could not save category.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkCreate = async () => {
    const titles = bulkText.split("\n").map((line) => line.trim()).filter(Boolean);
    if (!titles.length) return;

    try {
      setSubmitting(true);
      await Promise.all(
        titles.map((title) =>
          createCategory({ title, slug: slugify(title), isActive: true }),
        ),
      );
      setBulkText("");
      toast.success("Categories created", `${titles.length} categories added.`);
      await loadCategories();
    } catch (err) {
      toast.error("Bulk create failed", err instanceof Error ? err.message : "Could not create categories.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
      await loadCategories();
    } catch (err) {
      toast.error("Delete failed", err instanceof Error ? err.message : "Could not delete category.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Catalog"
        title="Categories"
        description="Create, edit, delete, and bulk add category records through the category API."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="space-y-5">
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black">{editing ? "Edit category" : "New category"}</h2>
              {editing ? <button type="button" onClick={resetForm} className="text-sm font-semibold text-blue-700">Clear</button> : null}
            </div>
            <div className="space-y-4">
              <input required placeholder="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
              <input placeholder="Slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
              <textarea rows={4} placeholder="Description" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold">
                <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />
                Active category
              </label>
              <button disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                <Plus className="h-4 w-4" />
                {submitting ? "Saving..." : editing ? "Update category" : "Create category"}
              </button>
            </div>
          </form>

          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black">Bulk create</h2>
            <textarea rows={6} value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder="One category title per line" className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
            <button type="button" disabled={submitting || !bulkText.trim()} onClick={handleBulkCreate} className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-60">
              Add categories
            </button>
          </section>
        </section>

        <section>
          <div className="mb-5 flex flex-wrap gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
          </div>
          {loading ? <LoadingState label="Loading categories..." /> : null}
          {error && !loading ? <ErrorState message={error} onRetry={loadCategories} /> : null}
          {!loading && !error ? (
            filtered.length > 0 ? (
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                      <tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filtered.map((category) => (
                        <tr key={category.id}>
                          <td className="px-4 py-3"><p className="font-semibold">{category.title || category.name}</p><p className="text-xs text-slate-500">{category.description || "No description"}</p></td>
                          <td className="px-4 py-3 text-slate-600">{category.slug || "No slug"}</td>
                          <td className="px-4 py-3"><StatusBadge value={category.isActive ?? true} /></td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => beginEdit(category)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 font-semibold"><Edit3 className="h-4 w-4" />Edit</button>
                              <button type="button" onClick={() => setDeleteTarget(category)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <EmptyState title="No categories found" />
          ) : null}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete category"
        description={`Delete ${deleteTarget?.title || deleteTarget?.name || "this category"}?`}
        confirmLabel="Delete category"
        loading={submitting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
}
