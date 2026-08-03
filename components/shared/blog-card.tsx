import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, Eye, Tag, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatDate, readingTime } from "@/utils/format";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  category: { name: string; slug: string } | null;
  tags: string[];
  views: number;
  publishedAt: Date;
}

export function BlogCard({ post, featured = false, className }: { post: BlogPost; featured?: boolean; className?: string }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "card-lift group block overflow-hidden rounded-2xl border bg-card shadow-sm",
        featured && "sm:col-span-2",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 800px" : "(max-width: 640px) 100vw, 500px"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/15 to-accent/15" />
        )}
        {post.category && (
          <Badge className="absolute left-4 top-4 bg-slate-900/70 text-white backdrop-blur-sm">
            {post.category.name}
          </Badge>
        )}
      </div>
      <div className={cn("p-6", featured && "lg:grid lg:grid-cols-2 lg:gap-8")}>
        <div className={cn(featured && "lg:order-2")}>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-accent" /> {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-accent" /> {readingTime(post.content)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-accent" /> {post.views.toLocaleString()}
            </span>
          </div>
          <h2 className={cn("mt-3 font-display font-bold transition-colors group-hover:text-primary", featured ? "text-2xl md:text-3xl" : "text-lg")}>
            {post.title}
          </h2>
          {featured && post.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-3.5 w-3.5" />
              </span>
              {post.author}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
        {featured && post.excerpt && (
          <p className="mt-4 hidden text-sm leading-relaxed text-muted-foreground lg:order-1 lg:mt-0 lg:block">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}