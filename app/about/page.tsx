export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import { Award, BadgeCheck, Eye, Heart, Medal, Target } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { safe } from "@/lib/query";
import { buildMetadata } from "@/utils/seo";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { StatCounter } from "@/components/shared/stat-counter";
import { AgentCard } from "@/components/shared/agent-card";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: "VINAY has been helping families find their dream properties since 2008. Learn our story, mission and values.",
  canonicalPath: "/about",
});

const TIMELINE = [
  { year: "2008", title: "Humble Beginnings", text: "VINAY founded in San Francisco with a single office and a big dream." },
  { year: "2013", title: "500 Homes Sold", text: "We crossed half a thousand happy clients and opened two more offices." },
  { year: "2018", title: "Going Digital", text: "Launched our online platform with live listings and virtual tours." },
  { year: "2022", title: "25 Cities Strong", text: "Expanded across 25 cities with 60+ certified agents nationwide." },
  { year: "2026", title: "The Next Chapter", text: "Now serving thousands of families every year with award-winning service." },
];

export default async function AboutPage() {
  const site = await getSiteSettings();
  const agents = await safe(
    () =>
      prisma.agent.findMany({
        where: { active: true },
        orderBy: { rating: "desc" },
        take: 3,
        include: { _count: { select: { properties: true } } },
      }),
    []
  );
  const stats = site.stats;

  return (
    <>
      <PageHero
        title="About VINAY"
        description="Your trusted partner in real estate — helping you find, buy, and love your dream property."
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="section-pad">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="VINAY team at work"
                  width={1200}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="glass absolute -bottom-6 -right-4 hidden rounded-2xl p-5 sm:block">
                <p className="font-display text-3xl font-black text-primary">
                  <StatCounter value={Number(stats.sold)} suffix="+" />
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Properties Sold
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Our story
            </span>
            <h2 className="heading-display text-3xl font-bold md:text-4xl">
              Building Dreams on <span className="text-gradient-gold italic">Solid Ground</span> Since 2008
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <p>
                VINAY began with a simple belief: finding a home should be an exciting journey, not a stressful one.
                What started as a boutique agency in San Francisco is now one of the most trusted real estate
                platforms in the country.
              </p>
              <p>
                Every day, our certified agents combine local market intelligence, transparent processes and genuine
                care to help families buy, sell and rent with confidence. From first-time buyers to seasoned
                investors, we are here for you.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: BadgeCheck, label: "Certified Agents", value: "60+" },
                { icon: Award, label: "Industry Awards", value: "12" },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3 rounded-2xl border bg-card p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white">
                    <m.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-xl font-black">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="section-pad bg-muted/40">
        <div className="container-site">
          <SectionHeading eyebrow="What drives us" title="Mission, Vision & Values" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Target, title: "Our Mission", text: "Make buying, selling and renting property simple, transparent and delightful for every client." },
              { icon: Eye, title: "Our Vision", text: "To be the most trusted real estate platform, helping a million families find their dream property." },
              { icon: Heart, title: "Our Values", text: "Integrity first, client at heart, data-driven decisions and relentless attention to detail." },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="card-lift h-full rounded-2xl border bg-card p-8 text-center">
                  <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                    <v.icon className="h-8 w-8" />
                  </span>
                  <h3 className="font-display text-xl font-bold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad">
        <div className="container-site max-w-4xl">
          <SectionHeading eyebrow="Our journey" title="Milestones & Achievements" />
          <div className="relative space-y-8 border-l-2 border-primary/20 pl-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08}>
                <div className="relative">
                  <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary bg-card">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </span>
                  <div className="card-lift rounded-2xl border bg-card p-5">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-2xl font-black text-accent">{t.year}</span>
                      <h3 className="font-display text-lg font-bold">{t.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="bg-gradient-to-br from-[#0b1739] to-[#1d3a8f] py-14 text-white">
        <div className="container-site flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: Medal, label: "NAR Certified" },
            { icon: Award, label: "Top Brokerage 2025" },
            { icon: BadgeCheck, label: "Verified Listings" },
            { icon: BadgeCheck, label: "Licensed & Insured" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <c.icon className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-semibold">{c.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      {agents.length > 0 && (
        <section className="section-pad">
          <div className="container-site">
            <SectionHeading
              eyebrow="Leadership"
              title="Meet Our Top Agents"
              description="The people who make VINAY the most trusted name in real estate."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 0.08}>
                  <AgentCard agent={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}