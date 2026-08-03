"use client";

import * as React from "react";
import Link from "next/link";
import { Columns3, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-mounted";
import { formatPrice, formatArea } from "@/utils/format";
import { PROPERTY_TYPE_LABELS, PURPOSE_LABELS } from "@/types";
import type { PropertyListItem } from "@/types";

const ROWS: { key: keyof PropertyListItem; label: string }[] = [
  { key: "price", label: "Price" },
  { key: "type", label: "Type" },
  { key: "purpose", label: "Purpose" },
  { key: "bedrooms", label: "Bedrooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "area", label: "Area" },
  { key: "city", label: "City" },
  { key: "address", label: "Address" },
  { key: "status", label: "Status" },
];

export default function ComparePage() {
  const [selected, setSelected] = React.useState<PropertyListItem[]>([]);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<PropertyListItem[]>([]);
  const [searching, setSearching] = React.useState(false);
  const debounced = useDebounce(query, 400);

  React.useEffect(() => {
    if (!debounced.trim() || selected.length >= 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    fetch(`/api/properties?q=${encodeURIComponent(debounced)}&limit=5`)
      .then((r) => r.json())
      .then((json) => setResults(json.success ? json.data.properties : []))
      .catch(() => setResults([]))
      .finally(() => setSearching(false));
  }, [debounced, selected.length]);

  const add = (p: PropertyListItem) => {
    if (selected.some((s) => s.id === p.id)) {
      toast.info("Already in comparison");
      return;
    }
    if (selected.length >= 3) {
      toast.error("You can compare up to 3 properties");
      return;
    }
    setSelected((prev) => [...prev, p]);
    setQuery("");
  };

  const renderCell = (p: PropertyListItem | null, key: keyof PropertyListItem) => {
    if (!p) return "—";
    switch (key) {
      case "price":
        return <span className="font-display font-bold text-primary">{formatPrice(p.discountPrice ?? p.price, p.purpose)}</span>;
      case "type":
        return PROPERTY_TYPE_LABELS[p.type] ?? p.type;
      case "purpose":
        return p.purpose ? (PURPOSE_LABELS[p.purpose] ?? p.purpose) : "—";
      case "bedrooms":
      case "bathrooms":
        return p[key] ? String(p[key]) : "—";
      case "area":
        return formatArea(p.area);
      case "status":
        return <span className="font-semibold capitalize">{p.status.toLowerCase()}</span>;
      default:
        return String(p[key] ?? "—");
    }
  };

  return (
    <div className="hero-gradient pb-16 pt-32">
      <div className="container-site">
        <h1 className="heading-display flex items-center gap-3 text-3xl font-bold text-white md:text-4xl">
          <Columns3 className="h-8 w-8 text-amber-400" /> Compare Properties
        </h1>
        <p className="mt-2 text-slate-300">Select up to 3 properties side by side.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Picker */}
          <div className="space-y-4">
            <Card className="p-5">
              <p className="mb-3 text-sm font-bold">Add a property</p>
              <Input placeholder="Search by name or city…" value={query} onChange={(e) => setQuery(e.target.value)} disabled={selected.length >= 3} />
              <div className="mt-3 space-y-2">
                {searching && <Skeleton className="h-10 w-full" />}
                {!searching &&
                  results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => add(r)}
                      className="flex w-full items-center gap-2 rounded-lg border p-2 text-left text-sm transition-colors hover:border-primary hover:bg-muted"
                    >
                      <Plus className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{r.title}</span>
                    </button>
                  ))}
                {!searching && query && results.length === 0 && (
                  <p className="text-xs text-muted-foreground">No matches found.</p>
                )}
              </div>
            </Card>

            <div className="space-y-2">
              {selected.map((p) => (
                <Card key={p.id} className="flex items-center gap-3 p-3">
                  <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <p className="flex-1 truncate text-sm font-semibold">{p.title}</p>
                  <button
                    onClick={() => setSelected((prev) => prev.filter((x) => x.id !== p.id))}
                    aria-label={`Remove ${p.title}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <Card className="overflow-x-auto p-0">
            {selected.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center">
                <Columns3 className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="font-display text-lg font-bold">Nothing to compare yet</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Search for a property on the left and add up to 3 to see them side by side.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="w-36 p-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Feature</th>
                    {selected.map((p) => (
                      <th key={p.id} className="p-4 text-left">
                        <Link href={`/properties/${p.slug}`} className="line-clamp-2 font-display text-base font-bold hover:text-primary">
                          {p.title}
                        </Link>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.address}, {p.city}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.key} className="border-b last:border-0">
                      <td className="p-4 font-semibold text-muted-foreground">{row.label}</td>
                      {selected.map((p) => (
                        <td key={p.id} className="p-4">
                          {renderCell(p, row.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}