import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";
import { handleError, withRateLimit } from "@/lib/api";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 5, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    let payload: { id: string; purpose: string };
    try {
      payload = jwt.verify(parsed.data.token, SECRET, { issuer: "vinay" }) as typeof payload;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid or expired reset link" }, { status: 400 });
    }
    if (payload.purpose !== "reset") {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ success: false, error: "Account not found" }, { status: 404 });

    await prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(parsed.data.password, 10) },
    });

    return NextResponse.json({ success: true, data: { message: "Password updated. You can now sign in." } });
  } catch (error) {
    return handleError(error);
  }
}