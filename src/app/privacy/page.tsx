import type { Metadata } from "next";
import { legalLastUpdated, privacySections, privacySummaries } from "@/constants/legal.constants";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Copmet Food Service",
  description: "Learn how Copmet Food Service collects, uses, and protects customer information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      alternateLink={{ label: "Read terms of service", href: "/terms" }}
      description="How Copmet Food Service handles customer information for accounts, ordering, delivery, support, and service reliability."
      eyebrow="Privacy policy"
      lastUpdated={legalLastUpdated}
      sections={privacySections}
      summaries={privacySummaries}
      title="Privacy Policy"
    />
  );
}
