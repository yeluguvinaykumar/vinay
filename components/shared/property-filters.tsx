"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, RotateCcw, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROPERTY_TYPE_LABELS } from "@/types";

export function PropertyFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = React.useState(sp.get("q") ?? "");
  const [city, setCity] = React.useState(sp.get("city") ?? "");
  const [type, setType] = React.useState(sp.get("type") ?? "");
  const [purpose, setPurpose] = React.useState(sp.get("purpose") ?? "");
  const [minPrice, setMinPrice] = React.useState(sp.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = React.useState(sp.get("maxPrice") ?? "");
  const [beds, setBeds] = React.useState(sp.get("beds") ?? "");
  const [baths, setBaths] = React.useState(sp.get("baths") ?? "");
  const [furnished, setFurnished] = React.useState(sp.get("furnished") === "true");

  const apply = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (purpose) params.set("purpose", purpose);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (beds) params.set("beds", beds);
    if (baths) params.set("baths", baths);
    if (furnished) params.set("furnished", "true");
    const sort = sp.get("sort");
    if (sort) params.set("sort", sort);
    router.push(`/properties?${params.toString()}`);
  };

  const reset = () => {
    setQ("");
    setCity("");
    setType("");
    setPurpose("");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    setFurnished(false);
    router.push("/properties");
  };

  return (
    <form onSubmit={apply} className="space-y-5 rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold">
          <SlidersHorizontal className="h-4 w-4 text-accent" /> Filters
        </h3>
        <Button type="button" variant="ghost" size="sm" onClick={reset} className="gap-1.5 text-xs">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="f-q">Search</Label>
        <Input id="f-q" placeholder="City, address, keyword…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>City</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue placeholder="Any city" /></SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Purpose</Label>
          <Select value={purpose} onValueChange={setPurpose}>
            <SelectTrigger><SelectValue placeholder="Buy or rent" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="SALE">For Sale</SelectItem>
              <SelectItem value="RENT">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Bedrooms</Label>
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
            <SelectContent>
              {["1", "2", "3", "4", "5"].map((b) => (
                <SelectItem key={b} value={b}>{b}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Bathrooms</Label>
          <Select value={baths} onValueChange={setBaths}>
            <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
            <SelectContent>
              {["1", "2", "3", "4"].map((b) => (
                <SelectItem key={b} value={b}>{b}+</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Price</Label>
          <div className="flex items-center gap-1.5">
            <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-9" />
            <span className="text-muted-foreground">–</span>
            <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-9" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2.5">
        <Label htmlFor="f-furnished" className="cursor-pointer">Furnished only</Label>
        <Switch id="f-furnished" checked={furnished} onCheckedChange={setFurnished} />
      </div>

      <Button type="submit" className="w-full gap-2" size="lg">
        <Filter className="h-4 w-4" /> Apply Filters
      </Button>
    </form>
  );
}