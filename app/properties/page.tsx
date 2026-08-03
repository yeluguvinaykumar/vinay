export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/page-hero";
import { PropertyFilters } from "@/components/shared/property-filters";
import { PropertyCard } from "@/components/shared/property-card";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { listProperties, getCities } from "@/lib/properties";
import { buildMetadata } from "@/utils/seo";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const get = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export const metadata: Metadata = buildMetadata({
  title: "Properties",
  description: "Browse apartments, villas, houses, plots and commercial properties for sale and rent.",
  canonicalPath: "/properties",
});

export default async function PropertiesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const result = await listProperties({
    q: get(sp.q),
    city: get(sp.city),
    type: get(sp.type),
    purpose: get(sp.purpose),
    status: get(sp.status),
    category: get(sp.category),
    agent: get(sp.agent),
    minPrice: get(sp.minPrice) ? Number(get(sp.minPrice)) : undefined,
    maxPrice: get(sp.maxPrice) ? Number(get(sp.maxPrice)) : undefined,
    beds: get(sp.beds) ? Number(get(sp.beds)) : undefined,
    baths: get(sp.baths) ? Number(get(sp.baths)) : undefined,
    furnished: get(sp.furnished) === "true" ? true : undefined,
    featured: get(sp.featured) === "true" ? true : undefined,
    sort: get(sp.sort),
    page: get(sp.page) ? Number(get(sp.page)) : 1,
  });
  const cities = (await getCities()).map((c) => c.city);
  const sort = get(sp.sort) ?? "newest";

  return (
    <>
      <PageHero
        title="Explore Properties"
        description="Filter by location, budget, type and more to find your perfect property."
        crumbs={[{ label: "Properties" }]}
      />

      <section className="section-pad">
        <div className="container-site grid gap-8 lg:grid-cols-[300px_1fr]">
          <PropertyFilters cities={cities} />

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{result.total}</span>{" "}
                {result.total === 1 ? "property" : "properties"} found
              </p>
              <form action="/properties" className="flex items-center gap-2">
                <input type="hidden" name="q" value={get(sp.q) ?? ""} />
                <select
                  name="sort"
                  defaultValue={sort}
                  onChange={(e) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("sort", e.target.value);
                    window.location.href = url.toString();
                  }}
                  className="h-10 rounded-lg border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Sort properties"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </form>
            </div>

            {result.properties.length === 0 ? (
              <EmptyState
                title="No properties found"
                description="Try adjusting your filters or browse all our listings."
                action={{ label: "Clear filters", href: "/properties" }}
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={(page) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("page", String(page));
                  window.location.href = url.toString();
                }}
              />
            </div>

            {result.totalPages > 1 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Viewing page {result.page} of {result.totalPages} —{" "}
                <Link href="/properties" className="text-primary hover:underline">
                  back to page 1
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}