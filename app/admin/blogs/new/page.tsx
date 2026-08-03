import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BlogForm } from "@/components/admin/blog-form";
import { BackLink } from "@/components/admin/page-header";

export default async function NewBlogPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?next=/admin/blogs/new");

  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href="/admin/blogs" label="Back to posts" />
      <h1 className="heading-display mb-6 text-2xl font-bold md:text-3xl">Write a New Post</h1>
      <BlogForm categories={categories} />
    </div>
  );
}