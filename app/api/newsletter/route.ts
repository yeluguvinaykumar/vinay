import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";
import { handleError, withRateLimit } from "@/lib/api";

export async function GET() {
  try {
    await requireAdmin();
    const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 5, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: true, data: { message: "Already subscribed" } });
    }

    await prisma.newsletter.create({ data: { email } });
    return NextResponse.json({ success: true, data: { email } }, { status: 201 });
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
    await prisma.newsletter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}