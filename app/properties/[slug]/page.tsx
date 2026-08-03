export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bath,
  BedDouble,
  Building,
  Car,
  CheckCircle2,
  Expand,
  MapPin,
  Phone,
  Ruler,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { buildMetadata, realEstateSchema } from "@/utils/seo";
import { formatPrice, formatArea } from "@/utils/format";
import { PROPERTY_TYPE_LABELS, PURPOSE_LABELS, STATUS_LABELS } from "@/types";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PropertyGallery } from "@/components/shared/property-gallery";
import { MapEmbed } from "@/components/shared/map-embed";
import { MortgageCalculator } from "@/components/shared/mortgage-calculator";
import { InquiryForm } from "@/components/shared/inquiry-form";
import { ShareButtons } from "@/components/shared/share-buttons";
import { PropertyCard } from "@/components/shared/property-card";
import { Rating } from "@/components/shared/rating";
import { ReviewsSection } from "@/components/shared/reviews-section";
import { DetailShareButton, DetailWishlistButton, VisitButton } from "@/components/shared/detail-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    select: { title: true, description: true, coverImage: true, city: true, metaTitle: true, metaDescription: true },
  });
  if (!property) return {};
  return buildMetadata({
    title: property.metaTitle ?? property.title,
    description: property.metaDescription ?? property.description.slice(0, 155),
    image: property.coverImage ?? undefined,
    canonicalPath: `/properties/${slug}`,
  });
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sort: "asc" } },
      agent: true,
      category: true,
      _count: { select: { reviews: true } },
    },
  });

  if (!property) notFound();

  // Increment view counter (fire-and-forget)
  void prisma.property.update({ where: { id: property.id }, data: { views: { increment: 1 } } });

  const related = await prisma.property.findMany({
    where: {
      OR: [{ type: property.type }, { city: property.city }],
      NOT: { id: property.id },
    },
    take: 3,
    select: {
      id: true, title: true, slug: true, price: true, discountPrice: true, type: true, purpose: true,
      status: true, bedrooms: true, bathrooms: true, area: true, city: true, state: true, address: true,
      coverImage: true, featured: true, furnished: true, createdAt: true,
      agent: { select: { name: true, slug: true, photo: true } },
      category: { select: { name: true, slug: true } },
    },
  });

  const reviews = await prisma.review.findMany({
    where: { propertyId: property.id, approved: true },
    orderBy: { createdAt: "desc" },
  });
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const gallery = property.images.length
    ? property.images
    : property.coverImage
      ? [{ url: property.coverImage, alt: property.title }]
      : [];

  const nearby = (property.nearbyPlaces as { name: string; type: string; distance: string }[] | null) ?? [];
  const floorPlans = (property.floorPlans as string[] | null) ?? [];
  const amenities = property.amenities ?? [];
  const effectivePrice = property.discountPrice ?? property.price;
  const url = `${SITE_URL}/properties/${property.slug}`;

  const schema = realEstateSchema({
    name: property.title,
    description: property.description.slice(0, 400),
    price: effectivePrice,
    image: property.coverImage ?? "",
    url,
    address: property.address,
    city: property.city,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    latitude: property.latitude,
    longitude: property.longitude,
  });

  const specItems = [
    { icon: BedDouble, label: "Bedrooms", value: property.bedrooms ? String(property.bedrooms) : "—" },
    { icon: Bath, label: "Bathrooms", value: property.bathrooms ? String(property.bathrooms) : "—" },
    { icon: Ruler, label: "Area", value: formatArea(property.area) },
    { icon: Car, label: "Parking", value: property.parking ? `${property.parking} spots` : "—" },
    { icon: Expand, label: "Built up", value: property.builtUpArea ? formatArea(property.builtUpArea) : "—" },
    { icon: Building, label: "Year built", value: property.yearBuilt ? String(property.yearBuilt) : "—" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="bg-muted/40 pt-28">
        <div className="container-site pb-4">
          <Breadcrumbs
            items={[
              { label: "Properties", href: "/properties" },
              { label: property.title },
            ]}
          />
        </div>
      </div>

      <section className="bg-muted/40 pb-8">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Left: gallery + details */}
            <div className="space-y-8">
              <PropertyGallery images={gallery} title={property.title} />

              <Card>
                <CardContent className="space-y-5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={property.status === "AVAILABLE" ? "green" : property.status === "SOLD" ? "red" : "yellow"}>
                          {STATUS_LABELS[property.status]}
                        </Badge>
                        <Badge variant="secondary">{PROPERTY_TYPE_LABELS[property.type]}</Badge>
                        {property.purpose && <Badge variant="gold">{PURPOSE_LABELS[property.purpose]}</Badge>}
                        {property.featured && <Badge variant="blue">Featured</Badge>}
                      </div>
                      <h1 className="heading-display text-2xl font-bold md:text-3xl">{property.title}</h1>
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-accent" />
                        {property.address}, {property.city}
                        {property.state ? `, ${property.state}` : ""}
                      </p>
                      {avgRating > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          <Rating value={avgRating} />
                          <span className="text-xs text-muted-foreground">
                            {avgRating.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-display text-3xl font-black text-primary">
                        {formatPrice(effectivePrice, property.purpose)}
                      </p>
                      {property.discountPrice && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatPrice(property.price, property.purpose)}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {specItems.map((s) => (
                      <div key={s.label} className="rounded-xl bg-muted/60 p-3 text-center">
                        <s.icon className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                        <p className="text-sm font-bold">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2 className="mb-2 font-display text-xl font-bold">Description</h2>
                    <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{property.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              {amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-xl">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {amenities.map((a) => (
                      <span key={a} className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        {a}
                      </span>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Nearby */}
              {nearby.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-xl">
                      <MapPin className="h-5 w-5 text-accent" /> Nearby Places
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 sm:grid-cols-3">
                    {nearby.map((n, i) => (
                      <div key={i} className="rounded-xl border p-4">
                        <p className="text-sm font-bold capitalize">{n.name}</p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          {n.type} · {n.distance}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Floor plans */}
              {floorPlans.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Floor Plans</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {floorPlans.map((f, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={f} alt={`Floor plan ${i + 1}`} className="rounded-xl border" loading="lazy" />
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Map */}
              {(property.latitude || property.longitude || property.address) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-display text-xl">
                      <MapPin className="h-5 w-5 text-destructive" /> Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MapEmbed
                      latitude={property.latitude}
                      longitude={property.longitude}
                      address={`${property.address}, ${property.city}`}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <ReviewsSection propertyId={property.id} initial={reviews} />
            </div>

            {/* Right: sidebar */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary to-primary/85 text-primary-foreground">
                  <CardTitle className="font-display text-lg">Interested in this property?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-5">
                  <Button className="w-full" size="lg" asChild>
                    <a href={`tel:${property.agent?.phone ?? ""}`}>
                      <Phone className="h-4 w-4" /> Call Agent
                    </a>
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailShareButton />
                    <DetailWishlistButton id={property.id} title={property.title} />
                  </div>
                </CardContent>
              </Card>

              {property.agent && (
                <Card>
                  <CardContent className="p-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Listed by agent
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={property.agent.photo ?? undefined} alt={property.agent.name} />
                        <AvatarFallback>{property.agent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link href={`/agents/${property.agent.slug}`} className="font-bold hover:text-primary">
                          {property.agent.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">{property.agent.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs">
                          <Rating value={property.agent.rating} size={12} />
                          {property.agent.rating}
                        </p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                      {property.agent.phone && (
                        <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 hover:text-primary">
                          <Phone className="h-4 w-4 text-accent" /> {property.agent.phone}
                        </a>
                      )}
                      {property.agent.email && (
                        <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 hover:text-primary">
                          <span className="flex h-4 w-4 items-center justify-center">✉</span>
                          {property.agent.email}
                        </a>
                      )}
                      {property.agent.whatsapp && (
                        <a
                          href={`https://wa.me/${property.agent.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-emerald-600 hover:underline"
                        >
                          <span className="flex h-4 w-4 items-center justify-center">💬</span>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <MortgageCalculator price={effectivePrice} />

              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-lg">Schedule a Visit</CardTitle>
                </CardHeader>
                <CardContent>
                  <VisitButton title={property.title} id={property.id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section className="section-pad">
        <div className="container-site">
          <Card className="mx-auto max-w-3xl">
            <CardHeader className="text-center">
              <CardTitle className="font-display text-2xl">Send an Inquiry</CardTitle>
            </CardHeader>
            <CardContent>
              <InquiryForm propertyId={property.id} propertyTitle={property.title} compact />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section-pad bg-muted/40">
          <div className="container-site">
            <h2 className="heading-display mb-8 text-center text-3xl font-bold">Similar Properties</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
