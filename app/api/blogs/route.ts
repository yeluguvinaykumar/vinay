import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim() ?? "";
    const category = url.searchParams.get("category") ?? "";

    const where: Prisma.BlogWhereInput = {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { excerpt: { contains: q, mode: "insensitive" } }] } : {}),
    };

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 12,
      include: { category: true },
    });
    return NextResponse.json({ success: true, data: blogs });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    const slug = d.slug?.trim() || slugify(d.title);
    if (!slug) throw new ApiError("Could not generate a slug", 400);

    const blog = await prisma.blog.create({
      data: {
        title: d.title,
        slug,
        excerpt: d.excerpt || undefined,
        content: d.content,
        coverImage: d.coverImage || undefined,
        author: d.author || "VINAY Team",
        categoryId: d.categoryId || undefined,
        tags: d.tags ?? [],
        published: d.published ?? true,
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : new Date(),
        metaTitle: d.metaTitle || undefined,
        metaDescription: d.metaDescription || undefined,
      },
    });
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}