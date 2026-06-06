import { CommunitySection } from "@/components/home/CommunitySection";
import { FeaturedMeals } from "@/components/home/FeaturedMeals";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader showSearch />
      <main>
        <HomeHero />
        <FeaturedMeals />
        <HowItWorks />
        <CommunitySection />
        <NewsletterCta />
      </main>
      <SiteFooter />

      {/* Currently not used */}
      {/* <button
        aria-label="Open chat"
        className="fixed bottom-4 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-(--shadow-lift) transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
      >
        <Icon className="h-6 w-6" name="message" />
      </button> */}
    </>
  );
}
