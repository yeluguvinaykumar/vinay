"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapEmbed({
  latitude,
  longitude,
  address,
  className,
  height = 320,
}: {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  className?: string;
  height?: number;
}) {
  const query = latitude && longitude ? `${latitude},${longitude}` : address || "San Francisco";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border", className)}>
      <iframe
        title={`Map of ${query}`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow backdrop-blur-sm">
        <MapPin className="h-3.5 w-3.5 text-destructive" />
        {address ?? query}
      </div>
    </div>
  );
}