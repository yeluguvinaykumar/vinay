"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  url: string;
  alt?: string | null;
}

export function PropertyGallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = React.useState(0);
  const [lightbox, setLightbox] = React.useState<number | null>(null);
  const list = images.length ? images : [{ url: "", alt: title }];

  const go = (dir: 1 | -1) => {
    setActive((prev) => (prev + dir + list.length) % list.length);
  };

  const goLightbox = (dir: 1 | -1) => {
    setLightbox((prev) => (prev === null ? null : (prev + dir + list.length) % list.length));
  };

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9]">
        {list[active].url ? (
          <Image
            src={list[active].url}
            alt={list[active].alt ?? title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15">
            <span className="font-display text-6xl text-primary/25">VINAY</span>
          </div>
        )}

        {list.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 opacity-0 shadow transition-all hover:bg-white group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {active + 1} / {list.length}
            </span>
          </>
        )}
        <button
          onClick={() => setLightbox(active)}
          className="absolute inset-0"
          aria-label="Open fullscreen gallery"
          tabIndex={-1}
        />
      </div>

      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                active === i ? "border-accent shadow" : "border-transparent opacity-70 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
            >
              {img.url ? (
                <Image src={img.url} alt={img.alt ?? `${title} ${i + 1}`} fill sizes="96px" className="object-cover" />
              ) : (
                <div className="h-full w-full bg-muted" />
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(-1);
            }}
            className="absolute left-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <figure className="max-h-full" onClick={(e) => e.stopPropagation()}>
            {list[lightbox].url && (
              <Image
                src={list[lightbox].url}
                alt={list[lightbox].alt ?? title}
                width={1600}
                height={1000}
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
            )}
          </figure>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(1);
            }}
            className="absolute right-4 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}