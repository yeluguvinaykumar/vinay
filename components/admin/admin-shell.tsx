"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  FolderKanban,
  Home,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquareQuote,
  Menu,
  Newspaper,
  Settings,
  Star,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { group: "Overview", items: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ]},
  { group: "Content", items: [
    { label: "Properties", href: "/admin/properties", icon: BedDouble },
    { label: "Agents", href: "/admin/agents", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: FolderKanban },
    { label: "Blog", href: "/admin/blogs", icon: Newspaper },
    { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  ]},
  { group: "Inbox", items: [
    { label: "Leads", href: "/admin/leads", icon: Inbox },
    { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
    { label: "Messages", href: "/admin/messages", icon: Mail },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  ]},
  { group: "System", items: [
    { label: "Media Library", href: "/admin/media", icon: Image },
    { label: "Settings & SEO", href: "/admin/settings", icon: Settings },
  ]},
];

export function AdminShell({ user, children }: { user: { name: string; email: string }; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/login");
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 font-display text-lg font-black text-white">
            V
          </span>
          <div className="leading-none">
            <p className="font-display text-lg font-black tracking-widest">VINAY</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
            {user.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className="col-span-2">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Home className="h-4 w-4" /> View Website
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="col-span-2 gap-2 text-destructive" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-[1600px] gap-0">
      {/* Desktop sidebar */}
      <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-72 shrink-0 border-r bg-card lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-card shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 rounded-full p-1.5 hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="Open admin menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}