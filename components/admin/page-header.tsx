import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
  href,
}: {
  title: string;
  description?: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="heading-display text-2xl font-bold md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && href && (
        <Link href={href}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> {action}
          </Button>
        </Link>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  to,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  hint?: string;
  to?: string;
  accent?: boolean;
}) {
  const body = (
    <div
      className={cn(
        "card-lift flex items-start justify-between rounded-2xl border bg-card p-5",
        accent && "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground"
      )}
    >
      <div>
        <p className={cn("text-xs font-semibold uppercase tracking-wider", accent ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {label}
        </p>
        <p className="mt-2 font-display text-3xl font-black">{value}</p>
        {hint && <p className={cn("mt-1 text-xs", accent ? "text-primary-foreground/80" : "text-muted-foreground")}>{hint}</p>}
      </div>
      <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", accent ? "bg-white/15 text-white" : "bg-primary/10 text-primary")}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
  return to ? <Link href={to}>{body}</Link> : body;
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
      <ArrowRight className="h-4 w-4 rotate-180" /> {label}
    </Link>
  );
}