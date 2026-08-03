"use client";

import * as React from "react";
import { Award, Building2, MapPin, Users } from "lucide-react";

import { StatCounter } from "@/components/shared/stat-counter";
import { Reveal } from "@/components/shared/reveal";

const STATS = [
  { icon: Award, label: "Years Experience", key: "years", suffix: "+" },
  { icon: Building2, label: "Properties Sold", key: "sold", suffix: "+" },
  { icon: Users, label: "Happy Clients", key: "clients", suffix: "+" },
  { icon: MapPin, label: "Cities Covered", key: "cities", suffix: "" },
];

export function StatsSection({ stats }: { stats: { years: string; sold: string; clients: string; cities: string } }) {
  const values: Record<string, number> = {
    years: Number(stats.years) || 0,
    sold: Number(stats.sold) || 0,
    clients: Number(stats.clients) || 0,
    cities: Number(stats.cities) || 0,
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1739] via-[#12235c] to-[#1d3a8f] py-16 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(229,183,44,0.6) 1.5px, transparent 1.5px)",
          backgroundSize: "42px 42px",
        }}
      />
      <div className="container-site relative grid grid-cols-2 gap-10 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.08} className="text-center">
            <s.icon className="mx-auto mb-4 h-9 w-9 text-amber-400" />
            <p className="font-display text-4xl font-black md:text-5xl">
              <StatCounter value={values[s.key]} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}