import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";
import { handleError, withRateLimit } from "@/lib/api";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const propertyId = url.searchParams.get("propertyId") ?? undefined;
    const where = propertyId ? { propertyId } : {};
    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { property: { select: { id: true, title: true } } },
    });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 4, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const property = await prisma.property.findUnique({ where: { id: parsed.data.propertyId } });
    if (!property) return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });

    const review = await prisma.review.create({
      data: {
        propertyId: parsed.data.propertyId,
        name: parsed.data.name,
        email: parsed.data.email?.toLowerCase() || undefined,
        rating: parsed.data.rating,
        comment: parsed.data.comment,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: review.id,
          name: review.name,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}