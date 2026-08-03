import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { blogSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { requireAdmin, ApiError } from "@/lib/auth";
import { handleError } from "@/lib/api";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) throw parsed.error;

    const d = parsed.data;
    const slug = d.slug?.trim() || slugify(d.title);
    if (!slug) throw new ApiError("Could not generate a slug", 400);
    const clash = await prisma.blog.findFirst({ where: { slug, NOT: { id } } });
    if (clash) throw new ApiError("Slug already in use", 400);

    const blog = await prisma.blog.update({
      where: { id },
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
        publishedAt: d.publishedAt ? new Date(d.publishedAt) : undefined,
        metaTitle: d.metaTitle || undefined,
        metaDescription: d.metaDescription || undefined,
      },
    });
    return NextResponse.json({ success: true, data: blog });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}