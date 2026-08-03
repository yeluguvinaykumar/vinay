"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/shared/pagination";
import { formatPrice, timeAgo } from "@/utils/format";
import { PROPERTY_TYPE_LABELS, STATUS_LABELS, STATUS_VARIANTS } from "@/types";

interface Row {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  type: string;
  purpose: string | null;
  status: string;
  featured: boolean;
  city: string;
  coverImage: string | null;
  createdAt: string;
  agent: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  _count: { images: number; leads: number; wishlist: number };
}

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [page, setPage] = React.useState(1);
  const [q, setQ] = React.useState("");

  const load = React.useCallback(async (pageNum = 1, query = "") => {
    const res = await fetch(`/api/admin/properties?page=${pageNum}&limit=15&q=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (json.success) {
      setRows(json.data.properties);
      setTotal(json.data.total);
      setTotalPages(json.data.totalPages);
      setPage(pageNum);
    }
  }, []);

  React.useEffect(() => {
    void load(1);
  }, [load]);

  const del = async (row: Row) => {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/properties/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Property deleted");
      void load(page);
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Properties" description="Manage all property listings." action="Add Property" href="/admin/properties/new" />

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or city…"
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void load(1, q)}
            />
          </div>
          <Button size="sm" variant="outline" onClick={() => void load(1, q)}>Search</Button>
          <span className="ml-auto text-sm text-muted-foreground">{total} total</span>
        </div>

        {!rows ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Agent</TableHead>
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
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-semibold">{r.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.city} · {timeAgo(r.createdAt)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(r.discountPrice ?? r.price, r.purpose)}
                      {r.purpose === "RENT" && <span className="text-xs text-muted-foreground">/mo</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{PROPERTY_TYPE_LABELS[r.type] ?? r.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[r.status] as never}>{STATUS_LABELS[r.status]}</Badge>
                      {r.featured && <Badge variant="gold" className="ml-1">★</Badge>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.agent?.name ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon" variant="ghost" aria-label="View listing">
                          <Link href={`/properties/${r.slug}`}><Eye className="h-4 w-4" /></Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost" aria-label="Edit">
                          <Link href={`/admin/properties/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => void del(r)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-center">
              <Pagination page={page} totalPages={totalPages} onPageChange={(p) => void load(p, q)} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}