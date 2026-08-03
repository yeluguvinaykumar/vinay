"use client";

import * as React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlist } from "@/hooks/use-wishlist";
import { PropertyCard } from "@/components/shared/property-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropertyListItem } from "@/types";

export default function WishlistPage() {
  const { ids, loaded } = useWishlist();
  const [properties, setProperties] = React.useState<PropertyListItem[] | null>(null);

  React.useEffect(() => {
    if (!loaded) return;
    if (ids.length === 0) {
      setProperties([]);
      return;
    }
    fetch(`/api/properties?ids=${encodeURIComponent(ids.join(","))}`)
      .then((r) => r.json())
      .then((json) => setProperties(json.success ? json.data.properties : []))
      .catch(() => setProperties([]));
  }, [ids, loaded]);

  return (
    <div className="hero-gradient pb-16 pt-32">
      <div className="container-site">
        <h1 className="heading-display text-3xl font-bold text-white md:text-4xl">Your Wishlist</h1>
        <p className="mt-2 text-slate-300">Properties you&apos;ve saved for later.</p>

        <div className="mt-10">
          {!loaded || !properties ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-2xl" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              title="Your wishlist is empty"
              description="Tap the heart icon on any property to save it here for later."
              action={{ label: "Browse Properties", href: "/properties" }}
            />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
              <p className="mt-8 flex items-center gap-2 text-sm text-slate-300">
                <Heart className="h-4 w-4 text-red-400" />
                Saved on this device — {properties.length} {properties.length === 1 ? "property" : "properties"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}