import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AgentForm } from "@/components/admin/agent-form";
import { BackLink } from "@/components/admin/page-header";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAgentPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect(`/login?next=/admin/agents/${id}/edit`);

  const agent = await prisma.agent.findUnique({ where: { id } });
  if (!agent) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/admin/agents" label="Back to agents" />
      <h1 className="heading-display mb-6 text-2xl font-bold md:text-3xl">Edit Agent</h1>
      <AgentForm
        initial={{
          id: agent.id,
          name: agent.name,
          slug: agent.slug ?? "",
          title: agent.title ?? "",
          email: agent.email,
          phone: agent.phone ?? "",
          whatsapp: agent.whatsapp ?? "",
          photo: agent.photo ?? "",
          bio: agent.bio ?? "",
          experience: agent.experience,
          rating: agent.rating,
          languages: agent.languages,
          active: agent.active,
        }}
      />
    </div>
  );
}