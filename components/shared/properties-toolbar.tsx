"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Pagination } from "@/components/shared/pagination";

export function PropertiesToolbar({
  total,
  sort,
  page,
  totalPages,
}: {
  total: number;
  sort: string;
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const push = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">{total}</span> {total === 1 ? "property" : "properties"} found
        </p>
        <select
          name="sort"
          value={sort}
          onChange={(e) => push({ sort: e.target.value, page: undefined })}
          className="h-10 rounded-lg border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Sort properties"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-12 flex justify-center">
        <Pagination page={page} totalPages={totalPages} onPageChange={(p) => push({ page: String(p) })} />
      </div>

      {totalPages > 1 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Viewing page {page} of {totalPages}
        </p>
      )}
    </>
  );
}
