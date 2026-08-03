export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Languages, Mail, MessageCircle, Phone } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/utils/seo";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { AgentCard } from "@/components/shared/agent-card";
import { PropertyCard } from "@/components/shared/property-card";
import { Rating } from "@/components/shared/rating";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = await prisma.agent.findUnique({ where: { slug } });
  if (!agent) return {};
  return buildMetadata({
    title: agent.name,
    description: agent.bio?.slice(0, 155) ?? `${agent.name} — real estate agent at VINAY.`,
    image: agent.photo ?? undefined,
    canonicalPath: `/agents/${slug}`,
  });
}

export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = await prisma.agent.findUnique({
    where: { slug, active: true },
    include: {
      _count: { select: { properties: true } },
      properties: {
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true, title: true, slug: true, price: true, discountPrice: true, type: true, purpose: true,
          status: true, bedrooms: true, bathrooms: true, area: true, city: true, state: true, address: true,
          coverImage: true, featured: true, furnished: true, createdAt: true,
          agent: { select: { name: true, slug: true, photo: true } },
          category: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!agent) notFound();

  const social = (agent.social as Record<string, string> | null) ?? {};
  const languages = agent.languages ?? [];

  return (
    <>
      <div className="bg-muted/40 pt-28">
        <div className="container-site pb-6">
          <Breadcrumbs items={[{ label: "Agents", href: "/agents" }, { label: agent.name }]} />
        </div>
      </div>

      <section className="bg-muted/40 pb-12">
        <div className="container-site">
          <Card className="overflow-hidden">
            <div className="relative h-36 bg-gradient-to-r from-primary via-primary/80 to-accent/60 md:h-44">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "radial-gradient(circle at 25% 40%, white 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
            </div>
            <CardContent className="relative p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-end">
                <div className="-mt-24 shrink-0">
                  <Avatar className="h-36 w-36 rounded-3xl border-4 border-white shadow-xl">
                    <AvatarImage src={agent.photo ?? undefined} alt={agent.name} />
                    <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h1 className="heading-display text-3xl font-bold md:text-4xl">{agent.name}</h1>
                  <p className="mt-1 text-muted-foreground">{agent.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Rating value={agent.rating} size={15} />
                      <b>{agent.rating.toFixed(1)}</b>
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-accent" />
                      {agent.experience} years experience
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span>{agent._count.properties} properties listed</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {agent.phone && (
                    <Button asChild>
                      <a href={`tel:${agent.phone}`}><Phone className="h-4 w-4" /> Call</a>
                    </Button>
                  )}
                  {agent.whatsapp && (
                    <Button variant="outline" className="text-emerald-600" asChild>
                      <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-8 md:grid-cols-3">
                <div className="space-y-4 md:col-span-2">
                  <h2 className="font-display text-xl font-bold">About {agent.name.split(" ")[0]}</h2>
                  <p className="leading-relaxed text-muted-foreground">{agent.bio || "Passionate about helping clients find the right property."}</p>
                </div>
                <div className="space-y-3 rounded-2xl bg-muted/60 p-5 text-sm">
                  <p className="font-display font-bold">Contact details</p>
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-primary">
                      <Phone className="h-4 w-4 text-accent" /> {agent.phone}
                    </a>
                  )}
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-primary">
                    <Mail className="h-4 w-4 text-accent" /> {agent.email}
                  </a>
                  {agent.whatsapp && (
                    <a href={`https://wa.me/${agent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-600 hover:underline">
                      <MessageCircle className="h-4 w-4" /> WhatsApp chat
                    </a>
                  )}
                  {languages.length > 0 && (
                    <p className="flex items-center gap-2 pt-2 text-muted-foreground">
                      <Languages className="h-4 w-4 text-accent" /> {languages.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-site">
          <h2 className="heading-display mb-8 text-center text-2xl font-bold md:text-3xl">
            Listings by {agent.name.split(" ")[0]}
          </h2>
          {agent.properties.length === 0 ? (
            <p className="text-center text-muted-foreground">No active listings right now.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agent.properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}