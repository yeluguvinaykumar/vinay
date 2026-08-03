import type { Metadata } from "next";

import { buildMetadata } from "@/utils/seo";
import { PageHero } from "@/components/layout/page-hero";
import { LegalContent } from "@/components/shared/legal-content";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms and conditions governing your use of the VINAY platform.",
  canonicalPath: "/terms",
});

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing the VINAY website you agree to these Terms of Service. If you do not agree, please do not use the platform.",
    },
    {
      title: "2. Use of the Platform",
      body: "The platform is provided for personal, non-commercial use. You agree not to misuse listings, scrape content, attempt unauthorised access, or interfere with the operation of the service.",
    },
    {
      title: "3. Property Listings",
      body: "Listings are provided for informational purposes. While we verify listings, property details such as price, size and availability can change. Always confirm critical details with a licensed agent before entering any agreement.",
    },
    {
      title: "4. No Real Estate Legal Advice",
      body: "VINAY provides marketing and brokerage-connection services. Content on this site is not legal, tax or financial advice. Consult qualified professionals for such matters.",
    },
    {
      title: "5. User Conduct",
      body: "You agree to provide accurate information in all forms, not to post misleading content, and not to use the platform for unlawful purposes.",
    },
    {
      title: "6. Intellectual Property",
      body: "All content, logos and trademarks on this site are the property of VINAY. You may not reproduce or redistribute them without written permission.",
    },
    {
      title: "7. Limitation of Liability",
      body: "VINAY is not liable for indirect or consequential damages arising from use of the platform or reliance on listing information.",
    },
    {
      title: "8. Changes to Terms",
      body: "We may update these terms periodically. Continued use of the site after changes constitutes acceptance of the revised terms.",
    },
    {
      title: "9. Contact",
      body: "Questions about these terms? Contact us at hello@vinay.com or +1 (415) 555-0182.",
    },
  ];

  return (
    <>
      <PageHero
        title="Terms of Service"
        description="The rules of the road for using VINAY."
        crumbs={[{ label: "Terms" }]}
        compact
      />
      <LegalContent sections={sections} updated="January 1, 2026" />
    </>
  );
}