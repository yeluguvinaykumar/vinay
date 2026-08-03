import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { createSessionCookie, ApiError } from "@/lib/auth";
import { handleError, withRateLimit } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 10, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) throw new ApiError("Invalid email or password", 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ApiError("Invalid email or password", 401);

    await createSessionCookie({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return handleError(error);
  }
}