import Link from "next/link";
import { ArrowRight, Building2, Home, House, Map, MapPin, type LucideIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { PROPERTY_TYPE_LABELS } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  Building2,
  Home,
  House,
  Map,
  MapPin,
};

export async function HomeCategories() {
  const categories = await prisma.category.findMany({ orderBy: { sort: "asc" } });
  const counts = await prisma.property.groupBy({ by: ["categoryId"], _count: { _all: true } });
  const countMap = Object.fromEntries(counts.map((c) => [c.categoryId, c._count._all]));

  const items = categories.map((c) => {
    const Icon = ICONS[c.icon ?? "Home"] ?? Home;
    return { ...c, count: countMap[c.id] ?? 0, Icon };
  });

  return (
    <section className="section-pad bg-background">
      <div className="container-site">
        <SectionHeading
          eyebrow="Browse by category"
          title="Explore Property Types"
          description="From luxury villas to city apartments — find the perfect category for your lifestyle."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.06}>
              <Link
                href={`/properties?category=${c.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-navy"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/15 text-primary transition-all group-hover:from-primary group-hover:to-primary/70 group-hover:text-white">
                  <c.Icon className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">{c.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {c.count} {c.count === 1 ? "property" : "properties"}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </Reveal>
          ))}
          {items.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              Categories will appear once the database is seeded.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}