"use client";

import * as React from "react";
import { CalendarDays, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/shared/booking-dialog";
import { useWishlist } from "@/hooks/use-wishlist";

export function DetailShareButton() {
  const copy = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
      }
    } catch {
      /* user cancelled */
    }
  };
  return (
    <Button variant="outline" size="lg" className="w-full" onClick={copy}>
      <Share2 className="h-4 w-4" /> Share
    </Button>
  );
}

export function DetailWishlistButton({ id, title }: { id: string; title: string }) {
  const { has, toggle } = useWishlist();
  const wished = has(id);
  return (
    <Button
      variant={wished ? "default" : "outline"}
      size="lg"
      className="w-full"
      onClick={() => {
        toggle(id);
        if (!wished) toast.success("Added to wishlist", { description: title });
      }}
    >
      <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} /> Wishlist
    </Button>
  );
}

export function VisitButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button className="w-full" size="lg" variant="gold" onClick={() => setOpen(true)}>
        <CalendarDays className="h-4 w-4" /> Book a Viewing
      </Button>
      <BookingDialog propertyId={id} propertyTitle={title} open={open} onOpenChange={setOpen} />
    </>
  );
}