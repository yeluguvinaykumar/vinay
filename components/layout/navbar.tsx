"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Menu, Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Agents", href: "/agents" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { count } = useWishlist();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || !isHome ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <nav className="container-site flex h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="VINAY home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 font-display text-lg font-black text-white shadow-lg">
            V
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-black tracking-[0.14em] text-foreground">VINAY</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-accent">Find Your Dream</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    active ? "text-primary" : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/compare" className="hidden sm:block" aria-label="Compare properties">
            <Button variant="ghost" size="icon">
              <Scale className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/wishlist" className="relative hidden sm:block" aria-label={`Wishlist (${count} items)`}>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link href="/admin" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-1.5">
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="glass animate-fade-in border-t lg:hidden">
          <ul className="container-site flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2 px-4 pt-2">
              <Link href="/wishlist" className="flex-1">
                <Button variant="outline" className="w-full gap-2">
                  <Heart className="h-4 w-4" /> Wishlist {count > 0 && `(${count})`}
                </Button>
              </Link>
              <Link href="/admin" className="flex-1">
                <Button className="w-full gap-2">
                  <LayoutDashboard className="h-4 w-4" /> Admin
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}