import { prisma } from "@/lib/prisma";

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  mapLink: string;
  businessHours: string;
  social: { facebook: string; instagram: string; twitter: string; linkedin: string };
  hero: { headline: string; subheading: string };
  stats: { years: string; sold: string; clients: string; cities: string };
  seo: { title: string; description: string };
}

const defaults: SiteSettings = {
  siteName: "VINAY",
  tagline: "Find Your Dream Property",
  description:
    "VINAY is a premium real estate platform helping you discover luxury apartments, villas, commercial spaces and plots.",
  phone: "+1 (415) 555-0182",
  email: "hello@vinay.com",
  address: "1280 Mission Street, San Francisco, CA 94103",
  whatsapp: "14155550182",
  mapLink: "https://maps.google.com/?q=San+Francisco",
  businessHours: "Mon – Sat: 9:00 AM – 7:00 PM",
  social: {
    facebook: "https://facebook.com/vinay",
    instagram: "https://instagram.com/vinay",
    twitter: "https://twitter.com/vinay",
    linkedin: "https://linkedin.com/company/vinay",
  },
  hero: {
    headline: "Find Your Dream Home",
    subheading: "Discover premium apartments, villas, and commercial properties.",
  },
  stats: { years: "18", sold: "3200", clients: "4600", cities: "25" },
  seo: {
    title: "VINAY | Find Your Dream Property",
    description:
      "Browse luxury apartments, villas, houses, plots and commercial real estate. VINAY helps you find your dream property.",
  },
};

/** Maps flat DB settings rows into a typed SiteSettings object. */
export function mapSettings(rows: Record<string, string>): SiteSettings {
  return {
    siteName: rows.site_name || defaults.siteName,
    tagline: rows.tagline || defaults.tagline,
    description: rows.description || defaults.description,
    phone: rows.phone || defaults.phone,
    email: rows.email || defaults.email,
    address: rows.address || defaults.address,
    whatsapp: rows.whatsapp || defaults.whatsapp,
    mapLink: rows.mapLink || defaults.mapLink,
    businessHours: rows.business_hours || defaults.businessHours,
    social: {
      facebook: rows.social_facebook || defaults.social.facebook,
      instagram: rows.social_instagram || defaults.social.instagram,
      twitter: rows.social_twitter || defaults.social.twitter,
      linkedin: rows.social_linkedin || defaults.social.linkedin,
    },
    hero: {
      headline: rows.hero_headline || defaults.hero.headline,
      subheading: rows.hero_subheading || defaults.hero.subheading,
    },
    stats: {
      years: rows.stats_years || defaults.stats.years,
      sold: rows.stats_sold || defaults.stats.sold,
      clients: rows.stats_clients || defaults.stats.clients,
      cities: rows.stats_cities || defaults.stats.cities,
    },
    seo: {
      title: rows.seo_title || defaults.seo.title,
      description: rows.seo_description || defaults.seo.description,
    },
  };
}

const cache = new Map<string, SiteSettings>();

export async function getSiteSettings(): Promise<SiteSettings> {
  const cached = cache.get("site");
  if (cached) return cached;
  try {
    const rows = await prisma.setting.findMany();
    const flat: Record<string, string> = {};
    for (const r of rows) flat[r.key] = r.value;
    const settings = mapSettings(flat);
    cache.set("site", settings);
    return settings;
  } catch {
    return defaults;
  }
}

/** Public settings store used by client components (contacts, social links). */
export function publicSettings(s: SiteSettings) {
  return {
    name: s.siteName,
    tagline: s.tagline,
    description: s.description,
    phone: s.phone,
    email: s.email,
    address: s.address,
    whatsapp: s.whatsapp,
    mapLink: s.mapLink,
    businessHours: s.businessHours,
    social: s.social,
  };
}