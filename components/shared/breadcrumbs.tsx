import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
        <Home className="h-3.5 w-3.5" />
        Home
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="max-w-[220px] truncate text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}