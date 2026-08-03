import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError, withRateLimit } from "@/lib/api";
import { sendMail, confirmationHtml } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const q = url.searchParams.get("q")?.trim() ?? "";
    const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));

    const where: Prisma.LeadWhereInput = {
      ...(status ? { status: status as Prisma.LeadWhereInput["status"] } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
    };

    const [leads, total] = await prisma.$transaction([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { property: { select: { id: true, title: true, slug: true } } },
      }),
      prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: { leads, total, page, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 6, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    const lead = await prisma.lead.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        phone: d.phone || undefined,
        message: d.message || undefined,
        source: d.source || "inquiry",
        propertyId: d.propertyId || undefined,
      },
    });

    const property = d.propertyId
      ? await prisma.property.findUnique({ where: { id: d.propertyId }, select: { title: true } })
      : null;

    await sendMail({
      to: d.email,
      subject: `We received your inquiry${property ? ` — ${property.title}` : ""}`,
      html: confirmationHtml(
        "Thank you for contacting VINAY",
        [
          { label: "Name", value: d.name },
          { label: "Phone", value: d.phone || "—" },
          ...(property ? [{ label: "Property", value: property.title }] : []),
          ...(d.message ? [{ label: "Message", value: d.message.slice(0, 120) }] : []),
        ],
        { url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/properties`, label: "Browse Properties" }
      ),
    });

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}