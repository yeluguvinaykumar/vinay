"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PROPERTY_TYPE_LABELS } from "@/types";

export function HeroSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState("");
  const [beds, setBeds] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (budget) params.set("maxPrice", budget);
    if (type) params.set("type", type);
    if (beds) params.set("beds", beds);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className={className}>
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 shadow-2xl md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, address, keyword…"
            className="h-12 rounded-xl pl-10"
            aria-label="Search location"
          />
        </div>

        <Select value={budget} onValueChange={setBudget}>
          <SelectTrigger className="h-12 w-full rounded-xl md:w-40">
            <SelectValue placeholder="Max budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100000">Up to $100K</SelectItem>
            <SelectItem value="250000">Up to $250K</SelectItem>
            <SelectItem value="500000">Up to $500K</SelectItem>
            <SelectItem value="1000000">Up to $1M</SelectItem>
            <SelectItem value="2500000">Up to $2.5M</SelectItem>
            <SelectItem value="99999999">Any</SelectItem>
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-12 w-full rounded-xl md:w-40">
            <SelectValue placeholder="Property type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={beds} onValueChange={setBeds}>
          <SelectTrigger className="h-12 w-full rounded-xl md:w-32">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="5">5+</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl px-8" loading={loading}>
          {!loading && <Search className="h-4 w-4" />}
          Search
        </Button>
      </div>
    </form>
  );
}