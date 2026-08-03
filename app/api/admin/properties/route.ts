import { NextResponse } from "next/server";
import { Prisma, PropertyPurpose, PropertyStatus, PropertyType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = propertySchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    const slug = d.slug?.trim() || slugify(d.title);
    if (!slug) throw new ApiError("Could not generate a slug", 400);

    const base = slug;
    let finalSlug = slug;
    let n = 1;
    while (await prisma.property.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${base}-${n++}`;
    }

    const property = await prisma.property.create({
      data: {
        title: d.title,
        slug: finalSlug,
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
    });

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const top = url.searchParams.get("top") === "true";
    if (top) {
      const properties = await prisma.property.findMany({
        orderBy: [{ views: "desc" }, { createdAt: "desc" }],
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          views: true,
          coverImage: true,
          purpose: true,
          price: true,
          discountPrice: true,
        },
      });
      return NextResponse.json({ success: true, data: properties });
    }

    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));

    const where: Prisma.PropertyWhereInput = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
          ],
        }
      : {};

    const [properties, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          agent: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { images: true, leads: true, wishlist: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { properties, total, page, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return handleError(error);
  }
}