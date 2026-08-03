"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { blogSchema, type BlogInput } from "@/lib/validations";
import { ImageUploader } from "@/components/admin/image-uploader";

export function BlogForm({ categories, initial }: { categories: { id: string; name: string }[]; initial?: BlogInput & { id: string } }) {
  const router = useRouter();
  const isEdit = !!initial;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: initial ?? { published: true, tags: [] },
  });

  const tags = watch("tags") ?? [];

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter") {
      e.preventDefault();
      const v = target.value.trim();
      if (v && !tags.includes(v)) setValue("tags", [...tags, v], { shouldDirty: true });
      target.value = "";
    }
  };

  const onSubmit = async (values: BlogInput) => {
    const res = await fetch(isEdit ? `/api/admin/blogs/${initial.id}` : "/api/blogs", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.error || "Could not save post");
      return;
    }
    toast.success(isEdit ? "Post updated" : "Post created");
    router.push("/admin/blogs");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border bg-card p-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="b-title">Title *</Label>
          <Input id="b-title" placeholder="How to choose the perfect luxury home" {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-slug">Slug</Label>
          <Input id="b-slug" placeholder="auto-generated if empty" {...register("slug")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-author">Author</Label>
          <Input id="b-author" placeholder="Editorial Team" {...register("author")} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="b-excerpt">Excerpt</Label>
          <Textarea id="b-excerpt" rows={2} placeholder="Short summary shown on cards…" {...register("excerpt")} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="b-content">Content *</Label>
          <Textarea id="b-content" rows={14} placeholder="Write the full article. Markdown-friendly paragraphs work best…" {...register("content")} />
          {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-cat">Category</Label>
          <select
            id="b-cat"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register("categoryId")}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Cover image</Label>
          <Controller control={control} name="coverImage" render={({ field }) => <ImageUploader value={field.value ?? ""} onChange={field.onChange} folder="blog" />} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="b-tags">Tags (press Enter to add)</Label>
          <Input id="b-tags" placeholder="Luxury Living" onKeyDown={addTag} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((t) => (
              <span key={t} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                {t}
                <button type="button" onClick={() => setValue("tags", tags.filter((x) => x !== t), { shouldDirty: true })} aria-label={`Remove ${t}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-meta">Meta title (SEO)</Label>
          <Input id="b-meta" placeholder="Under 80 characters" {...register("metaTitle")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="b-meta-desc">Meta description (SEO)</Label>
          <Input id="b-meta-desc" placeholder="Under 180 characters" {...register("metaDescription")} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="b-published" checked={watch("published")} onCheckedChange={(v) => setValue("published", v, { shouldDirty: true })} />
          <Label htmlFor="b-published" className="cursor-pointer">Published (visible on blog)</Label>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/blogs")}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>{isEdit ? "Save Changes" : "Publish Post"}</Button>
      </div>
    </form>
  );
}