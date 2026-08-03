export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/utils/seo";
import { PageHero } from "@/components/layout/page-hero";
import { AgentCard } from "@/components/shared/agent-card";
import { Reveal } from "@/components/shared/reveal";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = buildMetadata({
  title: "Our Agents",
  description: "Meet the experienced VINAY real estate agents ready to help you buy, sell or rent.",
  canonicalPath: "/agents",
});

export default async function AgentsPage() {
  const agents = await prisma.agent.findMany({
    where: { active: true },
    orderBy: { rating: "desc" },
    include: { _count: { select: { properties: true } } },
  });

  return (
    <>
      <PageHero
        title="Meet Our Expert Agents"
        description="A dedicated team of professionals helping you buy, sell, and invest with confidence."
        crumbs={[{ label: "Agents" }]}
      />
      <section className="section-pad">
        <div className="container-site">
          {agents.length === 0 ? (
            <EmptyState title="No agents yet" description="Our team will be listed here soon." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 0.08}>
                  <AgentCard agent={a} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}