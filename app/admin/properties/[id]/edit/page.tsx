import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PropertyForm } from "@/components/admin/property-form";
import { BackLink } from "@/components/admin/page-header";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect(`/login?next=/admin/properties/${(await params).id}/edit`);

  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id }, include: { images: true } });
  if (!property) notFound();

  const [agents, categories] = await Promise.all([
    prisma.agent.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href="/admin/properties" label="Back to properties" />
      <h1 className="heading-display mb-6 text-2xl font-bold md:text-3xl">Edit Property</h1>
      <PropertyForm
        agents={agents}
        categories={categories}
        initial={{
          id: property.id,
          title: property.title,
          slug: property.slug,
          description: property.description,
          price: property.price,
          discountPrice: property.discountPrice ?? null,
          type: property.type,
          purpose: property.purpose,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          builtUpArea: property.builtUpArea,
          parking: property.parking,
          furnished: property.furnished,
          yearBuilt: property.yearBuilt,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          country: property.country,
          latitude: property.latitude,
          longitude: property.longitude,
          coverImage: property.coverImage ?? "",
          videoUrl: property.videoUrl ?? "",
          amenities: property.amenities,
          nearbyPlaces: (property.nearbyPlaces as { name: string; type: string; distance: string }[]) ?? [],
          floorPlans: (property.floorPlans as string[]) ?? [],
          tags: property.tags,
          featured: property.featured,
          status: property.status,
          categoryId: property.categoryId,
          agentId: property.agentId,
          gallery: property.images.map((i) => i.url),
        }}
      />
    </div>
  );
}