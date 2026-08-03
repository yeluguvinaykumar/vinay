import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const status = String(body.status ?? "").toUpperCase();
    const valid = ["NEW", "CONTACTED", "FOLLOW_UP", "CLOSED", "LOST"];
    if (!valid.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 422 });
    }
    const lead = await prisma.lead.update({ where: { id }, data: { status: status as "NEW" } });
    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.lead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}