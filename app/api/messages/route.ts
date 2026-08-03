import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";
import { handleError, withRateLimit } from "@/lib/api";
import { sendMail } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get("unread") === "true";
    const where: Prisma.MessageWhereInput = unreadOnly ? { read: false } : {};
    const messages = await prisma.message.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 5, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const message = await prisma.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });

    await sendMail({
      to: parsed.data.email,
      subject: "We received your message",
      html: `<p>Hi ${parsed.data.name},</p><p>Thanks for reaching out to VINAY. Our team will reply to <b>${parsed.data.subject}</b> within 24 hours.</p>`,
    });

    return NextResponse.json({ success: true, data: { id: message.id } }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}