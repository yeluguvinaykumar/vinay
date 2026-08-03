import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BlogForm } from "@/components/admin/blog-form";
import { BackLink } from "@/components/admin/page-header";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect(`/login?next=/admin/blogs/${id}/edit`);

  const [post, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href="/admin/blogs" label="Back to posts" />
      <h1 className="heading-display mb-6 text-2xl font-bold md:text-3xl">Edit Post</h1>
      <BlogForm
        categories={categories}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug ?? "",
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImage: post.coverImage ?? "",
          author: post.author ?? "",
          categoryId: post.categoryId,
          tags: post.tags,
          published: post.published,
          publishedAt: post.publishedAt?.toISOString() ?? null,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        }}
      />
    </div>
  );
}