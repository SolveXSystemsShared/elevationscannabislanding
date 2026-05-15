"use client";

import * as React from "react";
import useSWR from "swr";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field } from "@/components/site/field";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { CATEGORY_LABEL, type Product } from "@/lib/types";
import { formatZAR } from "@/lib/utils";
import { Plus, Pencil, Archive, ArchiveRestore } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const empty = {
  name: "",
  category: "flower" as Product["category"],
  grade: "Indoor",
  type: "hybrid" as Product["type"],
  thc_percent: 0,
  cbd_percent: 0,
  effects: ["", "", ""] as [string, string, string],
  terpenes: [] as string[],
  description: "",
  image_url: "",
  retail_price: 0,
  cost_price: 0,
  status: "in_stock" as Product["status"],
  display_order: 99,
};

export default function ProductsAdminPage() {
  const [showArchived, setShowArchived] = React.useState(false);
  const { data, mutate, isLoading } = useSWR<{ products: Product[] }>(
    showArchived ? "/api/admin/products?includeArchived=1" : "/api/admin/products",
    fetcher,
  );
  const { data: gradesData } = useSWR<{ grades: { id: string; label: string }[] }>(
    "/api/admin/grades",
    fetcher,
  );
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [form, setForm] = React.useState(empty);

  const products = data?.products ?? [];
  const grades = gradesData?.grades ?? [];

  const startNew = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      grade: p.grade,
      type: p.type,
      thc_percent: p.thc_percent,
      cbd_percent: p.cbd_percent ?? 0,
      effects: p.effects,
      terpenes: p.terpenes,
      description: p.description,
      image_url: p.image_url,
      retail_price: p.retail_price,
      cost_price: p.cost_price,
      status: p.status,
      display_order: p.display_order,
    });
    setOpen(true);
  };

  const save = async () => {
    const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
    const method = editing ? "PUT" : "POST";
    const body = {
      ...form,
      thc_percent: Number(form.thc_percent),
      cbd_percent: form.cbd_percent ? Number(form.cbd_percent) : undefined,
      retail_price: Number(form.retail_price),
      cost_price: Number(form.cost_price),
      display_order: Number(form.display_order),
      terpenes: typeof form.terpenes === "string"
        ? (form.terpenes as string).split(",").map((s: string) => s.trim()).filter(Boolean)
        : form.terpenes,
    };
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast({ kind: "error", title: "Save failed" });
      return;
    }
    toast({ kind: "success", title: editing ? "Product updated" : "Product created" });
    setOpen(false);
    mutate();
  };

  const toggleStock = async (p: Product) => {
    const next = p.status === "in_stock" ? "out_of_stock" : "in_stock";
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    mutate();
  };

  const archive = async (p: Product) => {
    if (!confirm(`Archive ${p.name}? It will be hidden from the storefront.`)) return;
    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
    toast({ kind: "info", title: "Product archived" });
    mutate();
  };

  const restore = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ restore: true }),
    });
    toast({ kind: "success", title: "Product restored" });
    mutate();
  };

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Manage strains, prices, stock, and category visibility."
        action={
          <Button onClick={startNew}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      <div className="rounded-card border border-line bg-surface shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-background/40 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {showArchived
              ? "Showing active and archived products. Archived items are hidden from the storefront."
              : "Showing active products only."}
          </p>
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={
              "px-3 py-1.5 rounded-btn text-xs font-medium transition-colors " +
              (showArchived
                ? "bg-purple text-white"
                : "border border-line text-ink hover:border-purple/30")
            }
          >
            {showArchived ? "Hide archived" : "Show archived"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/50 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Product</th>
                <th className="px-5 py-3 text-left font-medium">Category</th>
                <th className="px-5 py-3 text-left font-medium">Grade · Type</th>
                <th className="px-5 py-3 text-left font-medium">THC</th>
                <th className="px-5 py-3 text-right font-medium">Price</th>
                <th className="px-5 py-3 text-center font-medium">Stock</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              )}
              {products.map((p) => {
                const isArchived = Boolean(p.archived_at);
                return (
                  <tr
                    key={p.id}
                    className={
                      "border-t border-line hover:bg-purple/[0.02] " +
                      (isArchived ? "opacity-60" : "")
                    }
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{p.name}</p>
                        {isArchived && <Badge variant="subtle">Archived</Badge>}
                      </div>
                      <p className="text-xs text-muted truncate max-w-[260px]">
                        {p.description}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="subtle">{CATEGORY_LABEL[p.category]}</Badge>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {p.grade} · <span className="capitalize">{p.type}</span>
                    </td>
                    <td className="px-5 py-3 font-mono">{p.thc_percent}%</td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {formatZAR(p.retail_price)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => toggleStock(p)}
                        className="ring-focus rounded-btn"
                        aria-label={`Toggle stock for ${p.name}`}
                        disabled={isArchived}
                      >
                        <Badge
                          variant={p.status === "in_stock" ? "success" : "danger"}
                        >
                          {p.status === "in_stock" ? "In stock" : "Out"}
                        </Badge>
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => startEdit(p)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {isArchived ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => restore(p)}
                          aria-label="Restore"
                          className="text-success hover:text-success"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => archive(p)}
                          aria-label="Archive"
                          className="text-danger hover:text-danger"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!isLoading && products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted">
                    No products to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "New product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2 max-h-[68vh] overflow-y-auto px-1">
            <Field label="Strain name" className="sm:col-span-2">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Category">
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as Product["category"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flower">Flower</SelectItem>
                  <SelectItem value="preroll">Pre-Roll</SelectItem>
                  <SelectItem value="moonstick">Moonstick</SelectItem>
                  <SelectItem value="vape">Vape</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Type">
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as Product["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sativa">Sativa</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="indica">Indica</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Grade">
              <Select
                value={form.grade}
                onValueChange={(v) => setForm({ ...form, grade: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g.id} value={g.label}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Stock">
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as Product["status"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="THC %">
              <Input
                type="number"
                step="0.1"
                value={form.thc_percent}
                onChange={(e) =>
                  setForm({ ...form, thc_percent: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="CBD % (optional)">
              <Input
                type="number"
                step="0.1"
                value={form.cbd_percent}
                onChange={(e) =>
                  setForm({ ...form, cbd_percent: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Retail price (ZAR)">
              <Input
                type="number"
                value={form.retail_price}
                onChange={(e) =>
                  setForm({ ...form, retail_price: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Cost price (admin only)">
              <Input
                type="number"
                value={form.cost_price}
                onChange={(e) =>
                  setForm({ ...form, cost_price: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Effect 1">
              <Input
                value={form.effects[0]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    effects: [e.target.value, form.effects[1], form.effects[2]],
                  })
                }
              />
            </Field>
            <Field label="Effect 2">
              <Input
                value={form.effects[1]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    effects: [form.effects[0], e.target.value, form.effects[2]],
                  })
                }
              />
            </Field>
            <Field label="Effect 3">
              <Input
                value={form.effects[2]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    effects: [form.effects[0], form.effects[1], e.target.value],
                  })
                }
              />
            </Field>
            <Field label="Display order">
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Terpenes (comma-separated)" className="sm:col-span-2">
              <Input
                value={
                  Array.isArray(form.terpenes)
                    ? form.terpenes.join(", ")
                    : form.terpenes
                }
                onChange={(e) =>
                  setForm({ ...form, terpenes: e.target.value as unknown as string[] })
                }
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
            <Field label="Image URL" className="sm:col-span-2" hint="In production: image upload to Supabase Storage.">
              <Input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="/assets/products/your-image.jpg"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? "Save changes" : "Create product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
