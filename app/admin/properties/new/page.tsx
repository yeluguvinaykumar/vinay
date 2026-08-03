import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PropertyForm } from "@/components/admin/property-form";
import { BackLink } from "@/components/admin/page-header";

export default async function NewPropertyPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login?next=/admin/properties/new");

  const [agents, categories] = await Promise.all([
    prisma.agent.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <BackLink href="/admin/properties" label="Back to properties" />
      <h1 className="heading-display mb-6 text-2xl font-bold md:text-3xl">Add New Property</h1>
      <PropertyForm agents={agents} categories={categories} />
    </div>
  );
}