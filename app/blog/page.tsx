export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Search, User } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/utils/seo";
import { formatDate, readingTime } from "@/utils/format";
import { PageHero } from "@/components/layout/page-hero";
import { BlogCard } from "@/components/shared/blog-card";
import { EmptyState } from "@/components/shared/empty-state";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Real estate insights, buying guides, design inspiration and market news from the VINAY team.",
  canonicalPath: "/blog",
});

const get = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (get(sp.q) ?? "").trim();
  const category = get(sp.category) ?? "";

  const categories = await prisma.blogCategory.findMany({ orderBy: { createdAt: "asc" } });

  const where = {
    published: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { excerpt: { contains: q, mode: "insensitive" as const } }, { tags: { hasSome: [q] } }] } : {}),
  };

  const posts = await prisma.blog.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: 12,
    include: { category: true },
  });

  const recent = await prisma.blog.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" }, take: 4, select: { id: true, title: true, slug: true, publishedAt: true, views: true } });
  const popular = await prisma.blog.findMany({ where: { published: true }, orderBy: { views: "desc" }, take: 4, select: { id: true, title: true, slug: true, publishedAt: true, views: true } });

  return (
    <>
      <PageHero
        title="VINAY Blog"
        description="Market insights, buying guides and design inspiration from our experts."
        crumbs={[{ label: "Blog" }]}
      />

      <section className="section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Category chips + search */}
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-colors ${
                  !category ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
                }`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/blog?category=${c.slug}`}
                  className={`rounded-full border px-4 py-1.5 text-xs font-bold capitalize transition-colors ${
                    category === c.slug ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
              <form action="/blog" className="relative ml-auto w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search articles…"
                  className="h-10 w-full rounded-full border bg-card pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </form>
            </div>

            {posts.length === 0 ? (
              <EmptyState title="No articles found" description="Try a different search or category." action={{ label: "All posts", href: "/blog" }} />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((p, i) => (
                  <BlogCard key={p.id} post={p} featured={i === 0 && !q && !category} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-card p-5">
              <h3 className="mb-4 font-display text-lg font-bold">Recent Posts</h3>
              <ul className="space-y-4">
                {recent.map((r) => (
                  <li key={r.id}>
                    <Link href={`/blog/${r.slug}`} className="group block">
                      <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                        {r.title}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <CalendarDays className="h-3 w-3" /> {formatDate(r.publishedAt)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <h3 className="mb-4 font-display text-lg font-bold">Popular Posts</h3>
              <ul className="space-y-4">
                {popular.map((r) => (
                  <li key={r.id}>
                    <Link href={`/blog/${r.slug}`} className="group block">
                      <p className="text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                        {r.title}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <User className="h-3 w-3" /> {r.views.toLocaleString()} views
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-gradient rounded-2xl p-6 text-white">
              <h3 className="font-display text-lg font-bold">Looking for a property?</h3>
              <p className="mt-2 text-sm text-slate-300">Browse our handpicked listings today.</p>
              <Link href="/properties" className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 px-5 py-2.5 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5">
                Browse Properties
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}