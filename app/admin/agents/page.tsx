"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rating } from "@/components/shared/rating";

interface Row {
  id: string;
  name: string;
  title: string | null;
  email: string;
  phone: string | null;
  photo: string | null;
  rating: number;
  active: boolean;
  _count: { properties: number };
}

export default function AdminAgentsPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[] | null>(null);

  const load = React.useCallback(async () => {
    const res = await fetch("/api/agents");
    const json = await res.json();
    if (json.success) setRows(json.data);
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const del = async (row: Row) => {
    if (!confirm(`Delete agent "${row.name}"? Their properties will keep the agent reference but become unlinked.`)) return;
    const res = await fetch(`/api/agents/${row.id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) {
      toast.success("Agent deleted");
      void load();
    } else {
      toast.error(json.error || "Delete failed");
    }
  };

  return (
    <div>
      <AdminPageHeader title="Agents" description="Manage team members shown on the website." action="Add Agent" href="/admin/agents/new" />

      <Card className="p-4">
        {!rows ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                        {r.photo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.photo} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.title ?? "Agent"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.email}
                    {r.phone && <span className="block text-xs">{r.phone}</span>}
                  </TableCell>
                  <TableCell><Rating value={r.rating} size={14} /></TableCell>
                  <TableCell className="font-semibold">{r._count.properties}</TableCell>
                  <TableCell>
                    {r.active ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost" aria-label="Edit agent">
                        <Link href={`/admin/agents/${r.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Delete agent" onClick={() => void del(r)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}