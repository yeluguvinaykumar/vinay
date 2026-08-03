"use client";

import * as React from "react";
import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/utils/format";

interface Row {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  property: { id: string; title: string; slug: string } | null;
}

export default function AdminReviewsPage() {
  const [rows, setRows] = React.useState<Row[] | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/reviews?limit=100");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const del = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Review deleted");
      void load();
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Reviews" description="Property reviews submitted by website visitors." />

      <Card className="p-4">
        {!rows ? (
          <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{r.name}</p>
                    <p className="flex items-center gap-0.5 text-accent">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                      ))}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">· {timeAgo(r.createdAt)}</span>
                    </p>
                    {r.property && (
                      <Link href={`/properties/${r.property.slug}`} className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
                        On: {r.property.title}
                      </Link>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Delete review" onClick={() => void del(r.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}