import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handleError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const message = await prisma.message.update({ where: { id }, data: { read: true } });
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.message.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}