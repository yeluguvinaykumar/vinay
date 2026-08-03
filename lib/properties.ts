import { prisma } from "@/lib/prisma";
import { safe } from "@/lib/query";
import type { Prisma } from "@prisma/client";

export interface PropertyListQuery {
  q?: string;
  city?: string;
  type?: string;
  purpose?: string;
  status?: string;
  category?: string;
  agent?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minArea?: number;
  maxArea?: number;
  furnished?: boolean;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

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
} satisfies Prisma.PropertySelect;

export function buildWhere(query: PropertyListQuery): Prisma.PropertyWhereInput {
  const where: Prisma.PropertyWhereInput = {};

  if (query.q) {
    const q = query.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { state: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { tags: { hasSome: [q] } },
    ];
  }
  if (query.city) where.city = { contains: query.city, mode: "insensitive" };
  if (query.type) where.type = query.type as Prisma.PropertyWhereInput["type"];
  if (query.purpose) where.purpose = query.purpose as Prisma.PropertyWhereInput["purpose"];
  if (query.status) where.status = query.status as Prisma.PropertyWhereInput["status"];
  if (query.category) where.category = { slug: query.category };
  if (query.agent) where.agent = { slug: query.agent };
  if (query.minPrice != null) where.price = { ...(where.price as object), gte: query.minPrice };
  if (query.maxPrice != null) where.price = { ...(where.price as object), lte: query.maxPrice };
  if (query.beds != null) where.bedrooms = { gte: query.beds };
  if (query.baths != null) where.bathrooms = { gte: query.baths };
  if (query.minArea != null) where.area = { ...(where.area as object), gte: query.minArea };
  if (query.maxArea != null) where.area = { ...(where.area as object), lte: query.maxArea };
  if (query.furnished != null) where.furnished = query.furnished;
  if (query.featured != null) where.featured = query.featured;
  return where;
}

export function buildOrder(sort?: string): Prisma.PropertyOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }];
    case "price_asc":
      return [{ price: "asc" }];
    case "price_desc":
      return [{ price: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function listProperties(query: PropertyListQuery) {
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(48, Math.max(1, query.limit ?? 12));
  const where = buildWhere(query);

  const [properties, total] = await safe(
    () =>
      prisma.$transaction([
        prisma.property.findMany({
          where,
          select: LIST_SELECT,
          orderBy: buildOrder(query.sort),
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.property.count({ where }),
      ]),
    [[], 0]
  );

  return { properties, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getCities() {
  const rows = await safe(() => prisma.property.groupBy({ by: ["city"], _count: { _all: true } }), []);
  return rows.map((r) => ({ city: r.city, count: r._count._all })).sort((a, b) => b.count - a.count);
}