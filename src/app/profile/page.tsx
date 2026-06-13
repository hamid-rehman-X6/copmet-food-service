import type { Metadata } from "next";
import { ProfilePanel } from "@/components/profile/ProfilePanel";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Your Profile | Copmet Food Service",
  description: "Manage your account details, profile photo, and password.",
};

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell py-8 sm:py-12 lg:py-16">
        <div className="mb-8 sm:mb-10">
          <h1 className="heading-font text-4xl font-bold tracking-tight sm:text-5xl">Your Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-lg">
            Manage your account details, profile photo, and password.
          </p>
        </div>
        <div className="mx-auto max-w-3xl">
          <ProfilePanel />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
