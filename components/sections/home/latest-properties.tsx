import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { safe } from "@/lib/query";
import { SectionHeading } from "@/components/shared/section-heading";
import { PropertyCard } from "@/components/shared/property-card";
import { Reveal } from "@/components/shared/reveal";

export async function LatestProperties() {
  const latest = await safe(
    () =>
      prisma.property.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          discountPrice: true,
          type: true,
          purpose: true,
          status: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          city: true,
          state: true,
          address: true,
          coverImage: true,
          featured: true,
          furnished: true,
          createdAt: true,
          agent: { select: { name: true, slug: true, photo: true } },
          category: { select: { name: true, slug: true } },
        },
      }),
    []
  );

  return (
    <section className="section-pad">
      <div className="container-site">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Fresh on the market"
            title="Latest Properties"
            description="Newly listed homes and investment opportunities."
            className="mb-0"
          />
          <Reveal delay={0.15}>
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              View All Properties
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {latest.length === 0 ? (
          <p className="text-center text-muted-foreground">No properties yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}