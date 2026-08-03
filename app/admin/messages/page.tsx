"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Phone, Trash2 } from "lucide-react";
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
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  property: { id: string; title: string; slug: string } | null;
}

export default function AdminMessagesPage() {
  const [rows, setRows] = React.useState<Row[] | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/messages?limit=100");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const toggleRead = async (row: Row) => {
    const res = await fetch(`/api/messages/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !row.read }),
    });
    const json = await res.json();
    if (json.success) void load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Message deleted");
      void load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Messages" description="Contact form submissions and blog comments." />

      <Card className="p-4">
        {!rows ? (
          <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => void toggleRead(r)}
                className={`block w-full rounded-xl border p-4 text-left transition hover:border-primary/40 ${r.read ? "opacity-70" : "border-primary/50 bg-primary/5"}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {r.subject ?? "No subject"}
                      {!r.read && <Badge className="ml-2">New</Badge>}
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{r.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                        <Mail className="h-3.5 w-3.5" /> {r.email}
                      </a>
                      {r.phone && (
                        <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-foreground" onClick={(e) => e.stopPropagation()}>
                          <Phone className="h-3.5 w-3.5" /> {r.phone}
                        </a>
                      )}
                      <span>· {timeAgo(r.createdAt)}</span>
                    </div>
                    {r.property && (
                      <Link href={`/properties/${r.property.slug}`} className="mt-1.5 inline-block text-sm font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                        About: {r.property.title}
                      </Link>
                    )}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{r.message}</p>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Delete message"
                    onClick={(e) => {
                      e.stopPropagation();
                      void del(r.id);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && void del(r.id)}
                    className="rounded-md p-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}