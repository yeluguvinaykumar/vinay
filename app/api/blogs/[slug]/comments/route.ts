import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { handleError, withRateLimit } from "@/lib/api";

interface Params {
  params: Promise<{ slug: string }>;
}

const commentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  comment: z.string().trim().min(5).max(1500),
});

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const messages = await prisma.message.findMany({
      where: { subject: `Blog comment on ${slug}` },
      orderBy: { createdAt: "asc" },
    });
    const comments = messages.map((m) => ({
      id: m.id,
      name: m.name,
      comment: m.message,
      createdAt: m.createdAt.toISOString(),
    }));
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const limited = withRateLimit(request, 4, 60_000);
    if (limited) return limited;

    const { slug } = await params;
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const message = await prisma.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: `Blog comment on ${slug}`,
        message: parsed.data.comment,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: message.id, name: message.name, comment: message.message, createdAt: message.createdAt.toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}