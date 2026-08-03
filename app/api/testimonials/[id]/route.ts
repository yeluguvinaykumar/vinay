import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const t = await prisma.testimonial.update({
      where: { id },
      data: {
        name: parsed.data.name,
        role: parsed.data.role || undefined,
        company: parsed.data.company || undefined,
        content: parsed.data.content,
        rating: parsed.data.rating,
        avatar: parsed.data.avatar || undefined,
        featured: parsed.data.featured ?? false,
        active: parsed.data.active ?? true,
      },
    });
    return NextResponse.json({ success: true, data: t });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}