import { NextResponse } from "next/server";

import { requireAdmin, ApiError } from "@/lib/auth";
import { saveUpload } from "@/lib/upload";
import { handleError } from "@/lib/api";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "general").replace(/[^a-z0-9-_]/gi, "") || "general";

    if (!(file instanceof File)) throw new ApiError("No file provided", 400);

    const url = await saveUpload(file, folder);
    return NextResponse.json({ success: true, data: { url, name: file.name, size: file.size } }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}