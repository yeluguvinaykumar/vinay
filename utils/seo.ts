import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export interface PageSeo {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
  canonicalPath?: string;
}

export function buildMetadata({
  title,
  description = "VINAY — Find Your Dream Property. Browse luxury apartments, villas, houses, plots and commercial real estate.",
  image = `${SITE_URL}/og.png`,
  type = "website",
  publishedTime,
  keywords,
  canonicalPath,
}: PageSeo = {}): Metadata {
  const canonical = canonicalPath ? `${SITE_URL}${canonicalPath}` : undefined;
  return {
    title: title ? `${title} | VINAY` : "VINAY | Find Your Dream Property",
    description,
    keywords: keywords ?? ["real estate", "properties", "apartments", "villas", "buy", "rent", "VINAY"],
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: title ? `${title} | VINAY` : "VINAY | Find Your Dream Property",
      description,
      url: canonical,
      siteName: "VINAY",
      locale: "en_US",
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title ?? "VINAY" }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | VINAY` : "VINAY | Find Your Dream Property",
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

export function realEstateSchema(property: {
  name: string;
  description: string;
  price: number;
  image: string;
  url: string;
  address: string;
  city: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.name,
    description: property.description,
    image: property.image,
    url: property.url,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    ...(property.bedrooms
      ? {
          additionalProperty: [
            { "@type": "PropertyValue", name: "Bedrooms", value: property.bedrooms },
            { "@type": "PropertyValue", name: "Bathrooms", value: property.bathrooms },
            { "@type": "PropertyValue", name: "Area", value: `${property.area} sqft` },
          ],
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressCountry: "US",
    },
    ...(property.latitude && property.longitude
      ? { geo: { "@type": "GeoCoordinates", latitude: property.latitude, longitude: property.longitude } }
      : {}),
  };
}

export function organizationSchema(name: string, url: string, logo?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name,
    url,
    logo: logo ?? `${url}/logo.png`,
  };
}