import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { listUploads, removeUpload } from "@/lib/upload";
import { handleError } from "@/lib/api";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") ?? undefined;
    const files = await listUploads(folder);
    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) return NextResponse.json({ success: false, error: "Missing path" }, { status: 400 });
    await removeUpload(path);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}