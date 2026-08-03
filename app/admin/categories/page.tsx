"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categorySchema } from "@/lib/validations";

interface Row {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort: number;
  _count: { properties: number };
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", icon: "", sort: 0 },
  });
  const { register, handleSubmit, reset } = form;

  const editForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", icon: "", sort: 0 },
  });

  const startEdit = (row: Row) => {
    setEditingId(row.id);
    editForm.reset({ name: row.name, slug: row.slug, icon: row.icon ?? "", sort: row.sort });
  };

  const onCreate = async (values: { name: string; slug?: string; icon?: string; sort?: number }) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) return toast.error(json.error || "Could not create category");
    toast.success("Category created");
    reset({ name: "", slug: "", icon: "", sort: 0 });
    setShowAdd(false);
    void load();
  };

  const onSave = async (values: { name: string; slug?: string; icon?: string; sort?: number }) => {
    if (!editingId) return;
    const res = await fetch(`/api/categories/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) return toast.error(json.error || "Could not save category");
    toast.success("Category saved");
    setEditingId(null);
    void load();
  };

  const del = async (row: Row) => {
    if (!confirm(`Delete category "${row.name}"?`)) return;
    const res = await fetch(`/api/categories/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Category deleted");
      void load();
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  const move = async (row: Row, dir: "up" | "down") => {
    const idx = rows!.findIndex((r) => r.id === row.id);
    const swap = rows![idx + (dir === "up" ? -1 : 1)];
    if (!swap) return;
    const res = await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { id: row.id, sort: swap.sort },
        { id: swap.id, sort: row.sort },
      ]),
    });
    if (res.ok) void load();
  };

  return (
    <div>
      <AdminPageHeader title="Categories" description="Property categories shown on the homepage and filters." />

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{rows?.length ?? "…"} categories</span>
          <Button size="sm" onClick={() => setShowAdd((v) => !v)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Category
          </Button>
        </div>

        {showAdd && (
          <form onSubmit={handleSubmit(onCreate)} className="mb-4 grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-2 lg:grid-cols-4" noValidate>
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input placeholder="Villas" {...register("name")} />
            </div>
            <div className="space-y-1">
              <Label>Slug</Label>
              <Input placeholder="villas" {...register("slug")} />
            </div>
            <div className="space-y-1">
              <Label>Icon (lucide name)</Label>
              <Input placeholder="Home" {...register("icon")} />
            </div>
            <div className="space-y-1">
              <Label>Sort</Label>
              <Input type="number" {...register("sort")} />
            </div>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
              <Button type="submit"><Save className="mr-1.5 h-4 w-4" /> Create</Button>
              <Button type="button" variant="ghost" onClick={() => setShowAdd(false)}><X className="mr-1.5 h-4 w-4" /> Cancel</Button>
            </div>
          </form>
        )}

        {!rows ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Sort</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <React.Fragment key={r.id}>
                  <TableRow>
                    <TableCell className="font-semibold">
                      {r.icon && <span className="mr-2 text-accent">{r.icon}</span>}
                      {r.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">/categories/{r.slug}</TableCell>
                    <TableCell className="text-sm">{r.sort}</TableCell>
                    <TableCell className="font-semibold">{r._count.properties}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" disabled={i === 0} aria-label="Move up" onClick={() => void move(r, "up")}>
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" disabled={i === rows.length - 1} aria-label="Move down" onClick={() => void move(r, "down")}>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Edit category" onClick={() => (editingId === r.id ? setEditingId(null) : startEdit(r))}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Delete category" onClick={() => void del(r)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {editingId === r.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/40">
                        <form
                          onSubmit={editForm.handleSubmit((v) => void onSave(v))}
                          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                          noValidate
                        >
                          <div className="space-y-1">
                            <Label>Name *</Label>
                            <Input {...editForm.register("name")} />
                          </div>
                          <div className="space-y-1">
                            <Label>Slug</Label>
                            <Input {...editForm.register("slug")} />
                          </div>
                          <div className="space-y-1">
                            <Label>Icon</Label>
                            <Input {...editForm.register("icon")} />
                          </div>
                          <div className="space-y-1">
                            <Label>Sort</Label>
                            <Input type="number" {...editForm.register("sort")} />
                          </div>
                          <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
                            <Button type="submit" size="sm"><Save className="mr-1.5 h-4 w-4" /> Save</Button>
                            <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                          </div>
                        </form>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}