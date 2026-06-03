import { CommunitySection } from "@/components/home/CommunitySection";
import { FeaturedMeals } from "@/components/home/FeaturedMeals";
import { HomeHero } from "@/components/home/HomeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { NewsletterCta } from "@/components/home/NewsletterCta";
import { Icon } from "@/components/common/Icon";
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
      <button
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-secondary text-secondary-foreground shadow-(--shadow-lift) transition-transform hover:scale-105"
      >
        <Icon className="h-6 w-6" name="message" />
      </button>
    </>
  );
}
