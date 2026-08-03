"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/shared/pagination";
import { timeAgo } from "@/utils/format";

interface Row {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  author: string | null;
  published: boolean;
  createdAt: string;
  _count: { comments: number };
}

export default function AdminBlogsPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [page, setPage] = React.useState(1);

  const load = React.useCallback(async (pageNum = 1) => {
    const res = await fetch(`/api/blogs?page=${pageNum}&limit=15`);
    const json = await res.json();
    if (json.success) {
      setRows(json.data.posts);
      setTotal(json.data.total);
      setTotalPages(json.data.totalPages);
      setPage(pageNum);
    }
  }, []);

  React.useEffect(() => {
    void load(1);
  }, [load]);

  const del = async (row: Row) => {
    if (!confirm(`Delete post "${row.title}"?`)) return;
    const res = await fetch(`/api/admin/blogs/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Post deleted");
      void load(page);
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Blog Posts" description="Write and manage articles." action="New Post" href="/admin/blogs/new" />

      <Card className="p-4">
        {!rows ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {r.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.coverImage} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <p className="line-clamp-1 font-semibold">{r.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.author ?? "—"}</TableCell>
                    <TableCell className="font-semibold">{r._count.comments}</TableCell>
                    <TableCell>
                      {r.published ? <Badge variant="success">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{timeAgo(r.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" aria-label="View post">
                          <Link href={`/blog/${r.slug}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost" aria-label="Edit post">
                          <Link href={`/admin/blogs/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Delete post" onClick={() => void del(r)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-center">
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => void load(p)} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}