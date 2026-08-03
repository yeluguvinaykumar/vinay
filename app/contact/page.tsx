import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import { getSiteSettings } from "@/lib/site";
import { buildMetadata } from "@/utils/seo";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/shared/contact-form";
import { MapEmbed } from "@/components/shared/map-embed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with VINAY — call, email or visit our office. We're here to help you find your dream property.",
  canonicalPath: "/contact",
});

export default async function ContactPage() {
  const site = await getSiteSettings();

  return (
    <>
      <PageHero
        title="Contact Us"
        description="Questions about a property or our services? Our team is ready to help."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section-pad">
        <div className="container-site grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-2xl">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Info */}
          <div className="space-y-5">
            <Card>
              <CardContent className="space-y-5 p-6">
                <ContactRow icon={Phone} label="Phone" value={site.phone} href={`tel:${site.phone}`} />
                <ContactRow icon={Mail} label="Email" value={site.email} href={`mailto:${site.email}`} />
                <ContactRow icon={MapPin} label="Office" value={site.address} />
                <ContactRow icon={Clock} label="Business hours" value={site.businessHours} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <a
                  href={site.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <MapPin className="h-4 w-4" /> Open in Google Maps
                </a>
                <MapEmbed address={site.address} height={280} />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="flex flex-col items-start gap-3 p-6">
                <Send className="h-6 w-6 text-amber-300" />
                <h3 className="font-display text-lg font-bold">Prefer WhatsApp?</h3>
                <p className="text-sm text-primary-foreground/85">Chat with our support team instantly.</p>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5"
                >
                  Start WhatsApp Chat
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-bold transition-colors hover:text-primary">
            {value}
          </a>
        ) : (
          <p className="text-sm font-bold">{value}</p>
        )}
      </div>
    </div>
  );
  return content;
}