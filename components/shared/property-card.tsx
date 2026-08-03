"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, Ruler, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatArea, formatPrice } from "@/utils/format";
import { PROPERTY_TYPE_LABELS, PURPOSE_LABELS, STATUS_LABELS, STATUS_VARIANTS } from "@/types";
import type { PropertyListItem } from "@/types";
import { cn } from "@/lib/utils";

export function PropertyCard({ property, className, priority = false }: { property: PropertyListItem; className?: string; priority?: boolean }) {
  const { has, toggle } = useWishlist();
  const wished = has(property.id);
  const [imageError, setImageError] = React.useState(false);

  const share = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/properties/${property.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: property.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <Link href={`/properties/${property.slug}`} className={cn("group block", className)}>
      <article className="card-lift relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative aspect-[4/3] overflow-hidden">
          {property.coverImage && !imageError ? (
            <Image
              src={property.coverImage}
              alt={property.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
              <span className="text-4xl text-primary/30">V</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <Badge variant={STATUS_VARIANTS[property.status] as never} className="backdrop-blur-sm">
              {STATUS_LABELS[property.status] ?? property.status}
            </Badge>
            {property.featured && <Badge variant="gold">Featured</Badge>}
            {property.purpose && <Badge className="bg-slate-900/70 text-white backdrop-blur-sm">{PURPOSE_LABELS[property.purpose]}</Badge>}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-white/80">{PROPERTY_TYPE_LABELS[property.type] ?? property.type}</p>
              <p className="text-lg font-bold text-white drop-shadow">
                {formatPrice(property.discountPrice ?? property.price, property.purpose)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="white"
                size="icon"
                className={cn("h-9 w-9 rounded-full", wished && "bg-red-50")}
                aria-label="Add to wishlist"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggle(property.id);
                  if (!wished) toast.success("Added to wishlist", { description: property.title });
                }}
              >
                <Heart className={cn("h-4 w-4", wished && "fill-red-500 text-red-500")} />
              </Button>
              <Button variant="white" size="icon" className="h-9 w-9 rounded-full" aria-label="Share" onClick={share}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 p-5">
          <h3 className="line-clamp-1 font-display text-lg font-semibold group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="truncate">
              {property.address}, {property.city}
            </span>
          </p>
          <div className="flex items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
            {property.bedrooms != null && property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-primary" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms != null && property.bathrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-primary" /> {property.bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-primary" /> {formatArea(property.area)}
            </span>
          </div>
          {property.agent?.name && (
            <p className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground">
              {property.agent.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={property.agent.photo} alt={property.agent.name} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {property.agent.name.charAt(0)}
                </span>
              )}
              {property.agent.name}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}