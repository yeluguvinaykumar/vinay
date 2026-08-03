"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/format";

interface Row {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  message: string | null;
  status: string;
  createdAt: string;
  property: { id: string; title: string; slug: string } | null;
}

const STATUS_VARIANTS: Record<string, "secondary" | "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

export default function AdminAppointmentsPage() {
  const [rows, setRows] = React.useState<Row[] | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/appointments?limit=100");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const patch = async (id: string, status: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (json.success) {
      toast.success("Appointment updated");
      void load();
    } else {
      toast.error(json.error || "Update failed");
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Appointment deleted");
      void load();
    }
  };

  return (
    <div>
      <AdminPageHeader title="Appointments" description="Site viewing requests from the booking dialog." />

      <Card className="p-4">
        {!rows ? (
          <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">No appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{r.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-foreground">
                        <Mail className="h-3.5 w-3.5" /> {r.email}
                      </a>
                      <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-foreground">
                        <Phone className="h-3.5 w-3.5" /> {r.phone}
                      </a>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-4 w-4 text-primary" /> {formatDate(r.date)}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-4 w-4 text-primary" /> {r.timeSlot}
                      </span>
                    </div>
                    {r.property && (
                      <Link href={`/properties/${r.property.slug}`} className="mt-1.5 inline-block text-sm font-medium text-primary hover:underline">
                        Property: {r.property.title}
                      </Link>
                    )}
                    {r.message && <p className="mt-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">{r.message}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={r.status}
                      onChange={(e) => void patch(r.id, e.target.value)}
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Badge variant={STATUS_VARIANTS[r.status] ?? "secondary"}>{r.status}</Badge>
                    <Button size="icon" variant="ghost" aria-label="Delete appointment" onClick={() => void del(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}