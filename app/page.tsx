export const dynamic = "force-dynamic";

import { buildMetadata } from "@/utils/seo";
import { getSiteSettings } from "@/lib/site";

import { HomeHero } from "@/components/sections/home/hero";
import { HomeCategories } from "@/components/sections/home/categories";
import { FeaturedProperties } from "@/components/sections/home/featured-properties";
import { LatestProperties } from "@/components/sections/home/latest-properties";
import { StatsSection } from "@/components/sections/home/stats";
import { HomeTestimonials } from "@/components/sections/home/testimonials";
import { HomeCta } from "@/components/sections/home/cta";

export const metadata = buildMetadata();

export default async function HomePage() {
  const site = await getSiteSettings();

  return (
    <>
      <HomeHero />
      <HomeCategories />
      <FeaturedProperties />
      <LatestProperties />
      <StatsSection stats={site.stats} />
      <HomeTestimonials />
      <HomeCta />
    </>
  );
}