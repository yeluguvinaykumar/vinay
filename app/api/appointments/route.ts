import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError, withRateLimit } from "@/lib/api";
import { sendMail, confirmationHtml } from "@/lib/mail";
import { TIME_SLOTS } from "@/types";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") ?? undefined;
    const q = url.searchParams.get("q")?.trim() ?? "";

    const where: Prisma.AppointmentWhereInput = {
      ...(status ? { status: status as Prisma.AppointmentWhereInput["status"] } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } : {}),
    };

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { date: "asc" },
      include: { property: { select: { id: true, title: true, slug: true } } },
    });
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 5, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    if (!TIME_SLOTS.includes(d.timeSlot)) throw new ApiError("Invalid time slot", 422);

    const date = new Date(`${d.date}T00:00:00Z`);
    if (date.getTime() < Date.now() - 24 * 3600_000) throw new ApiError("Please pick a future date", 422);

    const slotTaken = await prisma.appointment.findFirst({
      where: { date, timeSlot: d.timeSlot, status: { in: ["PENDING", "CONFIRMED", "RESCHEDULED"] } },
    });
    if (slotTaken) throw new ApiError("That slot was just booked. Please pick another.", 409);

    const appointment = await prisma.appointment.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        phone: d.phone,
        date,
        timeSlot: d.timeSlot,
        message: d.message || undefined,
        propertyId: d.propertyId || undefined,
      },
    });

    await sendMail({
      to: d.email,
      subject: "Your VINAY viewing request is confirmed",
      html: confirmationHtml(
        "Visit scheduled",
        [
          { label: "Name", value: d.name },
          { label: "Date", value: d.date },
          { label: "Time", value: d.timeSlot },
          { label: "Status", value: "Pending confirmation by agent" },
        ],
        { url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/properties`, label: "Browse More Properties" }
      ),
    });

    return NextResponse.json({ success: true, data: { id: appointment.id } }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}