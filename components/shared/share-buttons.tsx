"use client";

import * as React from "react";
import { Facebook, Link2, Linkedin, Send, Twitter } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShareButtons({ url, title, className }: { url: string; title: string; className?: string }) {
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
  const encoded = encodeURIComponent(fullUrl);
  const text = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const items = [
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, color: "hover:bg-blue-600 hover:text-white" },
    { label: "Twitter / X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`, color: "hover:bg-slate-900 hover:text-white" },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, color: "hover:bg-sky-700 hover:text-white" },
    { label: "WhatsApp", icon: Send, href: `https://wa.me/?text=${text}%20${encoded}`, color: "hover:bg-emerald-600 hover:text-white" },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {items.map((item) => (
        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${item.label}`}>
          <Button variant="outline" size="icon" className={cn("rounded-full transition-colors", item.color)}>
            <item.icon className="h-4 w-4" />
          </Button>
        </a>
      ))}
      <Button variant="outline" size="icon" className="rounded-full" onClick={copy} aria-label="Copy link">
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}