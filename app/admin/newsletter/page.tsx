"use client";

import * as React from "react";
import { Copy, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { timeAgo } from "@/utils/format";

interface Row {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [rows, setRows] = React.useState<Row[] | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/newsletter");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const del = async (row: Row) => {
    if (!confirm(`Remove subscriber ${row.email}?`)) return;
    const res = await fetch(`/api/newsletter?id=${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Subscriber removed");
      void load();
    }
  };

  const copyAll = () => {
    if (!rows) return;
    const emails = rows.filter((r) => r.subscribed).map((r) => r.email).join(", ");
    void navigator.clipboard.writeText(emails);
    toast.success("Emails copied to clipboard");
  };

  return (
    <div>
      <AdminPageHeader title="Newsletter" description="Manage subscribers from the newsletter signup." />

      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{rows?.length ?? "…"} subscribers</span>
          <Button size="sm" variant="outline" onClick={copyAll}>
            <Copy className="mr-1.5 h-4 w-4" /> Copy All Emails
          </Button>
        </div>

        {!rows ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No subscribers yet.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.email}</p>
                    <p className="text-xs text-muted-foreground">Joined {timeAgo(r.createdAt)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {r.subscribed ? <Badge variant="success">Subscribed</Badge> : <Badge variant="secondary">Unsubscribed</Badge>}
                  <Button size="icon" variant="ghost" aria-label="Remove subscriber" onClick={() => void del(r)}>
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