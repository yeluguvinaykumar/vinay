export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Clock3, Eye, User } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { safe } from "@/lib/query";
import { buildMetadata } from "@/utils/seo";
import { formatDate, readingTime } from "@/utils/format";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ShareButtons } from "@/components/shared/share-buttons";
import { BlogCard } from "@/components/shared/blog-card";
import { BlogComments } from "@/components/shared/blog-comments";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await safe(
    () =>
      prisma.blog.findUnique({
        where: { slug },
        select: { title: true, excerpt: true, coverImage: true, metaTitle: true, metaDescription: true },
      }),
    null
  );
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? post.title,
    image: post.coverImage ?? undefined,
    type: "article",
    publishedTime: undefined,
    canonicalPath: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await safe(
    () =>
      prisma.blog.findUnique({
        where: { slug },
        include: { category: true },
      }),
    null
  );

  if (!post || !post.published) notFound();

  void prisma.blog.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const related = await safe(
    () =>
      prisma.blog.findMany({
        where: {
          published: true,
          OR: [{ categoryId: post.categoryId ?? undefined }, { tags: { hasSome: post.tags } }],
          NOT: { id: post.id },
        },
        take: 3,
        include: { category: true },
      }),
    []
  );

  const paragraphs = post.content.split(/\n{2,}/);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.coverImage,
            datePublished: post.publishedAt.toISOString(),
            author: { "@type": "Person", name: post.author },
            publisher: { "@type": "Organization", name: "VINAY" },
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
          }),
        }}
      />

      <div className="bg-muted/40 pt-28">
        <div className="container-site pb-6">
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
        </div>
      </div>

      <article className="section-pad">
        <div className="container-site max-w-3xl">
          <header className="mb-8 text-center">
            {post.category && (
              <Link href={`/blog?category=${post.category.slug}`}>
                <span className="mb-4 inline-flex rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                  {post.category.name}
                </span>
              </Link>
            )}
            <h1 className="heading-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">{post.title}</h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-accent" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-accent" /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-accent" /> {readingTime(post.content)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-accent" /> {post.views.toLocaleString()} views
              </span>
            </div>
          </header>

          {post.coverImage && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl">
              <Image src={post.coverImage} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}

          <div className="prose-vinay mb-10">
            {paragraphs.map((p, i) =>
              p.startsWith("!img ") ? (
                <Image key={i} src={p.slice(5)} alt="" width={800} height={450} className="rounded-2xl" />
              ) : (
                <p key={i}>{p}</p>
              )
            )}
          </div>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link key={t} href={`/blog?q=${encodeURIComponent(t)}`}>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold transition-colors hover:bg-primary hover:text-primary-foreground">
                    #{t}
                  </span>
                </Link>
              ))}
            </div>
            <ShareButtons url={`/blog/${post.slug}`} title={post.title} />
          </div>

          <BlogComments postId={post.id} postSlug={post.slug} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="section-pad bg-muted/40">
          <div className="container-site">
            <h2 className="heading-display mb-8 text-center text-2xl font-bold md:text-3xl">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}