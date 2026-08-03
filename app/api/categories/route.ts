import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sort: "asc" },
      include: { _count: { select: { properties: true } } },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
    if (!slug) throw new ApiError("Could not generate a slug", 400);

    const category = await prisma.category.create({
      data: { name: parsed.data.name, slug, icon: parsed.data.icon || undefined, sort: parsed.data.sort ?? 0 },
    });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = (await request.json()) as Array<{ id: string; sort: number }>;
    if (!Array.isArray(body) || body.length === 0 || body.length > 50) {
      throw new ApiError("Expected an array of { id, sort } pairs", 400);
    }
    await prisma.$transaction(
      body.map((item) =>
        prisma.category.update({ where: { id: item.id }, data: { sort: item.sort } }),
      ),
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}