import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const t = await prisma.testimonial.create({
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
    return NextResponse.json({ success: true, data: t }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}