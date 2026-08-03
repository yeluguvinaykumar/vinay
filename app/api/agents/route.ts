import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { agentSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      where: { active: true },
      orderBy: { rating: "desc" },
      include: { _count: { select: { properties: true } } },
    });
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = agentSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    const slug = d.slug?.trim() || slugify(d.name);
    if (!slug) throw new ApiError("Could not generate a slug", 400);

    const agent = await prisma.agent.create({
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
    return NextResponse.json({ success: true, data: agent }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}