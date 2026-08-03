import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const slug = parsed.data.slug?.trim() || slugify(parsed.data.name);
    if (!slug) throw new ApiError("Could not generate a slug", 400);
    const clash = await prisma.category.findFirst({ where: { slug, NOT: { id } } });
    if (clash) throw new ApiError("Slug already in use", 400);

    const category = await prisma.category.update({
      where: { id },
      data: { name: parsed.data.name, slug, icon: parsed.data.icon || undefined, sort: parsed.data.sort ?? 0 },
    });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}