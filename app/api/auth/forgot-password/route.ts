import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";
import { handleError, withRateLimit } from "@/lib/api";
import { sendMail, confirmationHtml } from "@/lib/mail";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: Request) {
  try {
    const limited = withRateLimit(request, 5, 60_000);
    if (limited) return limited;

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });

    // Always return success to avoid user enumeration
    if (user) {
      const token = jwt.sign({ id: user.id, purpose: "reset" }, SECRET, { expiresIn: "1h", issuer: "vinay" });
      const link = `${SITE_URL}/reset-password?token=${token}`;
      await sendMail({
        to: user.email,
        subject: "Reset your VINAY password",
        html: confirmationHtml(
          "Password reset request",
          [
            { label: "Account", value: user.email },
            { label: "Valid for", value: "1 hour" },
          ],
          { url: link, label: "Reset Password" }
        ),
      });
    }

    return NextResponse.json({
      success: true,
      data: { message: "If an account exists for that email, a reset link has been sent." },
    });
  } catch (error) {
    return handleError(error);
  }
}