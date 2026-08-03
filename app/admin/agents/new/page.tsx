import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { AgentForm } from "@/components/admin/agent-form";
import { BackLink } from "@/components/admin/page-header";

export default async function NewAgentPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?next=/admin/agents/new");

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/admin/agents" label="Back to agents" />
      <h1 className="heading-display mb-6 text-2xl font-bold md:text-3xl">Add New Agent</h1>
      <AgentForm />
    </div>
  );
}