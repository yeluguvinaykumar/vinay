import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const settings = await getSiteSettings();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/properties`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/agents`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const [properties, agents, blogs] = await Promise.all([
      prisma.property.findMany({ where: { status: "AVAILABLE" }, select: { slug: true, updatedAt: true } }),
      prisma.agent.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
      prisma.blog.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...properties.map((p) => ({
        url: `${base}/properties/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...agents.map((a) => ({
        url: `${base}/agents/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...blogs.map((b) => ({
        url: `${base}/blog/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
