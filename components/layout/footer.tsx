import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

import { getSiteSettings } from "@/lib/site";
import { NewsletterForm } from "@/components/shared/newsletter-form";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Agents", href: "/agents" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

const SERVICES = [
  { label: "Buy a Home", href: "/properties?purpose=SALE&type=HOUSE" },
  { label: "Rent an Apartment", href: "/properties?purpose=RENT&type=APARTMENT" },
  { label: "Luxury Villas", href: "/properties?type=VILLA" },
  { label: "Commercial Spaces", href: "/properties?type=COMMERCIAL" },
  { label: "Plots & Land", href: "/properties?type=PLOT" },
  { label: "Penthouses", href: "/properties?type=PENTHOUSE" },
];

const POPULAR_CITIES = ["San Francisco", "New York", "Chicago", "Austin", "Seattle", "San Jose"];

export async function Footer() {
  const site = await getSiteSettings();

  return (
    <footer className="bg-[#081126] text-slate-300">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.4fr]">
        {/* Brand */}
        <div className="space-y-5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 font-display text-lg font-black text-slate-900">
              V
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl font-black tracking-[0.14em] text-white">VINAY</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-amber-400">
                Find Your Dream
              </span>
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-slate-400">{site.description}</p>
          <div className="flex gap-2">
            {[
              { icon: Facebook, href: site.social.facebook, label: "Facebook" },
              { icon: Instagram, href: site.social.instagram, label: "Instagram" },
              { icon: Twitter, href: site.social.twitter, label: "Twitter" },
              { icon: Linkedin, href: site.social.linkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-all hover:-translate-y-0.5 hover:bg-amber-500 hover:text-slate-900"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-5 font-display text-base font-bold uppercase tracking-wider text-white">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-amber-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="mb-5 font-display text-base font-bold uppercase tracking-wider text-white">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-amber-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cities */}
        <div>
          <h4 className="mb-5 font-display text-base font-bold uppercase tracking-wider text-white">Popular Cities</h4>
          <ul className="space-y-2.5 text-sm">
            {POPULAR_CITIES.map((c) => (
              <li key={c}>
                <Link href={`/properties?q=${encodeURIComponent(c)}`} className="transition-colors hover:text-amber-400">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + newsletter */}
        <div className="space-y-5">
          <h4 className="font-display text-base font-bold uppercase tracking-wider text-white">Stay Updated</h4>
          <p className="text-sm text-slate-400">Subscribe for new listings and market insights.</p>
          <NewsletterForm />
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <a href={`tel:${site.phone}`} className="hover:text-amber-400">{site.phone}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <a href={`mailto:${site.email}`} className="hover:text-amber-400">{site.email}</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.siteName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-amber-400">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-400">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-amber-400">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}