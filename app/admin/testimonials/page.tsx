"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Save, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { testimonialSchema } from "@/lib/validations";

interface Row {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  featured: boolean;
  active: boolean;
}

const empty = { name: "", role: "", company: "", content: "", rating: 5, avatar: "", featured: false, active: true };

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/testimonials");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const form = useForm({ resolver: zodResolver(testimonialSchema), defaultValues: empty });
  const editForm = useForm({ resolver: zodResolver(testimonialSchema), defaultValues: empty });

  const startEdit = (row: Row) => {
    setEditingId(row.id);
    editForm.reset({ name: row.name, role: row.role ?? "", company: row.company ?? "", content: row.content, rating: row.rating, avatar: "", featured: row.featured, active: row.active });
  };

  const save = async (values: unknown, id?: string) => {
    const res = await fetch(id ? `/api/testimonials/${id}` : "/api/testimonials", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) return toast.error(json.error || "Could not save testimonial");
    toast.success(id ? "Testimonial updated" : "Testimonial added");
    form.reset(empty);
    editForm.reset(empty);
    setEditingId(null);
    setShowAdd(false);
    void load();
  };

  const del = async (row: Row) => {
    if (!confirm(`Delete testimonial from "${row.name}"?`)) return;
    const res = await fetch(`/api/testimonials/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Deleted");
      void load();
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  const renderForm = (f: any, onSubmit: (v: unknown) => void, id?: string) => (
    <form onSubmit={f.handleSubmit(onSubmit)} className="mb-5 grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-2 lg:grid-cols-3" noValidate>
      <div className="space-y-1">
        <Label>Name *</Label>
        <Input placeholder="Ananya Iyer" {...f.register("name")} />
      </div>
      <div className="space-y-1">
        <Label>Role</Label>
        <Input placeholder="Homeowner" {...f.register("role")} />
      </div>
      <div className="space-y-1">
        <Label>Company / City</Label>
        <Input placeholder="Hyderabad" {...f.register("company")} />
      </div>
      <div className="space-y-1 sm:col-span-2 lg:col-span-3">
        <Label>Testimonial *</Label>
        <Textarea rows={3} placeholder="Their experience with VINAY…" {...f.register("content")} />
      </div>
      <div className="space-y-1">
        <Label>Rating (1–5)</Label>
        <Input type="number" min={1} max={5} {...f.register("rating")} />
      </div>
      <div className="flex items-end gap-4 pb-1">
        <div className="flex items-center gap-2">
          <Switch id={`${id ?? "new"}-feat`} checked={f.watch("featured")} onCheckedChange={(v) => f.setValue("featured", v)} />
          <Label htmlFor={`${id ?? "new"}-feat`} className="cursor-pointer text-sm">Featured</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id={`${id ?? "new"}-act`} checked={f.watch("active")} onCheckedChange={(v) => f.setValue("active", v)} />
          <Label htmlFor={`${id ?? "new"}-act`} className="cursor-pointer text-sm">Active</Label>
        </div>
      </div>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
        <Button type="submit" size="sm"><Save className="mr-1.5 h-4 w-4" /> {id ? "Save Changes" : "Add"}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => { setShowAdd(false); setEditingId(null); f.reset(empty); }}>
          <X className="mr-1.5 h-4 w-4" /> Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div>
      <AdminPageHeader title="Testimonials" description="Client reviews shown on the homepage." />

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{rows?.length ?? "…"} testimonials</span>
          <Button size="sm" onClick={() => { setShowAdd((v) => !v); setEditingId(null); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Testimonial
          </Button>
        </div>

        {showAdd && renderForm(form, (v) => void save(v))}

        {!rows ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border p-4">
                {editingId === r.id ? (
                  renderForm(editForm, (v) => void save(v, r.id), r.id)
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {r.name}
                        {r.company && <span className="ml-2 text-sm font-normal text-muted-foreground">— {r.company}</span>}
                      </p>
                      <p className="flex items-center gap-1 text-accent">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                        ))}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">“{r.content}”</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="gold">{r.featured ? "★ Featured" : "Normal"}</Badge>
                      {r.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}
                      <Button size="icon" variant="ghost" aria-label="Edit testimonial" onClick={() => startEdit(r)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Delete testimonial" onClick={() => void del(r)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}