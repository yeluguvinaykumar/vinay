import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/api";

export async function GET() {
  try {
    const rows = await prisma.setting.findMany();
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const { isAdmin } = await import("@/lib/auth");
    if (!(await isAdmin())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const entries = Object.entries(body).filter(
      ([k, v]) => typeof v === "string" && v.length <= 5000
    );

    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })
      )
    );

    return NextResponse.json({ success: true, data: { updated: entries.length } });
  } catch (error) {
    return handleError(error);
  }
}