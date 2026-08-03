import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { propertyQuerySchema } from "@/lib/validations";
import { buildWhere, buildOrder } from "@/lib/properties";
import { handleError } from "@/lib/api";

const LIST_SELECT = {
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
} as const;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const raw: Record<string, string> = {};
    url.searchParams.forEach((v, k) => (raw[k] = v));

    // Support ?ids=id1,id2 for wishlist/compare
    if (raw.ids) {
      const ids = raw.ids.split(",").filter(Boolean);
      const properties = await prisma.property.findMany({
        where: { id: { in: ids } },
        select: LIST_SELECT,
      });
      return NextResponse.json({ success: true, data: { properties } });
    }

    const parsed = propertyQuerySchema.safeParse(raw);
    if (!parsed.success) throw parsed.error;

    const page = parsed.data.page ?? 1;
    const limit = parsed.data.limit ?? 12;
    const where = buildWhere({
      q: parsed.data.q,
      city: parsed.data.city,
      type: parsed.data.type,
      purpose: parsed.data.purpose,
      status: parsed.data.status,
      category: parsed.data.category,
      agent: parsed.data.agent,
      minPrice: parsed.data.minPrice,
      maxPrice: parsed.data.maxPrice,
      beds: parsed.data.beds,
      baths: parsed.data.baths,
      minArea: parsed.data.minArea,
      maxArea: parsed.data.maxArea,
      furnished: parsed.data.furnished,
      featured: parsed.data.featured,
    });

    const [properties, total] = await prisma.$transaction([
      prisma.property.findMany({
        where,
        select: LIST_SELECT,
        orderBy: buildOrder(parsed.data.sort),
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { properties, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    return handleError(error);
  }
}