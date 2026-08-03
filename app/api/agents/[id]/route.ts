import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { agentSchema } from "@/lib/validations";
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
    const parsed = agentSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const existing = await prisma.agent.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });

    const d = parsed.data;
    const slug = d.slug?.trim() || slugify(d.name);
    if (!slug) throw new ApiError("Could not generate a slug", 400);
    const clash = await prisma.agent.findFirst({ where: { slug, NOT: { id } } });
    if (clash) throw new ApiError("Slug already in use", 400);

    const agent = await prisma.agent.update({
      where: { id },
      data: {
        name: d.name,
        slug,
        title: d.title || undefined,
        photo: d.photo || undefined,
        phone: d.phone || undefined,
        email: d.email.toLowerCase(),
        whatsapp: d.whatsapp || undefined,
        experience: d.experience ?? 0,
        rating: d.rating ?? 5,
        bio: d.bio || undefined,
        social: (d.social ?? undefined) as Prisma.InputJsonValue | undefined,
        languages: d.languages ?? [],
        active: d.active ?? true,
      },
    });
    return NextResponse.json({ success: true, data: agent });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.agent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}