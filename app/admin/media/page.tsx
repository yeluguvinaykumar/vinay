"use client";

import * as React from "react";
import { Copy, ImagePlus, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface FileItem {
  name: string;
  url: string;
  size: number;
  modifiedAt: string;
}

export default function AdminMediaPage() {
  const [files, setFiles] = React.useState<FileItem[] | null>(null);
  const [folder, setFolder] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const load = React.useCallback(async () => {
    const res = await fetch(`/api/media${folder ? `?folder=${encodeURIComponent(folder)}` : ""}`);
    const json = await res.json();
    if (json.success) setFiles(json.data);
  }, [folder]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();
    setUploading(false);
    if (!res.ok || !json.success) {
      toast.error(json.error || "Upload failed");
      return;
    }
    toast.success("Uploaded");
    void load();
  };

  const del = async (file: FileItem) => {
    if (!confirm(`Delete ${file.name}?`)) return;
    const res = await fetch(`/api/media?path=${encodeURIComponent(file.url)}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Deleted");
      void load();
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  const copy = (url: string) => {
    void navigator.clipboard.writeText(url);
    toast.success("URL copied");
  };

  return (
    <div>
      <AdminPageHeader title="Media Library" description="Upload and manage images used across the site." />

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="folder">Folder (optional)</Label>
            <Input id="folder" placeholder="e.g. agents, blog" value={folder} onChange={(e) => setFolder(e.target.value)} className="w-48" />
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Uploading…" : "Upload Image"}
            <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => void onUpload(e)} />
          </label>
        </div>

        {!files ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3] w-full" />)}
          </div>
        ) : files.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No images yet. Upload one to get started.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {files.map((f) => (
              <div key={f.url} className="group overflow-hidden rounded-xl border">
                <div className="relative aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/50 group-hover:opacity-100">
                    <Button size="icon" variant="ghost" className="bg-white/20 text-white hover:bg-white/30" aria-label="Copy URL" onClick={() => copy(f.url)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="bg-white/20 text-white hover:bg-white/30" aria-label="Delete image" onClick={() => void del(f)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-medium" title={f.name}>{f.name}</p>
                  <button type="button" onClick={() => copy(f.url)} className="mt-0.5 flex w-full items-center gap-1 truncate text-[11px] text-muted-foreground hover:text-primary">
                    <LinkIcon className="h-3 w-3 shrink-0" />
                    <span className="truncate">{f.url}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}