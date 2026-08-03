export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { PropertyFilters } from "@/components/shared/property-filters";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertiesToolbar } from "@/components/shared/properties-toolbar";
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
            <PropertiesToolbar total={result.total} sort={sort} page={result.page} totalPages={result.totalPages} />

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
          </div>
        </div>
      </section>
    </>
  );
}