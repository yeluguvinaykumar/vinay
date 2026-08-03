import { prisma } from "@/lib/prisma";
import { safe } from "@/lib/query";
import { SectionHeading } from "@/components/shared/section-heading";
import { PropertyCard } from "@/components/shared/property-card";
import { Reveal } from "@/components/shared/reveal";

export async function FeaturedProperties() {
  const featured = await safe(
    () =>
      prisma.property.findMany({
        where: { featured: true },
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
    <section className="section-pad bg-muted/40">
      <div className="container-site">
        <SectionHeading
          eyebrow="Handpicked for you"
          title="Featured Listings"
          description="Our most exceptional properties, selected by our expert team."
        />
        {featured.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No featured listings yet — run the seed script to add sample properties.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
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