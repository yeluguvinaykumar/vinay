import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const DAYS = 7;

const cookieName = () => process.env.COOKIE_NAME || "vinay_token";

export interface SessionPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: `${DAYS}d`, issuer: "vinay" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SECRET, { issuer: "vinay" }) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSessionCookie(user: { id: string; email: string; role: string }) {
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const cookieStore = await cookies();
  cookieStore.set(cookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 86400,
  });
  return { token };
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName())?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, email: true, role: true, image: true },
  });
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName());
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}