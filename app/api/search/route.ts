import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";

/** Instant autocomplete search for the header / hero search. */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    if (q.length < 2) return NextResponse.json({ success: true, data: [] });

    const properties = await prisma.property.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
          { tags: { hasSome: [q] } },
        ],
      },
      take: 6,
      select: { id: true, title: true, slug: true, price: true, city: true, coverImage: true, purpose: true },
    });

    const cities = await prisma.property.findMany({
      where: { city: { contains: q, mode: "insensitive" } },
      distinct: ["city"],
      take: 4,
      select: { city: true },
    });

    const agents = await prisma.agent.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 3,
      select: { id: true, name: true, slug: true, photo: true },
    });

    return NextResponse.json({
      success: true,
      data: { properties, cities: cities.map((c) => c.city), agents },
    });
  } catch (error) {
    return handleError(error);
  }
}