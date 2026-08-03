export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-muted/40 pt-[72px]">
      <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>
    </div>
  );
}