import type { Metadata } from "next";

import { buildMetadata } from "@/utils/seo";
import { PageHero } from "@/components/layout/page-hero";
import { LegalContent } from "@/components/shared/legal-content";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How VINAY collects, uses and protects your personal information.",
  canonicalPath: "/privacy-policy",
});

export default async function PrivacyPolicyPage() {
  const site = await getSiteSettings();

  const sections = [
    {
      title: "1. Information We Collect",
      body: `We collect information you provide directly — such as your name, email address and phone number when you fill in inquiry forms, book viewings, or subscribe to our newsletter. We also collect limited technical data (device type, browser, pages visited) to improve your experience.`,
    },
    {
      title: "2. How We Use Your Information",
      body: `Your information is used to respond to inquiries, schedule property viewings, send newsletter updates you requested, improve our services, and comply with legal obligations. We never sell your personal data to third parties.`,
    },
    {
      title: "3. Cookies & Analytics",
      body: `${site.siteName} uses essential cookies for authentication and preferences, and optional analytics cookies to understand how visitors use the site. You can disable cookies in your browser at any time.`,
    },
    {
      title: "4. Data Security",
      body: `We protect your data with industry-standard measures including encrypted connections (HTTPS), hashed passwords, restricted access controls and regular security reviews.`,
    },
    {
      title: "5. Your Rights",
      body: `You may request access to, correction of, or deletion of your personal data at any time by contacting us at ${site.email}. We respond to all requests within 30 days.`,
    },
    {
      title: "6. Third-Party Services",
      body: `We use trusted third-party services for analytics, maps, and payment processing where applicable. These providers handle data under their own privacy policies.`,
    },
    {
      title: "7. Contact Us",
      body: `For any privacy questions or concerns, please contact us at ${site.email} or ${site.phone}.`,
    },
  ];

  return (
    <>
      <PageHero
        title="Privacy Policy"
        description="Your privacy matters to us. Here's how we handle your information."
        crumbs={[{ label: "Privacy Policy" }]}
        compact
      />
      <LegalContent sections={sections} updated="January 1, 2026" />
    </>
  );
}