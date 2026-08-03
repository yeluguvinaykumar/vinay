import { NextResponse } from "next/server";
import { Prisma, PropertyPurpose, PropertyStatus, PropertyType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: Params) {
  try {
    const { id } = await params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sort: "asc" } },
        agent: true,
        category: true,
        _count: { select: { leads: true, appointments: true, reviews: true, wishlist: true } },
      },
    });
    if (!property) return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });

    let slug = d.slug?.trim() || slugify(d.title);
    if (!slug) throw new ApiError("Could not generate a slug", 400);
    const clash = await prisma.property.findFirst({ where: { slug, NOT: { id } } });
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;

    await prisma.$transaction([
      prisma.propertyImage.deleteMany({ where: { propertyId: id } }),
      prisma.property.update({
        where: { id },
        data: {
          title: d.title,
          slug,
          description: d.description,
          price: d.price,
          discountPrice: d.discountPrice ? Number(d.discountPrice) : null,
          type: d.type as PropertyType,
          purpose: (d.purpose || undefined) as PropertyPurpose | undefined,
          bedrooms: d.bedrooms ?? undefined,
          bathrooms: d.bathrooms ?? undefined,
          area: d.area,
          builtUpArea: d.builtUpArea ?? undefined,
          parking: d.parking ?? 0,
          furnished: d.furnished ?? false,
          yearBuilt: d.yearBuilt ?? undefined,
          address: d.address,
          city: d.city,
          state: d.state ?? undefined,
          zipCode: d.zipCode ?? undefined,
          country: d.country ?? "United States",
          latitude: d.latitude ?? undefined,
          longitude: d.longitude ?? undefined,
          coverImage: d.coverImage || undefined,
          videoUrl: d.videoUrl || undefined,
          amenities: d.amenities ?? [],
          nearbyPlaces: d.nearbyPlaces ?? undefined,
          floorPlans: d.floorPlans ?? undefined,
          tags: d.tags ?? [],
          featured: d.featured ?? false,
          status: (d.status || "AVAILABLE") as PropertyStatus,
          categoryId: d.categoryId || undefined,
          agentId: d.agentId || undefined,
          images: {
            create: (d.gallery ?? []).map((url, i) => ({ url, alt: d.title, sort: i })),
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}