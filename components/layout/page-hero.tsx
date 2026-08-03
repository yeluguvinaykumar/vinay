import * as React from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

interface PageHeroProps {
  title: string;
  description?: string;
  crumbs: { label: string; href?: string }[];
  align?: "center" | "left";
  compact?: boolean;
}

export function PageHero({ title, description, crumbs, align = "center", compact = false }: PageHeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden pb-14 pt-32 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="container-site relative">
        <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
          <div className={align === "center" ? "mb-5 flex justify-center" : "mb-5"}>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
          </div>
          <h1 className={`heading-display animate-fade-up text-3xl font-bold text-white md:text-5xl ${compact ? "md:text-4xl" : ""}`}>
            {title}
          </h1>
          {description && (
            <p className="animate-fade-up mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg" style={{ animationDelay: "0.1s" }}>
              {description}
            </p>
          )}
          <span className="mt-6 block h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300" style={{ marginInline: align === "center" ? "auto" : undefined }} />
        </div>
      </div>
    </section>
  );
}