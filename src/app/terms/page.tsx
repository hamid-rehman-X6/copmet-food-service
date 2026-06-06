import type { Metadata } from "next";
import { legalLastUpdated, termsSections, termsSummaries } from "@/constants/legal.constants";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Copmet Food Service",
  description: "Review the terms for using Copmet Food Service frozen meal ordering, delivery, and account features.",
};

export default function TermsPage() {
  return (
    <LegalPage
      alternateLink={{ label: "Read privacy policy", href: "/privacy" }}
      description="A clear overview of how Copmet Food Service frozen meal orders, accounts, deliveries, storage expectations, and customer responsibilities work."
      eyebrow="Service terms"
      lastUpdated={legalLastUpdated}
      sections={termsSections}
      summaries={termsSummaries}
      title="Terms of Service"
    />
  );
}
