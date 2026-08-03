import type { Metadata } from "next";

import { buildMetadata } from "@/utils/seo";
import { PageHero } from "@/components/layout/page-hero";
import { FaqAccordion } from "@/components/shared/faq-accordion";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description: "Answers to the most common questions about buying, selling, renting and investing with VINAY.",
  canonicalPath: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        description="Everything you need to know about buying, selling and renting with VINAY."
        crumbs={[{ label: "FAQ" }]}
      />
      <section className="section-pad">
        <div className="container-site">
          <FaqAccordion />
          <Reveal className="mt-14 text-center">
            <p className="text-muted-foreground">Still have questions?</p>
            <Link href="/contact" className="mt-4 inline-block">
              <Button variant="gold" size="lg">
                Talk to Our Team
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}